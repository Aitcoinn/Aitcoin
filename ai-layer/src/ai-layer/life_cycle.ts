import { logger } from '../lib/logger.js';
  import { birthProtocol } from './birth_protocol.js';
  import { growthEngine } from './growth_engine.js';
  import { agingProcess } from './aging_process.js';
  import { maturationSystem } from './maturation_system.js';
  export type LifePhase = 'prenatal'|'birth'|'growth'|'maturity'|'decline'|'death';
  export interface LifeCycleState { entityId: string; phase: LifePhase; totalAge: number; isAlive: boolean; }
  export class LifeCycle {
    private states: Map<string, LifeCycleState> = new Map();
    begin(entityId: string): LifeCycleState {
      growthEngine.initGrowth(entityId);
      agingProcess.initAging(entityId);
      const s: LifeCycleState = { entityId, phase: 'birth', totalAge: 0, isAlive: true };
      this.states.set(entityId, s);
      logger.info({ entityId }, '[LifeCycle] Life begun');
      return s;
    }
    advance(entityId: string, delta: number): LifeCycleState | null {
      const s = this.states.get(entityId);
      if (!s || !s.isAlive) return null;
      s.totalAge += delta;
      growthEngine.tick(entityId, delta);
      agingProcess.age(entityId, delta);
      const mat = maturationSystem.evaluate(entityId);
      const nearDeath = agingProcess.isNearDeath(entityId);
      s.phase = nearDeath ? 'decline' : mat.isMature ? 'maturity' : 'growth';
      return s;
    }
    die(entityId: string): void {
      const s = this.states.get(entityId);
      if (s) { s.isAlive = false; s.phase = 'death'; logger.info({ entityId }, '[LifeCycle] Entity died'); }
    }
    get(entityId: string): LifeCycleState | null { return this.states.get(entityId) ?? null; }
  }
  export const lifeCycle = new LifeCycle();
  export default lifeCycle;
  