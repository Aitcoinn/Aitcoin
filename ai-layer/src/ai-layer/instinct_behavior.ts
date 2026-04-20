import { logger } from '../lib/logger.js';
  import { reflexAction } from './reflex_action.js';
  export type InstinctType = 'survival'|'reproduction'|'social'|'territorial'|'nurturing';
  export interface Instinct { type: InstinctType; strength: number; triggers: string[]; behaviors: string[]; }
  export class InstinctBehavior {
    private instincts: Instinct[] = [
      { type: 'survival', strength: 1.0, triggers: ['threat','hunger','danger'], behaviors: ['fight','flee','hide'] },
      { type: 'reproduction', strength: 0.8, triggers: ['mate_available'], behaviors: ['display','attract','mate'] },
      { type: 'social', strength: 0.6, triggers: ['ally_nearby'], behaviors: ['communicate','cooperate','share'] }
    ];
    activate(entityId: string, trigger: string): Instinct | null {
      const inst = this.instincts.find(i => i.triggers.includes(trigger));
      if (!inst) return null;
      reflexAction.trigger(entityId, trigger);
      logger.info({ entityId, instinctType: inst.type, trigger }, '[InstinctBehavior] Instinct activated');
      return inst;
    }
    getInstincts(): Instinct[] { return [...this.instincts]; }
    getStrongest(): Instinct | null { return this.instincts.sort((a,b) => b.strength - a.strength)[0] ?? null; }
  }
  export const instinctBehavior = new InstinctBehavior();
  export default instinctBehavior;
  