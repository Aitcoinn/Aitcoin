import { logger } from '../lib/logger.js';
  import { naturalSelection } from './natural_selection.js';
  export interface EvolutionPressureState { environmentalPressure: number; competitivePressure: number; sexualPressure: number; totalPressure: number; }
  export class EvolutionPressure {
    private state: EvolutionPressureState = { environmentalPressure: 0.3, competitivePressure: 0.2, sexualPressure: 0.1, totalPressure: 0.6 };
    update(env: number, comp: number, sex: number): EvolutionPressureState {
      this.state = { environmentalPressure: env, competitivePressure: comp, sexualPressure: sex, totalPressure: (env+comp+sex)/3 };
      logger.info({ totalPressure: this.state.totalPressure }, '[EvolutionPressure] Updated');
      return this.state;
    }
    getState(): EvolutionPressureState { return { ...this.state }; }
    getTotalPressure(): number { return this.state.totalPressure; }
  }
  export const evolutionPressure = new EvolutionPressure();
  export default evolutionPressure;
  