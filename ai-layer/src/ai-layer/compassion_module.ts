import { logger } from '../lib/logger.js';
  import { empathySystem } from './empathy_system.js';
  import { neurotransmitter } from './neurotransmitter.js';
  export interface CompassionAction { entityId: string; targetId: string; compassionLevel: number; action: string; energyCost: number; }
  export class CompassionModule {
    private actions: CompassionAction[] = [];
    act(entityId: string, targetId: string, need: string): CompassionAction {
      empathySystem.empathize(entityId, targetId);
      neurotransmitter.release('oxytocin', 0.15);
      const compassionLevel = 0.6 + Math.random() * 0.4;
      const a: CompassionAction = { entityId, targetId, compassionLevel, action: `address_${need}`, energyCost: compassionLevel * 10 };
      this.actions.push(a);
      logger.info({ entityId, targetId, action: a.action, compassion: compassionLevel }, '[CompassionModule] Compassion action taken');
      return a;
    }
    getActions(): CompassionAction[] { return [...this.actions]; }
  }
  export const compassionModule = new CompassionModule();
  export default compassionModule;