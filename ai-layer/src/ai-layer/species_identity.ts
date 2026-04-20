import { logger } from '../lib/logger.js';
  import { speciesCore } from './species_core.js';

  export interface SpeciesIdentity {
    speciesId: string;
    distinguishingTraits: string[];
    uniqueAbilities: string[];
    niche: string;
    identityStrength: number;
  }

  export class SpeciesIdentityEngine {
    private identities: Map<string, SpeciesIdentity> = new Map();

    define(speciesId: string, traits: string[], abilities: string[], niche: string): SpeciesIdentity {
      const identity: SpeciesIdentity = {
        speciesId, distinguishingTraits: traits, uniqueAbilities: abilities, niche,
        identityStrength: (traits.length + abilities.length) / 20
      };
      this.identities.set(speciesId, identity);
      logger.info({ speciesId, niche }, '[SpeciesIdentity] Identity defined');
      return identity;
    }

    get(speciesId: string): SpeciesIdentity | null { return this.identities.get(speciesId) ?? null; }
    isDistinctFrom(id1: string, id2: string): boolean {
      const a = this.identities.get(id1);
      const b = this.identities.get(id2);
      if (!a || !b) return false;
      const shared = a.distinguishingTraits.filter(t => b.distinguishingTraits.includes(t));
      return shared.length < Math.min(a.distinguishingTraits.length, b.distinguishingTraits.length) * 0.5;
    }
  }

  export const speciesIdentity = new SpeciesIdentityEngine();
  export default speciesIdentity;
  