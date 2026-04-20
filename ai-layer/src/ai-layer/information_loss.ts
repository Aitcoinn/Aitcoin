import { logger } from '../lib/logger.js';
import { forgettingProcess } from './forgetting_process.js';
  export class InformationLoss {
    private lossEvents: Array<{entityId: string; info: string; lossReason: string; timestamp: number}> = [];
    recordLoss(entityId: string, info: string, reason: string): void {
      this.lossEvents.push({ entityId, info, lossReason: reason, timestamp: Date.now() });
      forgettingProcess.forget(entityId, info);
      logger.info({ entityId, reason }, '[InformationLoss] Information lost');
    }
    getLossRate(entityId: string): number { return (this.lossEvents.filter(e => e.entityId === entityId).length / Math.max(1, 100)); }
  }
  export const informationLoss = new InformationLoss();
  export default informationLoss;