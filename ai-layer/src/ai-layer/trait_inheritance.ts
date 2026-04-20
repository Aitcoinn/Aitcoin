import { logger } from '../lib/logger.js';
  import { hereditySystem } from './heredity_system.js';
  import { alleleSystem } from './allele_system.js';

  export interface Trait {
    name: string;
    value: number;
    inheritedFrom: 'parent1' | 'parent2' | 'mutation' | 'both';
    expressionStrength: number;
  }

  export class TraitInheritance {
    private traits: Map<string, Trait[]> = new Map();

    inheritTraits(entityId: string, parent1Traits: Trait[], parent2Traits: Trait[]): Trait[] {
      const inherited: Trait[] = [];
      const allTraitNames = new Set([...parent1Traits, ...parent2Traits].map(t => t.name));

      allTraitNames.forEach(name => {
        const p1 = parent1Traits.find(t => t.name === name);
        const p2 = parent2Traits.find(t => t.name === name);
        const allele = alleleSystem.getExpressedAllele(name);
        const from = p1 && p2 ? 'both' : p1 ? 'parent1' : 'parent2';
        inherited.push({
          name,
          value: ((p1?.value ?? 0) + (p2?.value ?? 0)) / 2,
          inheritedFrom: from,
          expressionStrength: allele?.expressionStrength ?? 0.5
        });
      });

      this.traits.set(entityId, inherited);
      logger.info({ entityId, traitCount: inherited.length }, '[TraitInheritance] Traits computed');
      return inherited;
    }

    getTraits(entityId: string): Trait[] { return this.traits.get(entityId) ?? []; }
  }

  export const traitInheritance = new TraitInheritance();
  export default traitInheritance;
  