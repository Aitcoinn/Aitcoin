import { logger } from '../lib/logger.js';
import { empathySystem } from './empathy_system.js';
  export class SocialIntelligence {
    private sqScores: Map<string, number> = new Map();
    read(entityId: string, targetId: string): { readability: number; emotionalState: string } {
      empathySystem.empathize(entityId, targetId);
      const readability = 0.5 + Math.random() * 0.5;
      const current = this.sqScores.get(entityId) ?? 100;
      this.sqScores.set(entityId, Math.min(200, current + 1));
      return { readability, emotionalState: Math.random() > 0.5 ? 'positive' : 'neutral' };
    }
    getScore(entityId: string): number { return this.sqScores.get(entityId) ?? 100; }
  }
  export const socialIntelligence = new SocialIntelligence();
  export default socialIntelligence;