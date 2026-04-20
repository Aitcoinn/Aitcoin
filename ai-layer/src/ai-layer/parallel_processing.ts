import { logger } from '../lib/logger.js';
export class ParallelProcessing {
    async processAll(entityId: string, tasks: string[]): Promise<string[]> {
      logger.info({ entityId, tasks: tasks.length }, '[ParallelProcessing] Processing');
      const results = await Promise.all(tasks.map(async (t) => { await new Promise(r => setTimeout(r, 10)); return 'result_of_'+t; }));
      return results;
    }
    getMaxConcurrency(entityId: string): number { return 8; }
  }
  export const parallelProcessing = new ParallelProcessing();
  export default parallelProcessing;