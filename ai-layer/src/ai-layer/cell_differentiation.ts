import { logger } from '../lib/logger.js';
  import { cellDivision, Cell } from './cell_division.js';
  export type CellType = 'neuron'|'muscle'|'epithelial'|'immune'|'stem'|'reproductive';
  export class CellDifferentiation {
    private differentiatedCells: Map<string, CellType> = new Map();
    differentiate(cellId: string, targetType: CellType): boolean {
      const cell = cellDivision.getCell(cellId);
      if (!cell || cell.type !== 'stem') { logger.warn({ cellId }, '[CellDifferentiation] Cannot differentiate non-stem cell'); return false; }
      this.differentiatedCells.set(cellId, targetType);
      logger.info({ cellId, targetType }, '[CellDifferentiation] Cell differentiated');
      return true;
    }
    getType(cellId: string): CellType | null { return this.differentiatedCells.get(cellId) ?? null; }
    getCellsByType(type: CellType): string[] {
      return [...this.differentiatedCells.entries()].filter(([,t]) => t === type).map(([id]) => id);
    }
  }
  export const cellDifferentiation = new CellDifferentiation();
  export default cellDifferentiation;
  