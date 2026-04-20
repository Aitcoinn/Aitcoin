import { logger } from '../lib/logger.js';
  import { diversityPreserver } from './diversity_preserver.js';
  export interface RareTrait { traitId: string; frequency: number; protectionStatus: 'active'|'monitoring'|'critical'; preservedIn: string[]; }
  export class RareTraitProtector {
    private rareTraits: Map<string, RareTrait> = new Map();
    protect(traitId: string, frequency: number, populationId: string): RareTrait {
      const existing = this.rareTraits.get(traitId);
      const status = frequency < 0.01 ? 'critical' : frequency < 0.05 ? 'active' : 'monitoring';
      const rt: RareTrait = { traitId, frequency, protectionStatus: status, preservedIn: [...(existing?.preservedIn ?? []), populationId] };
      this.rareTraits.set(traitId, rt);
      if (status === 'critical') diversityPreserver.preserve(populationId);
      logger.info({ traitId, frequency, status }, '[RareTraitProtector] Trait protected');
      return rt;
    }
    getAll(): RareTrait[] { return [...this.rareTraits.values()]; }
    getCritical(): RareTrait[] { return [...this.rareTraits.values()].filter(t => t.protectionStatus === 'critical'); }
  }
  export const rareTraitProtector = new RareTraitProtector();
  export default rareTraitProtector;
  