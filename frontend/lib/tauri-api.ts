import type {
  CanViewerApi,
  CanFrame,
  DecodedSignal,
  DbcInfo,
  InitialFiles,
  FileFilter,
} from './types';

/** Tauri API implementation for CAN Viewer */
export class TauriApi implements CanViewerApi {
  private invoke: (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;
  private listen: (event: string, handler: (event: { payload: unknown }) => void) => Promise<() => void>;
  private openDialog: (options: unknown) => Promise<string | null>;

  constructor() {
    // These will be initialized when Tauri is ready
    this.invoke = async () => { throw new Error('Tauri not initialized'); };
    this.listen = async () => () => {};
    this.openDialog = async () => null;
  }

  /** Initialize Tauri APIs - call this before using the API */
  async init(): Promise<void> {
    type InvokeFn = (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;
    type ListenFn = (event: string, handler: (event: { payload: unknown }) => void) => Promise<() => void>;
    type OpenFn = (options: unknown) => Promise<string | null>;

    const tauri = (window as unknown as { __TAURI__: {
      core: { invoke: InvokeFn };
      event: { listen: ListenFn };
      dialog: { open: OpenFn };
    } }).__TAURI__;

    if (!tauri) {
      throw new Error('Tauri API not available');
    }

    this.invoke = tauri.core.invoke;
    this.listen = tauri.event.listen;
    this.openDialog = tauri.dialog.open;
  }

  async loadDbc(path: string): Promise<string> {
    return await this.invoke('load_dbc', { path }) as string;
  }

  async clearDbc(): Promise<void> {
    await this.invoke('clear_dbc');
  }

  async getDbcInfo(): Promise<DbcInfo | null> {
    return await this.invoke('get_dbc_info') as DbcInfo | null;
  }

  async decodeFrames(frames: CanFrame[]): Promise<DecodedSignal[]> {
    return await this.invoke('decode_frames', { frames }) as DecodedSignal[];
  }

  async loadMdf4(path: string): Promise<[CanFrame[], DecodedSignal[]]> {
    return await this.invoke('load_mdf4', { path }) as [CanFrame[], DecodedSignal[]];
  }

  async listCanInterfaces(): Promise<string[]> {
    return await this.invoke('list_can_interfaces') as string[];
  }

  async startCapture(iface: string): Promise<void> {
    await this.invoke('start_capture', { interface: iface });
  }

  async stopCapture(): Promise<void> {
    await this.invoke('stop_capture');
  }

  async getInitialFiles(): Promise<InitialFiles> {
    return await this.invoke('get_initial_files') as InitialFiles;
  }

  async openFileDialog(filters: FileFilter[]): Promise<string | null> {
    return await this.openDialog({
      multiple: false,
      filters,
    });
  }

  onCanFrame(callback: (frame: CanFrame) => void): () => void {
    let unlisten: (() => void) | null = null;

    this.listen('can-frame', (event) => {
      callback(event.payload as CanFrame);
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      if (unlisten) unlisten();
    };
  }

  onDecodedSignal(callback: (signal: DecodedSignal) => void): () => void {
    let unlisten: (() => void) | null = null;

    this.listen('decoded-signal', (event) => {
      callback(event.payload as DecodedSignal);
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      if (unlisten) unlisten();
    };
  }

  onCaptureError(callback: (error: string) => void): () => void {
    let unlisten: (() => void) | null = null;

    this.listen('capture-error', (event) => {
      callback(event.payload as string);
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      if (unlisten) unlisten();
    };
  }
}
