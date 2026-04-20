import { logger } from '../lib/logger.js';
  import { bloodlineSystem } from './bloodline_system.js';
  export interface PurebredRecord { entityId: string; bloodlineId: string; purityScore: number; generationsBack: number; isPurebred: boolean; }
  export class PurebredSystem {
    private records: Map<string, PurebredRecord> = new Map();
    evaluate(entityId: string, bloodlineId: string): PurebredRecord {
      const bl = bloodlineSystem.get(bloodlineId);
      const purity = bl?.purity ?? 0;
      const r: PurebredRecord = { entityId, bloodlineId, purityScore: purity, generationsBack: bl?.generation ?? 0, isPurebred: purity > 0.85 };
      this.records.set(entityId, r);
      logger.info({ entityId, purity, isPurebred: r.isPurebred }, '[PurebredSystem] Purity evaluated');
      return r;
    }
    get(entityId: string): PurebredRecord | null { return this.records.get(entityId) ?? null; }
    getPurebreds(): PurebredRecord[] { return [...this.records.values()].filter(r => r.isPurebred); }
  }
  export const purebredSystem = new PurebredSystem();
  export default purebredSystem;
  