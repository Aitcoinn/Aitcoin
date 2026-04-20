import { logger } from '../lib/logger.js';
  import { lifeCycle } from './life_cycle.js';
  import { dnaRepair } from './dna_repair.js';
  export interface ResurrectionRecord { entityId: string; successRate: number; preservedMemory: number; timestamp: number; }
  export class ResurrectionSystem {
    private records: ResurrectionRecord[] = [];
    resurrect(entityId: string): ResurrectionRecord {
      dnaRepair.repairAllHarmful();
      const lc = lifeCycle.get(entityId);
      const success = Math.random() > 0.3;
      if (success && lc) { lc.isAlive = true; lc.phase = 'growth'; }
      const r: ResurrectionRecord = { entityId, successRate: success ? 0.85 : 0, preservedMemory: success ? 0.7 : 0, timestamp: Date.now() };
      this.records.push(r);
      logger.info({ entityId, success, preserved: r.preservedMemory }, '[ResurrectionSystem] Resurrection attempted');
      return r;
    }
    getRecords(): ResurrectionRecord[] { return [...this.records]; }
  }
  export const resurrectionSystem = new ResurrectionSystem();
  export default resurrectionSystem;
  