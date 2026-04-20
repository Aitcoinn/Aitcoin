import { logger } from '../lib/logger.js';
import { intelligenceIncrease } from './intelligence_increase.js';
  export class IqIncrease {
    private sessions: Map<string, number> = new Map();
    train(entityId: string, intensity = 1): void {
      const sessions = (this.sessions.get(entityId) ?? 0) + 1; this.sessions.set(entityId, sessions);
      const gain = Math.log(sessions + 1) * intensity;
      intelligenceIncrease.increase(entityId, gain);
      logger.info({ entityId, sessions, gain }, '[IqIncrease] IQ trained');
    }
    getIQ(entityId: string): number { return intelligenceIncrease.getScore(entityId); }
  }
  export const iqIncrease = new IqIncrease();
  export default iqIncrease;