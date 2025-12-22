import type { CanFrame } from '../types';
import { formatCanId, formatDataHex, formatFlags, formatTimestamp } from '../formatters';

/** Maximum frames to render in the table for performance */
const MAX_DISPLAYED_FRAMES = 500;

/** Frames table component */
export class FramesTableElement extends HTMLElement {
  private frames: CanFrame[] = [];
  private selectedIndex: number | null = null;
  private messageNameLookup: (canId: number) => string = () => '-';
  private delegatedHandler: ((e: Event) => void) | null = null;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.setupEventDelegation();
  }

  disconnectedCallback(): void {
    this.removeEventDelegation();
  }

  private setupEventDelegation(): void {
    const tbody = this.querySelector('tbody');
    if (!tbody || this.delegatedHandler) return;

    this.delegatedHandler = (e: Event) => {
      const target = e.target as HTMLElement;
      const row = target.closest('tr.clickable') as HTMLElement;
      if (row?.dataset.index) {
        this.selectFrame(parseInt(row.dataset.index, 10));
      }
    };
    tbody.addEventListener('click', this.delegatedHandler);
  }

  private removeEventDelegation(): void {
    if (!this.delegatedHandler) return;
    const tbody = this.querySelector('tbody');
    if (tbody) {
      tbody.removeEventListener('click', this.delegatedHandler);
    }
    this.delegatedHandler = null;
  }

  /** Set the message name lookup function */
  setMessageNameLookup(fn: (canId: number) => string): void {
    this.messageNameLookup = fn;
  }

  /** Update frames and re-render */
  setFrames(frames: CanFrame[]): void {
    this.frames = frames;
    this.render();
  }

  /** Get current frame count */
  get frameCount(): number {
    return this.frames.length;
  }

  /** Clear selection */
  clearSelection(): void {
    this.selectedIndex = null;
    this.updateSelection();
  }

  private render(): void {
    const tbody = this.querySelector('tbody');
    if (!tbody) return;

    // Only render the last N frames for performance
    const startIdx = Math.max(0, this.frames.length - MAX_DISPLAYED_FRAMES);
    const displayedFrames = this.frames.slice(startIdx);

    tbody.innerHTML = displayedFrames.map((frame, displayIdx) => {
      const actualIdx = startIdx + displayIdx;
      return `
      <tr class="clickable ${actualIdx === this.selectedIndex ? 'selected' : ''}" data-index="${actualIdx}">
        <td class="cv-timestamp">${formatTimestamp(frame.timestamp)}</td>
        <td>${frame.channel}</td>
        <td class="cv-can-id">${formatCanId(frame.can_id, frame.is_extended)}</td>
        <td class="cv-message-name">${this.messageNameLookup(frame.can_id)}</td>
        <td>${frame.dlc}</td>
        <td class="cv-hex-data">${formatDataHex(frame.data)}</td>
        <td>${formatFlags(frame)}</td>
      </tr>
    `;
    }).join('');

    // Ensure event delegation is set up (in case tbody was recreated)
    if (!this.delegatedHandler) {
      this.setupEventDelegation();
    }
  }

  private selectFrame(index: number): void {
    this.selectedIndex = index;
    this.updateSelection();

    const frame = this.frames[index];
    if (frame) {
      this.dispatchEvent(new CustomEvent('frame-selected', {
        detail: { frame, index },
        bubbles: true,
      }));
    }
  }

  private updateSelection(): void {
    const tbody = this.querySelector('tbody');
    if (tbody) {
      tbody.querySelectorAll('tr').forEach((row, idx) => {
        row.classList.toggle('selected', idx === this.selectedIndex);
      });
    }
  }

  /** Scroll to bottom */
  scrollToBottom(): void {
    const wrapper = this.querySelector('.cv-table-wrapper');
    if (wrapper) wrapper.scrollTop = wrapper.scrollHeight;
  }
}

customElements.define('cv-frames-table', FramesTableElement);
