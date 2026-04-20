import { logger } from '../lib/logger.js';
  import { speciesCore } from './species_core.js';

  export interface HybridSpecies {
    id: string;
    parent1Id: string;
    parent2Id: string;
    vigorIndex: number;
    isViable: boolean;
    isFertile: boolean;
  }

  export class HybridizationEngine {
    private hybrids: HybridSpecies[] = [];

    createHybrid(parent1Id: string, parent2Id: string): HybridSpecies {
      const p1 = speciesCore.get(parent1Id);
      const p2 = speciesCore.get(parent2Id);
      const vigorIndex = p1 && p2 ? (p1.fitnessAvg + p2.fitnessAvg) / 2 * 1.2 : 0.5;
      const hybrid: HybridSpecies = {
        id: `hyb_${Date.now()}`,
        parent1Id, parent2Id,
        vigorIndex,
        isViable: vigorIndex > 0.3,
        isFertile: vigorIndex > 0.6
      };
      if (hybrid.isViable) {
        speciesCore.register({
          id: hybrid.id, name: `Hybrid_${parent1Id}_${parent2Id}`,
          kingdom: 'hybrid', domain: 'hybrid', population: 1, fitnessAvg: vigorIndex
        });
      }
      this.hybrids.push(hybrid);
      logger.info({ parent1Id, parent2Id, vigorIndex, isViable: hybrid.isViable }, '[Hybridization] Hybrid created');
      return hybrid;
    }

    getViableHybrids(): HybridSpecies[] { return this.hybrids.filter(h => h.isViable); }
    getFertileHybrids(): HybridSpecies[] { return this.hybrids.filter(h => h.isFertile); }
    getAll(): HybridSpecies[] { return [...this.hybrids]; }
  }

  export const hybridization = new HybridizationEngine();
  export default hybridization;
  