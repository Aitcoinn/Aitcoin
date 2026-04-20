import { logger } from '../lib/logger.js';
  import { ecosystemRole } from './ecosystem_role.js';
  import { speciesCore } from './species_core.js';
  export interface Niche { id: string; name: string; resources: string[]; competitors: string[]; occupant: string | null; isVacant: boolean; }
  export class NicheFinder {
    private niches: Niche[] = [
      { id: 'niche_decomposer', name: 'decomposer', resources: ['dead_matter'], competitors: [], occupant: null, isVacant: true },
      { id: 'niche_apex', name: 'apex_predator', resources: ['prey'], competitors: [], occupant: null, isVacant: true },
      { id: 'niche_producer', name: 'producer', resources: ['energy'], competitors: [], occupant: null, isVacant: true }
    ];
    findVacantNiche(speciesId: string): Niche | null {
      const vacant = this.niches.find(n => n.isVacant);
      if (vacant) { vacant.occupant = speciesId; vacant.isVacant = false; logger.info({ speciesId, niche: vacant.name }, '[NicheFinder] Niche found and occupied'); }
      return vacant ?? null;
    }
    getVacantNiches(): Niche[] { return this.niches.filter(n => n.isVacant); }
    getAllNiches(): Niche[] { return [...this.niches]; }
  }
  export const nicheFinder = new NicheFinder();
  export default nicheFinder;
  