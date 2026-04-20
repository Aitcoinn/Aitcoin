import { logger } from '../lib/logger.js';
import { wisdomAccumulator } from './wisdom_accumulator.js';
  export class InsightGenerator {
    private insights: Map<string, string[]> = new Map();
    generate(entityId: string, context: string): string {
      const wisdom = wisdomAccumulator.get(entityId);
      const insight = 'insight_'+(wisdom ? 'wise' : 'naive')+'_'+context+'_'+Date.now().toString(36);
      const existing = this.insights.get(entityId) ?? [];
      existing.push(insight); this.insights.set(entityId, existing);
      wisdomAccumulator.accumulate(entityId, insight);
      logger.info({ entityId, context, insight }, '[InsightGenerator] Insight generated');
      return insight;
    }
    getInsights(entityId: string): string[] { return this.insights.get(entityId) ?? []; }
  }
  export const insightGenerator = new InsightGenerator();
  export default insightGenerator;