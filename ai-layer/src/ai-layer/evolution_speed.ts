import { logger } from '../lib/logger.js';
  import { evolutionPressure } from './evolution_pressure.js';
  export class EvolutionSpeed {
    private baseSpeed = 1.0;
    private modifier = 1.0;
    calculateSpeed(): number {
      const pressure = evolutionPressure.getTotalPressure();
      const speed = this.baseSpeed * this.modifier * (1 + pressure);
      logger.info({ speed, pressure }, '[EvolutionSpeed] Speed calculated');
      return speed;
    }
    setModifier(m: number): void { this.modifier = Math.max(0.1, Math.min(10, m)); }
    getBaseSpeed(): number { return this.baseSpeed; }
  }
  export const evolutionSpeed = new EvolutionSpeed();
  export default evolutionSpeed;
  