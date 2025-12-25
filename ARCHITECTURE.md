# CAN Viewer Architecture

## Overview

CAN Viewer is a Tauri desktop application for viewing and analyzing CAN bus data. The frontend is built with vanilla TypeScript Web Components, using a thin shell pattern with dedicated toolbar components.

```
┌─────────────────────────────────────────────────────────────────┐
│                         can-viewer (shell)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ mdf4-toolbar│  │ live-toolbar│  │ dbc-toolbar │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐              │
│  │mdf4-inspector│  │ live-viewer │  │ dbc-editor  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
frontend/
├── lib/
│   ├── can-viewer.ts              # Shell component (thin orchestrator)
│   ├── events.ts                  # Event bus (mitt)
│   ├── store.ts                   # Reactive stores (app, live)
│   ├── types.ts                   # Shared TypeScript types
│   ├── renderers.ts               # Table cell renderers
│   ├── config.ts                  # Configuration
│   ├── api/                       # Tauri API abstraction
│   │   └── tauri-api.ts
│   ├── utils/                     # Shared utilities
│   │   ├── formatters.ts          # Value formatting
│   │   ├── dlc-detection.ts       # DLC detection logic
│   │   └── helpers.ts             # General helpers
│   └── components/
│       ├── toolbars/              # Dedicated toolbar components
│       │   ├── mdf4-toolbar.ts
│       │   ├── live-toolbar.ts
│       │   └── dbc-toolbar.ts
│       ├── status/                # Header status indicators
│       │   ├── dbc-status.ts
│       │   └── mdf4-status.ts
│       ├── mdf4-inspector/        # MDF4 file viewer
│       ├── live-viewer/           # Live CAN capture
│       ├── dbc-editor/            # DBC file editor
│       └── shared/                # Shared sub-components
│           ├── frames-table.ts    # Reusable frames table
│           ├── signals-panel.ts   # Signal display panel
│           ├── filters-panel.ts   # Frame filtering
│           ├── capture-controls.ts # Capture start/stop controls
│           └── dbc-viewer.ts      # DBC info display
├── styles/
│   └── can-viewer.css             # Global styles
└── main.ts                        # Entry point
```

## Communication Patterns

### Event Bus (Low-Frequency)

Used for infrequent cross-component communication where multiple listeners may react.

```typescript
// events.ts
import mitt from 'mitt';

export type AppEvents = {
  'dbc:changed': DbcChangedEvent;           // DBC content changes (load, clear, update)
  'dbc:state-change': DbcStateChangeEvent;  // Editor state (dirty, editing)
  'mdf4:changed': Mdf4ChangedEvent;         // MDF4 content changes (load, clear, capture-stopped)
  'frame:selected': FrameSelectedEvent;     // Frame selected in table
  'capture:started': CaptureStartedEvent;
  'capture:stopped': CaptureStoppedEvent;
  'live:interfaces-loaded': LiveInterfacesLoadedEvent;
  'tab:switch': TabSwitchEvent;             // Request tab change
};

export const events = mitt<AppEvents>();
```

**Usage:**
```typescript
// Emit
emitDbcChanged({ action: 'loaded', dbcInfo, filename });

// Subscribe
events.on('dbc:changed', (e) => this.onDbcChanged(e));

// Unsubscribe (in disconnectedCallback)
events.off('dbc:changed', this.handleDbcChanged);
```

### Stores (Reactive State)

Two stores separate infrequent state from high-frequency updates:

```typescript
// store.ts

// App state - file paths and loaded data (infrequent updates)
export const appStore = createStore<AppState>({
  dbcFile: null,
  mdf4File: null,
  mdf4Frames: [],
  mdf4Signals: [],  // Pre-decoded signals (if DBC loaded)
});

// Live capture state - updates every 100ms during capture
export const liveStore = createStore<LiveState>({
  isCapturing: false,
  currentInterface: null,
  frameCount: 0,
  messageCount: 0,
});
```

**Usage:**
```typescript
// Update (from live-viewer during capture)
liveStore.set({ frameCount: this.frameBuffer.length });

// Subscribe (in toolbar)
this.unsubscribe = liveStore.subscribe((state) => this.updateUI(state));

// Read current value
const state = liveStore.get();
```

### When to Use Which

| Scenario | Use | Reason |
|----------|-----|--------|
| File loaded/cleared | Event + Store | Event notifies, appStore holds path + data |
| Capture started/stopped | Event | Infrequent state change |
| Frame count during capture | Store | Updates every 100ms |
| Interface list loaded | Event | One-time load |
| DBC editor state | Event | UI-driven, infrequent |
| Tab switch request | Event | Status components request tab change |

