import { logger } from '../lib/logger.js';
export class SensoryMemory {
    private buffer: Map<string, Array<{modality: string; data: string; timestamp: number}>> = new Map();
    record(entityId: string, modality: string, data: string): void {
      const buf = this.buffer.get(entityId) ?? [];
      buf.push({ modality, data, timestamp: Date.now() });
      if (buf.length > 20) buf.shift();
      this.buffer.set(entityId, buf);
    }
    getRecent(entityId: string, modality?: string): any[] {
      const buf = this.buffer.get(entityId) ?? [];
      return modality ? buf.filter(b => b.modality === modality) : buf;
    }
  }
  export const sensoryMemory = new SensoryMemory();
  export default sensoryMemory;