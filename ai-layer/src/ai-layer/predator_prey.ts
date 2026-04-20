import { logger } from '../lib/logger.js';
  import { survivalInstinct } from './survival_instinct.js';
  import { naturalSelection } from './natural_selection.js';
  export interface PredatorPreyEvent { predatorId: string; preyId: string; success: boolean; energyTransferred: number; timestamp: number; }
  export class PredatorPrey {
    private events: PredatorPreyEvent[] = [];
    hunt(predatorId: string, preyId: string, predatorFitness: number, preyFitness: number): PredatorPreyEvent {
      const success = predatorFitness > preyFitness * (0.5 + Math.random());
      if (!success) survivalInstinct.respond(preyId, 'predator');
      const e: PredatorPreyEvent = { predatorId, preyId, success, energyTransferred: success ? preyFitness * 10 : 0, timestamp: Date.now() };
      this.events.push(e);
      logger.info({ predatorId, preyId, success }, '[PredatorPrey] Hunt result');
      return e;
    }
    getEvents(): PredatorPreyEvent[] { return [...this.events]; }
    getPredatorSuccessRate(predatorId: string): number {
      const hunts = this.events.filter(e => e.predatorId === predatorId);
      return hunts.length > 0 ? hunts.filter(e => e.success).length / hunts.length : 0;
    }
  }
  export const predatorPrey = new PredatorPrey();
  export default predatorPrey;
  