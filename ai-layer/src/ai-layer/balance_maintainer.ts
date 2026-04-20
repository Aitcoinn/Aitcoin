import { logger } from '../lib/logger.js';
  import { homeostasisSystem } from './homeostasis_system.js';
  export interface BalanceReport { entityId: string; overallBalance: number; regulationCycles: number; lastCorrection: number; }
  export class BalanceMaintainer {
    private reports: Map<string, BalanceReport> = new Map();
    maintain(entityId: string): BalanceReport {
      const hState = homeostasisSystem.regulate(entityId);
      const r = this.reports.get(entityId) ?? { entityId, overallBalance: 1, regulationCycles: 0, lastCorrection: 0 };
      r.regulationCycles++;
      r.overallBalance = hState.isBalanced ? Math.min(1, r.overallBalance + 0.01) : Math.max(0, r.overallBalance - 0.05);
      if (!hState.isBalanced) r.lastCorrection = Date.now();
      this.reports.set(entityId, r);
      logger.info({ entityId, balance: r.overallBalance }, '[BalanceMaintainer] Balance maintained');
      return r;
    }
    get(entityId: string): BalanceReport | null { return this.reports.get(entityId) ?? null; }
  }
  export const balanceMaintainer = new BalanceMaintainer();
  export default balanceMaintainer;
  