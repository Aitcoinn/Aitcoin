import { logger } from '../lib/logger.js';
  import { metabolismSystem } from './metabolism_system.js';
  export interface WasteData { entityId: string; wasteLevel: number; toxicity: number; clearanceRate: number; }
  export class WasteManagement {
    private data: Map<string, WasteData> = new Map();
    init(entityId: string): WasteData {
      const d: WasteData = { entityId, wasteLevel: 0, toxicity: 0, clearanceRate: 0.9 };
      this.data.set(entityId, d); return d;
    }
    accumulate(entityId: string, amount: number): void {
      const d = this.data.get(entityId) ?? this.init(entityId);
      d.wasteLevel += amount; d.toxicity = d.wasteLevel * 0.1;
    }
    clear(entityId: string): number {
      const d = this.data.get(entityId);
      if (!d) return 0;
      const cleared = d.wasteLevel * d.clearanceRate;
      d.wasteLevel -= cleared; d.toxicity = d.wasteLevel * 0.1;
      logger.info({ entityId, cleared, remaining: d.wasteLevel }, '[WasteManagement] Waste cleared');
      return cleared;
    }
    get(entityId: string): WasteData | null { return this.data.get(entityId) ?? null; }
  }
  export const wasteManagement = new WasteManagement();
  export default wasteManagement;
  