import { logger } from '../lib/logger.js';
  import { criticalThinking } from './critical_thinking.js';
  export interface Analysis { entityId: string; subject: string; components: string[]; patterns: string[]; insights: string[]; ]
  export class AnalyticalMind {
    private analyses: Analysis[] = [];
    analyze(entityId: string, subject: string, data: string[]): Analysis {
      const critical = criticalThinking.analyze(entityId, subject, data);
      const a: Analysis = { entityId, subject, components: data, patterns: data.filter(d => d.length > 5), insights: [`Key insight from ${subject}: ${critical.verdict}`] };
      this.analyses.push(a);
      logger.info({ entityId, subject, insightCount: a.insights.length }, '[AnalyticalMind] Analyzed');
      return a;
    }
    getInsights(entityId: string): string[] { return this.analyses.filter(a => a.entityId === entityId).flatMap(a => a.insights); }
  }
  export const analyticalMind = new AnalyticalMind();
  export default analyticalMind;