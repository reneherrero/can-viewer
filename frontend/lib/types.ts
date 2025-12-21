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

/** Signal definition from DBC */
export interface SignalInfo {
  name: string;
  start_bit: number;
  length: number;
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
  /** Initial active tab */
  initialTab?: 'mdf4' | 'live' | 'dbc';
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
  /** Decode frames using loaded DBC */
  decodeFrames(frames: CanFrame[]): Promise<DecodedSignal[]>;
  /** Load MDF4 file */
  loadMdf4(path: string): Promise<[CanFrame[], DecodedSignal[]]>;
  /** List CAN interfaces */
  listCanInterfaces(): Promise<string[]>;
  /** Start capture on interface */
  startCapture(iface: string): Promise<void>;
  /** Stop capture */
  stopCapture(): Promise<void>;
  /** Get initial files from CLI */
  getInitialFiles(): Promise<InitialFiles>;
  /** Open file dialog */
  openFileDialog(filters: FileFilter[]): Promise<string | null>;
  /** Subscribe to CAN frame events */
  onCanFrame(callback: (frame: CanFrame) => void): () => void;
  /** Subscribe to decoded signal events */
  onDecodedSignal(callback: (signal: DecodedSignal) => void): () => void;
  /** Subscribe to capture error events */
  onCaptureError(callback: (error: string) => void): () => void;
}

export interface FileFilter {
  name: string;
  extensions: string[];
}
