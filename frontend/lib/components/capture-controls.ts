import { renderInterfaceOptions } from '../renderers';

/** Capture controls component */
export class CaptureControlsElement extends HTMLElement {
  private isCapturing = false;
  private hasFrames = false;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.bindEvents();
  }

  private bindEvents(): void {
    const refreshBtn = this.querySelector('#refreshInterfacesBtn');
    const startBtn = this.querySelector('#startCaptureBtn');
    const stopBtn = this.querySelector('#stopCaptureBtn');
    const exportBtn = this.querySelector('#exportLogsBtn');
    const select = this.querySelector('#interfaceSelect');

    refreshBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('refresh-interfaces', { bubbles: true }));
    });

    startBtn?.addEventListener('click', () => {
      const iface = this.getSelectedInterface();
      if (iface) {
        this.dispatchEvent(new CustomEvent('start-capture', {
          detail: { interface: iface },
          bubbles: true,
        }));
      }
    });

    stopBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('stop-capture', { bubbles: true }));
    });

    exportBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('export-logs', { bubbles: true }));
    });

    select?.addEventListener('change', () => this.updateButtons());
  }

  /** Set available interfaces */
  setInterfaces(interfaces: string[]): void {
    const select = this.querySelector('#interfaceSelect') as HTMLSelectElement;
    if (select) select.innerHTML = renderInterfaceOptions(interfaces);
    this.updateButtons();
  }

  /** Get currently selected interface */
  getSelectedInterface(): string {
    const select = this.querySelector('#interfaceSelect') as HTMLSelectElement;
    return select?.value || '';
  }

  /** Update capture status UI */
  setCaptureStatus(capturing: boolean): void {
    this.isCapturing = capturing;

    const dot = this.querySelector('#statusDot');
    const text = this.querySelector('#statusText');
    const stopBtn = this.querySelector('#stopCaptureBtn') as HTMLButtonElement;

    dot?.classList.toggle('connected', capturing);
    if (text) text.textContent = capturing ? 'Capturing...' : 'Idle';
    if (stopBtn) stopBtn.disabled = !capturing;

    this.updateButtons();
  }

  /** Update whether there are frames to export */
  setHasFrames(hasFrames: boolean): void {
    this.hasFrames = hasFrames;
    this.updateButtons();
  }

  private updateButtons(): void {
    const select = this.querySelector('#interfaceSelect') as HTMLSelectElement;
    const startBtn = this.querySelector('#startCaptureBtn') as HTMLButtonElement;
    const exportBtn = this.querySelector('#exportLogsBtn') as HTMLButtonElement;

    if (startBtn && select) {
      startBtn.disabled = !select.value || this.isCapturing;
    }

    if (exportBtn) {
      exportBtn.disabled = !this.hasFrames || this.isCapturing;
    }
  }
}

customElements.define('cv-capture-controls', CaptureControlsElement);
