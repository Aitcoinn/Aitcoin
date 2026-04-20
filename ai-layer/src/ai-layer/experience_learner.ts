import { logger } from '../lib/logger.js';
import { learningCore } from './learning_core.js';
  export class ExperienceLearner {
    private experiences: Map<string, string[]> = new Map();
    learn(entityId: string, experience: string, outcome: 'success'|'failure'): void {
      const exps = this.experiences.get(entityId) ?? [];
      exps.push(outcome+':'+experience); this.experiences.set(entityId, exps);
      learningCore.learn(entityId, experience, 'experiential');
      logger.info({ entityId, experience, outcome }, '[ExperienceLearner] Learned');
    }
    getExperiences(entityId: string): string[] { return this.experiences.get(entityId) ?? []; }
    getSuccessRate(entityId: string): number { const exps = this.getExperiences(entityId); return exps.length > 0 ? exps.filter(e => e.startsWith('success')).length / exps.length : 0; }
  }
  export const experienceLearner = new ExperienceLearner();
  export default experienceLearner;