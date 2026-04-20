import { logger } from '../lib/logger.js';
  export interface Cell { id: string; type: string; dnaContent: number; energy: number; generation: number; }
  export class CellDivision {
    private cells: Map<string, Cell> = new Map();
    createCell(type = 'stem'): Cell {
      const c: Cell = { id: `cell_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, type, dnaContent: 2, energy: 1.0, generation: 0 };
      this.cells.set(c.id, c); return c;
    }
    divide(cellId: string, mode: 'mitosis' | 'meiosis'): Cell[] {
      const parent = this.cells.get(cellId);
      if (!parent || parent.energy < 0.5) return [];
      const daughters: Cell[] = [
        { id: `${cellId}_d1`, type: parent.type, dnaContent: mode === 'meiosis' ? 1 : 2, energy: parent.energy / 2, generation: parent.generation + 1 },
        { id: `${cellId}_d2`, type: parent.type, dnaContent: mode === 'meiosis' ? 1 : 2, energy: parent.energy / 2, generation: parent.generation + 1 }
      ];
      daughters.forEach(d => this.cells.set(d.id, d));
      parent.energy = 0;
      logger.info({ parentId: cellId, mode, daughters: daughters.length }, '[CellDivision] Cell divided');
      return daughters;
    }
    getCell(id: string): Cell | null { return this.cells.get(id) ?? null; }
    getCellCount(): number { return this.cells.size; }
  }
  export const cellDivision = new CellDivision();
  export default cellDivision;
  