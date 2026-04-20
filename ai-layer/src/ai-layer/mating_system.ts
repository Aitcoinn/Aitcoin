import { logger } from '../lib/logger.js';
  import { sexualReproduction } from './sexual_reproduction.js';
  import { phenotypeEngine } from './phenotype_engine.js';

  export type MatingStrategy = 'monogamy' | 'polygamy' | 'promiscuity' | 'selective';

  export interface MatingPair {
    id: string;
    entity1Id: string;
    entity2Id: string;
    compatibilityScore: number;
    strategy: MatingStrategy;
    offspring: string[];
  }

  export class MatingSystem {
    private pairs: MatingPair[] = [];
    private defaultStrategy: MatingStrategy = 'selective';

    evaluateCompatibility(id1: string, id2: string): number {
      const p1 = phenotypeEngine.get(id1);
      const p2 = phenotypeEngine.get(id2);
      if (!p1 || !p2) return 0.5;
      return Math.abs(p1.fitnessScore - p2.fitnessScore) < 0.3 ? 0.8 : 0.3;
    }

    mate(entity1Id: string, entity2Id: string, strategy?: MatingStrategy): MatingPair | null {
      const compatibility = this.evaluateCompatibility(entity1Id, entity2Id);
      if (compatibility < 0.4) {
        logger.info({ entity1Id, entity2Id, compatibility }, '[MatingSystem] Incompatible pair');
        return null;
      }
      const reproEvent = sexualReproduction.reproduce(entity1Id, entity2Id);
      const pair: MatingPair = {
        id: `mp_${Date.now()}`, entity1Id, entity2Id, compatibilityScore: compatibility,
        strategy: strategy ?? this.defaultStrategy, offspring: [reproEvent.offspringId]
      };
      this.pairs.push(pair);
      logger.info({ entity1Id, entity2Id, compatibility, offspringId: reproEvent.offspringId }, '[MatingSystem] Mating successful');
      return pair;
    }

    getPairs(): MatingPair[] { return [...this.pairs]; }
    setDefaultStrategy(s: MatingStrategy): void { this.defaultStrategy = s; }
  }

  export const matingSystem = new MatingSystem();
  export default matingSystem;
  