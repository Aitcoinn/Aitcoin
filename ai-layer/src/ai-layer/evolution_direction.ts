import { logger } from '../lib/logger.js';
  import { evolutionPressure } from './evolution_pressure.js';
  export type EvolutionDirection = 'generalist'|'specialist'|'size_increase'|'size_decrease'|'intelligence'|'speed'|'defense';
  export class EvolutionDirectionEngine {
    private currentDirection: EvolutionDirection = 'intelligence';
    determine(): EvolutionDirection {
      const pressure = evolutionPressure.getState();
      let dir: EvolutionDirection;
      if (pressure.environmentalPressure > 0.7) dir = 'defense';
      else if (pressure.competitivePressure > 0.6) dir = 'specialist';
      else if (pressure.sexualPressure > 0.5) dir = 'size_increase';
      else dir = 'intelligence';
      this.currentDirection = dir;
      logger.info({ direction: dir }, '[EvolutionDirection] Direction determined');
      return dir;
    }
    getCurrent(): EvolutionDirection { return this.currentDirection; }
  }
  export const evolutionDirection = new EvolutionDirectionEngine();
  export default evolutionDirection;
  