## Component Responsibilities

### Shell (can-viewer.ts)

- Routes between tabs (MDF4, Live, DBC, About)
- Renders toolbar components in tab panes
- Wires toolbar events to component methods
- Manages shared DBC state for header display
- Handles initial file loading from CLI args
- **Does NOT** manage toolbar UI state

### Toolbar Components

Self-contained components that:
- Subscribe to relevant events/store on mount
- Unsubscribe on unmount
- Manage their own button states and status indicators
- Emit click events for the shell to forward

```typescript
// Example: mdf4-toolbar.ts
connectedCallback(): void {
  this.render();
  this.bindEvents();
  this.unsubscribe = appStore.subscribe(() => this.updateStatusUI());
  events.on('capture:started', this.handleCaptureStarted);
  events.on('capture:stopped', this.handleCaptureStopped);
}

disconnectedCallback(): void {
  this.unsubscribe?.();
  events.off('capture:started', this.handleCaptureStarted);
  events.off('capture:stopped', this.handleCaptureStopped);
}
```

### Status Components

Independent header indicators that show current file status:
- **dbc-status**: Shows DBC file status (green when loaded, yellow when dirty)
- **mdf4-status**: Shows MDF4 file status (green when loaded, yellow during capture)

Status components:
- Subscribe to `appStore` for file paths
- Subscribe to `liveStore` for capture state (mdf4-status only)
- Subscribe to events for state changes (`dbc:state-change`)
- Emit `tab:switch` event on click to request navigation
- Are completely decoupled from the shell

```typescript
// Example: mdf4-status.ts - subscribes to both stores
connectedCallback(): void {
  this.render();
  this.unsubscribeAppStore = appStore.subscribe(() => this.updateUI());
  this.unsubscribeLiveStore = liveStore.subscribe(() => this.updateUI());
}

disconnectedCallback(): void {
  this.unsubscribeAppStore?.();
  this.unsubscribeLiveStore?.();
}
```

### Feature Components

- **mdf4-inspector**: Static MDF4 file viewing, filtering, signal decoding
- **live-viewer**: Real-time CAN capture with ring buffer, message monitor
- **dbc-editor**: DBC file creation and editing

Each feature component:
- Has its own API interface for Tauri commands
- Manages its internal state
- Emits events for cross-component communication
- Does NOT contain toolbar UI (moved to toolbar components)

## Data Flow Example

### Loading an MDF4 File

```
1. User clicks "Open" in mdf4-toolbar
   └─> toolbar dispatches 'open' event

2. Shell receives event, calls mdf4Inspector.promptLoadMdf4()
   └─> mdf4-inspector opens file dialog via Tauri API

3. File selected, backend loads frames + decodes signals if DBC loaded
   └─> Returns (frames, decodedSignals) to frontend
   └─> Updates appStore.set({ mdf4File, mdf4Frames, mdf4Signals })
   └─> Calls emitMdf4Changed({ action: 'loaded' })

4. mdf4-toolbar subscription to appStore fires
   └─> Updates status dot and filename display

5. User clicks frame in table
   └─> mdf4-inspector filters mdf4Signals by timestamp (no IPC!)
   └─> Falls back to decodeFrames API if no pre-decoded signals
```

### Live Capture Frame Updates

```
1. Frame received from Tauri backend
   └─> live-viewer.handleFrame() buffers it

2. Every 100ms, flushPendingFrames() processes batch
   └─> Updates ring buffer and message monitor
   └─> Calls liveStore.set({ frameCount, messageCount, ... })

3. live-toolbar subscription fires
   └─> Updates export button state based on frameCount
   └─> Updates status display
```

## Styling

All components share a single CSS file (`can-viewer.css`) imported via Vite's `?inline` syntax. Components use class prefixes:

- `.cv-` - CAN Viewer shell and shared
- `.de-` - DBC Editor specific

Shadow DOM is used for encapsulation, with styles injected into each component's shadow root.

## Tauri Integration

The shell creates API adapters for each component:

```typescript
private createMdf4Api(): Mdf4InspectorApi {
  return {
    loadMdf4: (path) => this.api.loadMdf4(path),
    decodeFrames: (frames) => this.api.decodeFrames(frames),
    // ...
  };
}
```

This decouples components from Tauri specifics and enables testing.
