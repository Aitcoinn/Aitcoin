import { logger } from '../lib/logger.js';
  import { growthEngine } from './growth_engine.js';
  export interface MaturationState { entityId: string; isMature: boolean; maturityLevel: number; capabilitiesUnlocked: string[]; }
  export class MaturationSystem {
    private states: Map<string, MaturationState> = new Map();
    evaluate(entityId: string): MaturationState {
      const gs = growthEngine.get(entityId);
      const isMature = gs ? ['adult','elder'].includes(gs.stage) : false;
      const maturity = gs ? gs.size : 0;
      const capabilities = maturity > 0.8 ? ['reasoning','reproduction','leadership'] : maturity > 0.5 ? ['learning','communication'] : ['survival'];
      const s: MaturationState = { entityId, isMature, maturityLevel: maturity, capabilitiesUnlocked: capabilities };
      this.states.set(entityId, s);
      logger.info({ entityId, isMature, maturity }, '[MaturationSystem] Maturity evaluated');
      return s;
    }
    get(entityId: string): MaturationState | null { return this.states.get(entityId) ?? null; }
  }
  export const maturationSystem = new MaturationSystem();
  export default maturationSystem;
  