import type { CanFrame } from '../types';
import { formatCanId, formatDataHex, formatFlags, formatTimestamp } from '../formatters';

/** Frames table component */
export class FramesTableElement extends HTMLElement {
  private frames: CanFrame[] = [];
  private selectedIndex: number | null = null;
  private messageNameLookup: (canId: number) => string = () => '-';

  constructor() {
    super();
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

    tbody.innerHTML = this.frames.map((frame, idx) => `
      <tr class="clickable ${idx === this.selectedIndex ? 'selected' : ''}" data-index="${idx}">
        <td class="cv-timestamp">${formatTimestamp(frame.timestamp)}</td>
        <td>${frame.channel}</td>
        <td class="cv-can-id">${formatCanId(frame.can_id, frame.is_extended)}</td>
        <td class="cv-message-name">${this.messageNameLookup(frame.can_id)}</td>
        <td>${frame.dlc}</td>
        <td class="cv-hex-data">${formatDataHex(frame.data)}</td>
        <td>${formatFlags(frame)}</td>
      </tr>
    `).join('');

    this.bindRowEvents(tbody);
  }

  private bindRowEvents(tbody: Element): void {
    tbody.querySelectorAll('tr.clickable').forEach(row => {
      row.addEventListener('click', () => {
        const idx = parseInt((row as HTMLElement).dataset.index || '0');
        this.selectFrame(idx);
      });
    });
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
