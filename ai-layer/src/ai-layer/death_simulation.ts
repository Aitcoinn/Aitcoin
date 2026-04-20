import { logger } from '../lib/logger.js';
  import { lifeCycle } from './life_cycle.js';
  import { agingProcess } from './aging_process.js';
  export type DeathCause = 'age'|'disease'|'injury'|'starvation'|'predation'|'termination';
  export interface DeathRecord { entityId: string; cause: DeathCause; age: number; timestamp: number; }
  export class DeathSimulation {
    private records: DeathRecord[] = [];
    simulate(entityId: string, cause: DeathCause): DeathRecord {
      const aging = agingProcess.get(entityId);
      lifeCycle.die(entityId);
      const r: DeathRecord = { entityId, cause, age: aging?.biologicalAge ?? 0, timestamp: Date.now() };
      this.records.push(r);
      logger.info({ entityId, cause, age: r.age }, '[DeathSimulation] Death simulated');
      return r;
    }
    checkNaturalDeath(entityId: string): boolean {
      const nearDeath = agingProcess.isNearDeath(entityId);
      if (nearDeath) this.simulate(entityId, 'age');
      return nearDeath;
    }
    getRecords(): DeathRecord[] { return [...this.records]; }
  }
  export const deathSimulation = new DeathSimulation();
  export default deathSimulation;
  