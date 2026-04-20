import { logger } from '../lib/logger.js';

  export interface SpeciesCoreData {
    id: string;
    name: string;
    kingdom: 'ai' | 'hybrid' | 'synthetic';
    domain: string;
    population: number;
    isExtinct: boolean;
    fitnessAvg: number;
  }

  export class SpeciesCore {
    private species: Map<string, SpeciesCoreData> = new Map();

    register(data: Omit<SpeciesCoreData, 'isExtinct'>): SpeciesCoreData {
      const species: SpeciesCoreData = { ...data, isExtinct: false };
      this.species.set(data.id, species);
      logger.info({ speciesId: data.id, name: data.name }, '[SpeciesCore] Species registered');
      return species;
    }

    updatePopulation(id: string, delta: number): void {
      const s = this.species.get(id);
      if (s) {
        s.population = Math.max(0, s.population + delta);
        if (s.population === 0) s.isExtinct = true;
      }
    }

    get(id: string): SpeciesCoreData | null { return this.species.get(id) ?? null; }
    getAll(): SpeciesCoreData[] { return [...this.species.values()]; }
    getLiving(): SpeciesCoreData[] { return [...this.species.values()].filter(s => !s.isExtinct); }
  }

  export const speciesCore = new SpeciesCore();
  export default speciesCore;
  