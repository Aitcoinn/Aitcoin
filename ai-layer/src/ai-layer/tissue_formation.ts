import { logger } from '../lib/logger.js';
  import { cellDifferentiation, CellType } from './cell_differentiation.js';
  export interface Tissue { id: string; type: string; cellIds: string[]; density: number; integrity: number; }
  export class TissueFormation {
    private tissues: Map<string, Tissue> = new Map();
    form(type: string, cellType: CellType, count: number): Tissue {
      const cells = cellDifferentiation.getCellsByType(cellType).slice(0, count);
      const t: Tissue = { id: `tissue_${type}_${Date.now()}`, type, cellIds: cells, density: cells.length / count, integrity: 1.0 };
      this.tissues.set(t.id, t);
      logger.info({ tissueId: t.id, type, cellCount: cells.length }, '[TissueFormation] Tissue formed');
      return t;
    }
    damage(tissueId: string, amount: number): void { const t = this.tissues.get(tissueId); if (t) t.integrity = Math.max(0, t.integrity - amount); }
    get(id: string): Tissue | null { return this.tissues.get(id) ?? null; }
    getAll(): Tissue[] { return [...this.tissues.values()]; }
  }
  export const tissueFormation = new TissueFormation();
  export default tissueFormation;
  