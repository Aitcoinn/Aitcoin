import { logger } from '../lib/logger.js';
import { experienceLearner } from './experience_learner.js';
  export class TrialError {
    private trials: Map<string, number> = new Map();
    trial(entityId: string, action: string): boolean {
      const count = (this.trials.get(entityId+action) ?? 0) + 1;
      this.trials.set(entityId+action, count);
      const success = Math.random() > 0.5 / count;
      experienceLearner.learn(entityId, action, success ? 'success' : 'failure');
      logger.info({ entityId, action, attempt: count, success }, '[TrialError] Trial');
      return success;
    }
    getAttempts(entityId: string, action: string): number { return this.trials.get(entityId+action) ?? 0; }
  }
  export const trialError = new TrialError();
  export default trialError;