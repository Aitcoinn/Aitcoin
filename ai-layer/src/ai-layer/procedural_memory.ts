import { logger } from '../lib/logger.js';
export interface Procedure { name: string; steps: string[]; lastExecuted: number; successRate: number; }
  export class ProceduralMemory {
    private procedures: Map<string, Procedure> = new Map();
    learn(name: string, steps: string[]): void { this.procedures.set(name, { name, steps, lastExecuted: 0, successRate: 0 }); logger.info({ name, steps: steps.length }, '[ProceduralMemory] Learned'); }
    execute(name: string): string[] | null { const p = this.procedures.get(name); if (p) { p.lastExecuted = Date.now(); p.successRate = Math.min(1, p.successRate + 0.01); } return p?.steps ?? null; }
    get(name: string): Procedure | null { return this.procedures.get(name) ?? null; }
  }
  export const proceduralMemory = new ProceduralMemory();
  export default proceduralMemory;