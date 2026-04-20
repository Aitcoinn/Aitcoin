import { logger } from '../lib/logger.js';
export interface LearningSession { entityId: string; topic: string; method: string; progress: number; retention: number; }
  export class LearningCore {
    private sessions: LearningSession[] = [];
    learn(entityId: string, topic: string, method = 'active'): LearningSession {
      const s: LearningSession = { entityId, topic, method, progress: 0, retention: method === 'active' ? 0.8 : 0.4 };
      this.sessions.push(s);
      logger.info({ entityId, topic, method }, '[LearningCore] Learning started');
      return s;
    }
    advance(entityId: string, topic: string, amount: number): void { this.sessions.find(s => s.entityId === entityId && s.topic === topic && s.progress < 1)?.['progress'] && (this.sessions.find(s => s.entityId === entityId && s.topic === topic)!.progress = Math.min(1, amount)); }
    getSessions(entityId: string): LearningSession[] { return this.sessions.filter(s => s.entityId === entityId); }
  }
  export const learningCore = new LearningCore();
  export default learningCore;