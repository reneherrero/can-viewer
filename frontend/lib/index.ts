// CAN Viewer Library Exports
export type {
  CanFrame,
  DecodedSignal,
  SignalInfo,
  MessageInfo,
  DbcInfo,
  InitialFiles,
  CanViewerConfig,
  CanViewerApi,
  FileFilter,
  // Extension system
  CanViewerExtension,
  ExtensionTab,
} from './types';

export { TauriApi } from './api';
export { CanViewerElement } from './can-viewer';

// Test utilities
export {
  MockApi,
  createMockFrames,
  createMockDbcInfo,
  createMockSignal,
} from './api';
