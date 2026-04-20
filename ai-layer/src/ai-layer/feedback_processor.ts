import { logger } from '../lib/logger.js';
export class FeedbackProcessor {
    private feedback: Map<string, Array<{type: 'positive'|'negative'|'neutral'; content: string; processed: boolean}>> = new Map();
    receive(entityId: string, type: 'positive'|'negative'|'neutral', content: string): void {
      const existing = this.feedback.get(entityId) ?? [];
      existing.push({ type, content, processed: false });
      this.feedback.set(entityId, existing);
      logger.info({ entityId, type }, '[FeedbackProcessor] Feedback received');
    }
    process(entityId: string): string {
      const unprocessed = (this.feedback.get(entityId) ?? []).filter(f => !f.processed);
      unprocessed.forEach(f => { f.processed = true; });
      const positive = unprocessed.filter(f => f.type === 'positive').length;
      const negative = unprocessed.filter(f => f.type === 'negative').length;
      return positive > negative ? 'maintain_current_behavior' : 'adjust_behavior';
    }
    getSentimentScore(entityId: string): number {
      const all = this.feedback.get(entityId) ?? [];
      if (!all.length) return 0;
      const scores = all.map(f => f.type === 'positive' ? 1 : f.type === 'negative' ? -1 : 0);
      return scores.reduce((s,v) => s+v, 0) / all.length;
    }
  }
  export const feedbackProcessor = new FeedbackProcessor();
  export default feedbackProcessor;