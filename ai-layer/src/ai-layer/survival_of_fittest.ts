import { logger } from '../lib/logger.js';
  import { naturalSelection } from './natural_selection.js';
  import { phenotypeEngine } from './phenotype_engine.js';
  export interface FitnessRanking { entityId: string; fitnessScore: number; rank: number; survived: boolean; }
  export class SurvivalOfFittest {
    rankAndSelect(entityIds: string[], pressure = 0.3): FitnessRanking[] {
      const event = naturalSelection.select(entityIds, pressure);
      const scored = entityIds.map((id, idx) => ({
        entityId: id, fitnessScore: phenotypeEngine.get(id)?.fitnessScore ?? 0,
        rank: idx + 1, survived: event.survivorIds.includes(id)
      }));
      scored.sort((a,b) => b.fitnessScore - a.fitnessScore).forEach((s,i) => s.rank = i+1);
      logger.info({ total: entityIds.length, survivors: event.survivorIds.length }, '[SurvivalOfFittest] Rankings computed');
      return scored;
    }
  }
  export const survivalOfFittest = new SurvivalOfFittest();
  export default survivalOfFittest;
  