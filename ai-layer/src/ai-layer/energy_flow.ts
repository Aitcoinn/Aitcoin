import { logger } from '../lib/logger.js';
  import { metabolismSystem } from './metabolism_system.js';
  export interface EnergyFlow { entityId: string; inflow: number; outflow: number; netEnergy: number; efficiency: number; }
  export class EnergyFlowEngine {
    private flows: Map<string, EnergyFlow> = new Map();
    compute(entityId: string, inflow: number): EnergyFlow {
      const meta = metabolismSystem.get(entityId);
      const outflow = meta ? meta.metabolicRate * 0.5 : 0.5;
      const f: EnergyFlow = { entityId, inflow, outflow, netEnergy: inflow - outflow, efficiency: outflow > 0 ? inflow / outflow : 1 };
      this.flows.set(entityId, f);
      if (f.netEnergy > 0) metabolismSystem.feed(entityId, f.netEnergy);
      logger.info({ entityId, netEnergy: f.netEnergy, efficiency: f.efficiency }, '[EnergyFlow] Flow computed');
      return f;
    }
    get(entityId: string): EnergyFlow | null { return this.flows.get(entityId) ?? null; }
  }
  export const energyFlow = new EnergyFlowEngine();
  export default energyFlow;
  