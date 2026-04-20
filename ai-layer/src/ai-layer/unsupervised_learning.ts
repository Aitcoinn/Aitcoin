import { logger } from '../lib/logger.js';
export class UnsupervisedLearning {
    private clusters: Map<string, string[]> = new Map();
    cluster(items: string[], k = 3): Record<string, string[]> {
      const keys = Array.from({length: k}, (_,i) => 'cluster_'+i);
      const result: Record<string, string[]> = Object.fromEntries(keys.map(k => [k, []]));
      items.forEach((item,i) => { const key = keys[i % k]; if (key) result[key]!.push(item); });
      logger.info({ items: items.length, k }, '[UnsupervisedLearning] Clustered');
      return result;
    }
    findPatterns(data: string[]): string[] { return [...new Set(data.filter(d => data.filter(x => x === d).length > 1))]; }
  }
  export const unsupervisedLearning = new UnsupervisedLearning();
  export default unsupervisedLearning;