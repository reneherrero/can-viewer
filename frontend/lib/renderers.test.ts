import { describe, it, expect } from 'vitest';
import {
  renderFramesHtml,
  renderSignalsHtml,
  renderEmptySignalsHtml,
  renderDbcMessagesHtml,
  renderDbcSignalsHtml,
  getDbcMessageSubtitle,
  renderInterfaceOptions,
} from './renderers';
import { createMockFrames, createMockDbcInfo, createMockSignal } from './mock-api';
import type { MessageInfo } from './types';

describe('renderers', () => {
  describe('renderFramesHtml', () => {
    it('should render table rows for frames', () => {
      const frames = createMockFrames(3);
      const html = renderFramesHtml(frames, null, () => '-');

      expect(html).toContain('<tr class="clickable');
      expect(html).toContain('data-index="0"');
      expect(html).toContain('data-index="1"');
      expect(html).toContain('data-index="2"');
    });

    it('should mark selected row', () => {
      const frames = createMockFrames(3);
      const html = renderFramesHtml(frames, 1, () => '-');

      expect(html).toContain('data-index="1"');
      expect(html).toMatch(/class="clickable selected".*data-index="1"/);
    });

    it('should include message names from lookup function', () => {
      const frames = createMockFrames(3);
      frames[0].can_id = 0x100;
      const html = renderFramesHtml(frames, null, (canId) =>
        canId === 0x100 ? 'EngineData' : '-'
      );

      expect(html).toContain('EngineData');
    });

    it('should format timestamp, CAN ID, and data', () => {
      const frames = createMockFrames(1);
      frames[0].timestamp = 1.234567;
      frames[0].can_id = 0x7DF;
      frames[0].data = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08];

      const html = renderFramesHtml(frames, null, () => '-');

      expect(html).toContain('1.234567');
      expect(html).toContain('7DF');
      expect(html).toContain('01 02 03 04 05 06 07 08');
    });

    it('should handle empty frames array', () => {
      const html = renderFramesHtml([], null, () => '-');
      expect(html).toBe('');
    });
  });

  describe('renderSignalsHtml', () => {
    it('should render table rows for signals', () => {
      const signals = [
        createMockSignal({ signal_name: 'RPM', value: 3500, unit: 'rpm' }),
        createMockSignal({ signal_name: 'Speed', value: 65.5, unit: 'km/h' }),
      ];
      const html = renderSignalsHtml(signals);

      expect(html).toContain('RPM');
      expect(html).toContain('3500.0000');
      expect(html).toContain('rpm');
      expect(html).toContain('Speed');
      expect(html).toContain('65.5000');
      expect(html).toContain('km/h');
    });

    it('should show dash for signals without unit', () => {
      const signals = [createMockSignal({ unit: '' })];
      const html = renderSignalsHtml(signals);
      expect(html).toContain('>-</td>');
    });

    it('should handle empty signals array', () => {
      const html = renderSignalsHtml([]);
      expect(html).toBe('');
    });
  });

  describe('renderEmptySignalsHtml', () => {
    it('should render placeholder message', () => {
      const html = renderEmptySignalsHtml();
      expect(html).toContain('Select a frame to view decoded signals');
      expect(html).toContain('colspan="3"');
    });
  });

  describe('renderDbcMessagesHtml', () => {
    it('should render DBC messages list', () => {
      const dbcInfo = createMockDbcInfo();
      const html = renderDbcMessagesHtml(dbcInfo, null);

      expect(html).toContain('EngineData');
      expect(html).toContain('VehicleSpeed');
      expect(html).toContain('BrakeStatus');
      expect(html).toContain('data-id="256"'); // 0x100
      expect(html).toContain('data-id="257"'); // 0x101
    });

    it('should mark selected message', () => {
      const dbcInfo = createMockDbcInfo();
      const html = renderDbcMessagesHtml(dbcInfo, 0x100);

      expect(html).toMatch(/class="cv-dbc-message-item selected".*data-id="256"/);
    });

    it('should show "No DBC file loaded" when no DBC info', () => {
      const html = renderDbcMessagesHtml(null, null);
      expect(html).toContain('No DBC file loaded');
    });

    it('should show "No DBC file loaded" when empty messages', () => {
      const html = renderDbcMessagesHtml({ messages: [] }, null);
      expect(html).toContain('No DBC file loaded');
    });

    it('should include message metadata', () => {
      const dbcInfo = createMockDbcInfo();
      const html = renderDbcMessagesHtml(dbcInfo, null);

      expect(html).toContain('DLC: 8');
      expect(html).toContain('2 signals');
      expect(html).toContain('TX: ECU');
    });
  });

  describe('renderDbcSignalsHtml', () => {
    it('should render signal cards', () => {
      const msg = createMockDbcInfo().messages[0]; // EngineData
      const html = renderDbcSignalsHtml(msg);

      expect(html).toContain('EngineRPM');
      expect(html).toContain('EngineTemp');
      expect(html).toContain('Start Bit');
      expect(html).toContain('Length');
      expect(html).toContain('Factor');
      expect(html).toContain('Offset');
    });

    it('should show signal properties', () => {
      const msg: MessageInfo = {
        id: 0x100,
        name: 'Test',
        dlc: 8,
        sender: 'ECU',
        signals: [{
          name: 'TestSignal',
          start_bit: 8,
          length: 16,
          factor: 0.1,
          offset: -40,
          min: -40,
          max: 215,
          unit: 'C',
        }],
      };
      const html = renderDbcSignalsHtml(msg);

      expect(html).toContain('8'); // start_bit
      expect(html).toContain('16 bits'); // length
      expect(html).toContain('0.1'); // factor
      expect(html).toContain('-40'); // offset and min
      expect(html).toContain('215'); // max
      expect(html).toContain('C'); // unit
    });

    it('should show "No signals defined" for message without signals', () => {
      const msg: MessageInfo = {
        id: 0x100,
        name: 'Empty',
        dlc: 8,
        sender: 'ECU',
        signals: [],
      };
      const html = renderDbcSignalsHtml(msg);
      expect(html).toContain('No signals defined for this message');
    });
  });

  describe('getDbcMessageSubtitle', () => {
    it('should format message subtitle', () => {
      const msg: MessageInfo = {
        id: 0x100,
        name: 'EngineData',
        dlc: 8,
        sender: 'ECU',
        signals: [],
      };
      const subtitle = getDbcMessageSubtitle(msg);

      expect(subtitle).toContain('ID: 0x100');
      expect(subtitle).toContain('DLC: 8');
      expect(subtitle).toContain('TX: ECU');
    });

    it('should omit TX when no sender', () => {
      const msg: MessageInfo = {
        id: 0x200,
        name: 'Test',
        dlc: 4,
        sender: '',
        signals: [],
      };
      const subtitle = getDbcMessageSubtitle(msg);

      expect(subtitle).toBe('ID: 0x200 | DLC: 4');
    });
  });

  describe('renderInterfaceOptions', () => {
    it('should render interface options with placeholder', () => {
      const html = renderInterfaceOptions(['can0', 'vcan0']);

      expect(html).toContain('<option value="">Select CAN interface...</option>');
      expect(html).toContain('<option value="can0">can0</option>');
      expect(html).toContain('<option value="vcan0">vcan0</option>');
    });

    it('should handle empty interfaces', () => {
      const html = renderInterfaceOptions([]);
      expect(html).toBe('<option value="">Select CAN interface...</option>');
    });
  });
});
