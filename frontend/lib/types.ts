/** CAN frame data */
export interface CanFrame {
  timestamp: number;
  channel: string;
  can_id: number;
  is_extended: boolean;
  is_fd: boolean;
  brs: boolean;
  esi: boolean;
  dlc: number;
  data: number[];
}

/** Decoded signal from DBC */
export interface DecodedSignal {
  timestamp: number;
  message_name: string;
  signal_name: string;
  value: number;
  raw_value: number;
  unit: string;
  description?: string;
}

/** Response from decode command, including any errors */
export interface DecodeResponse {
  signals: DecodedSignal[];
  errors: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Live Capture DTOs (from Rust)
// ─────────────────────────────────────────────────────────────────────────────

/** Capture statistics from Rust */
export interface CaptureStatsDto {
  frame_count: number;
  message_count: number;
  signal_count: number;
  frame_rate: number;
  elapsed_secs: number;
  capture_file: string | null;
}

/** Pre-formatted stats strings from Rust */
export interface StatsHtml {
  message_count: string;
  frame_count: string;
  frame_rate: string;
  elapsed: string;
}

/** Periodic update sent from Rust during live capture */
export interface LiveCaptureUpdate {
  stats: CaptureStatsDto;
  /** Pre-rendered HTML for message monitor table body */
  messages_html: string;
  /** Pre-rendered HTML for signal monitor table body */
  signals_html: string;
  /** Pre-rendered HTML for frame stream table body */
  frames_html: string;
  /** Pre-formatted stats strings */
  stats_html: StatsHtml;
  /** Badge counts */
  message_count: number;
  signal_count: number;
  frame_count: number;
}

/** Signal definition from DBC */
export interface SignalInfo {
  name: string;
  start_bit: number;
  length: number;
  byte_order: string;
  is_signed: boolean;
  factor: number;
  offset: number;
  min: number;
  max: number;
  unit: string;
}

/** Message definition from DBC */
export interface MessageInfo {
  id: number;
  name: string;
  dlc: number;
  sender: string;
  signals: SignalInfo[];
}

/** Full DBC structure */
export interface DbcInfo {
  messages: MessageInfo[];
}

/** Initial files from CLI */
export interface InitialFiles {
  dbc_path: string | null;
  mdf4_path: string | null;
}

/** CAN Viewer configuration */
export interface CanViewerConfig {
  /** Show DBC tab */
  showDbcTab?: boolean;
  /** Show Live Capture tab */
  showLiveTab?: boolean;
  /** Show MDF4 tab */
  showMdf4Tab?: boolean;
  /** Show About tab */
  showAboutTab?: boolean;
  /** Initial active tab */
  initialTab?: 'mdf4' | 'live' | 'dbc' | 'about';
  /** Enable auto-scroll */
  autoScroll?: boolean;
  /** Maximum frames to keep in memory */
  maxFrames?: number;
  /** Maximum signals to keep in memory */
  maxSignals?: number;
}

/** CAN Viewer API interface - implement this for different backends */
export interface CanViewerApi {
  /** Load a DBC file */
  loadDbc(path: string): Promise<string>;
  /** Clear loaded DBC */
  clearDbc(): Promise<void>;
  /** Get DBC info */
  getDbcInfo(): Promise<DbcInfo | null>;
  /** Get path to currently loaded DBC file */
  getDbcPath(): Promise<string | null>;
  /** Decode frames using loaded DBC */
  decodeFrames(frames: CanFrame[]): Promise<DecodeResponse>;
  /** Load MDF4 file */
  loadMdf4(path: string): Promise<[CanFrame[], DecodedSignal[]]>;
  /** Export frames to MDF4 file */
  exportLogs(path: string, frames: CanFrame[]): Promise<number>;
  /** List CAN interfaces */
  listCanInterfaces(): Promise<string[]>;
  /** Start capture on interface, writing to capture file */
  startCapture(iface: string, captureFile: string): Promise<void>;
  /** Stop capture, returns path to finalized MDF4 file */
  stopCapture(): Promise<string>;
  /** Get initial files from CLI */
  getInitialFiles(): Promise<InitialFiles>;
  /** Save DBC content to file */
  saveDbcContent(path: string, content: string): Promise<void>;
  /** Update in-memory DBC for live decoding (does not save to file) */
  updateDbcContent(content: string): Promise<string>;
  /** Open file dialog for loading */
  openFileDialog(filters: FileFilter[]): Promise<string | null>;
  /** Open file dialog for saving */
  saveFileDialog(filters: FileFilter[], defaultName?: string): Promise<string | null>;
  /** Subscribe to CAN frame events */
  onCanFrame(callback: (frame: CanFrame) => void): () => void;
  /** Subscribe to decoded signal events */
  onDecodedSignal(callback: (signal: DecodedSignal) => void): () => void;
  /** Subscribe to decode error events (during live capture) */
  onDecodeError(callback: (error: string) => void): () => void;
  /** Subscribe to capture error events */
  onCaptureError(callback: (error: string) => void): () => void;
  /** Subscribe to live capture updates (from Rust) */
  onLiveCaptureUpdate(callback: (update: LiveCaptureUpdate) => void): () => void;
  /** Subscribe to capture finalized event (MDF4 written) */
  onCaptureFinalized(callback: (path: string) => void): () => void;
}

export interface FileFilter {
  name: string;
  extensions: string[];
}
