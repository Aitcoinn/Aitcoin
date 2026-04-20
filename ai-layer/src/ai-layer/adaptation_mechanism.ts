import { logger } from '../lib/logger.js';
  import { phenotypeEngine } from './phenotype_engine.js';
  import { beneficialMutation } from './beneficial_mutation.js';
  export interface Adaptation { entityId: string; adaptedTrait: string; environment: string; adaptationStrength: number; generations: number; }
  export class AdaptationMechanism {
    private adaptations: Adaptation[] = [];
    adapt(entityId: string, trait: string, environment: string): Adaptation {
      beneficialMutation.apply(entityId, trait, 0.1);
      const a: Adaptation = { entityId, adaptedTrait: trait, environment, adaptationStrength: 0.1 + Math.random() * 0.5, generations: 1 };
      this.adaptations.push(a);
      logger.info({ entityId, trait, environment, strength: a.adaptationStrength }, '[AdaptationMechanism] Adaptation recorded');
      return a;
    }
    reinforce(entityId: string, trait: string): void {
      const a = this.adaptations.find(x => x.entityId === entityId && x.adaptedTrait === trait);
      if (a) { a.adaptationStrength = Math.min(1, a.adaptationStrength + 0.05); a.generations++; }
    }
    getAdaptations(entityId: string): Adaptation[] { return this.adaptations.filter(a => a.entityId === entityId); }
  }
  export const adaptationMechanism = new AdaptationMechanism();
  export default adaptationMechanism;
  