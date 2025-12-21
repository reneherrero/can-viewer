import { TauriApi, CanViewerElement } from './lib';

// Initialize and set up the CAN Viewer
async function main(): Promise<void> {
  // Create the API
  const api = new TauriApi();
  await api.init();

  // Get the viewer element and set the API
  const viewer = document.querySelector('can-viewer') as CanViewerElement;
  if (viewer) {
    viewer.setApi(api);
  }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
