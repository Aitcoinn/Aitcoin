import { logger } from '../lib/logger.js';
  import { matingSystem } from './mating_system.js';
  import { asexualReproduction } from './asexual_reproduction.js';

  export interface OffspringData {
    id: string;
    parentIds: string[];
    reproductionType: 'sexual' | 'asexual';
    viability: number;
    generation: number;
  }

  export class OffspringGenerator {
    private offspringMap: Map<string, OffspringData> = new Map();
    private generationCounter: Map<string, number> = new Map();

    generateSexual(parent1: string, parent2: string): OffspringData | null {
      const pair = matingSystem.mate(parent1, parent2);
      if (!pair || !pair.offspring[0]) return null;
      const gen = Math.max(this.generationCounter.get(parent1) ?? 0, this.generationCounter.get(parent2) ?? 0) + 1;
      const data: OffspringData = {
        id: pair.offspring[0], parentIds: [parent1, parent2],
        reproductionType: 'sexual', viability: pair.compatibilityScore, generation: gen
      };
      this.offspringMap.set(data.id, data);
      this.generationCounter.set(data.id, gen);
      logger.info({ offspringId: data.id, gen }, '[OffspringGenerator] Sexual offspring generated');
      return data;
    }

    generateAsexual(parentId: string): OffspringData {
      const ev = asexualReproduction.reproduce(parentId, 'binary_fission');
      const gen = (this.generationCounter.get(parentId) ?? 0) + 1;
      const data: OffspringData = {
        id: ev.offspringId, parentIds: [parentId],
        reproductionType: 'asexual', viability: 0.95, generation: gen
      };
      this.offspringMap.set(data.id, data);
      this.generationCounter.set(data.id, gen);
      logger.info({ offspringId: data.id, gen }, '[OffspringGenerator] Asexual offspring generated');
      return data;
    }

    get(id: string): OffspringData | null { return this.offspringMap.get(id) ?? null; }
    getAll(): OffspringData[] { return [...this.offspringMap.values()]; }
  }

  export const offspringGenerator = new OffspringGenerator();
  export default offspringGenerator;
  