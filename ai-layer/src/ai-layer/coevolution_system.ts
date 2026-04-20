import { logger } from '../lib/logger.js';
  import { adaptationMechanism } from './adaptation_mechanism.js';
  export interface CoevolutionPair { species1: string; species2: string; relationship: 'arms_race'|'mutualism'|'mimicry'; coevolutionRate: number; }
  export class CoevolutionSystem {
    private pairs: CoevolutionPair[] = [];
    link(s1: string, s2: string, relationship: CoevolutionPair['relationship']): CoevolutionPair {
      const pair: CoevolutionPair = { species1: s1, species2: s2, relationship, coevolutionRate: 0.5 };
      this.pairs.push(pair);
      adaptationMechanism.adapt(s1, `coevo_${relationship}`, s2);
      adaptationMechanism.adapt(s2, `coevo_${relationship}`, s1);
      logger.info({ s1, s2, relationship }, '[CoevolutionSystem] Coevolution linked');
      return pair;
    }
    tick(): void { this.pairs.forEach(p => { p.coevolutionRate = Math.min(1, p.coevolutionRate + 0.01); }); }
    getPairs(): CoevolutionPair[] { return [...this.pairs]; }
  }
  export const coevolutionSystem = new CoevolutionSystem();
  export default coevolutionSystem;
  