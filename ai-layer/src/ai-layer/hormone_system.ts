import { logger } from '../lib/logger.js';
  import { neurotransmitter } from './neurotransmitter.js';
  export type Hormone = 'cortisol'|'adrenaline'|'testosterone'|'estrogen'|'insulin'|'melatonin';
  export interface HormoneState { hormone: Hormone; level: number; effect: string; }
  export class HormoneSystem {
    private states: Map<Hormone, HormoneState> = new Map([
      ['cortisol', { hormone:'cortisol', level:0.3, effect:'stress_response' }],
      ['adrenaline', { hormone:'adrenaline', level:0.2, effect:'fight_or_flight' }],
      ['melatonin', { hormone:'melatonin', level:0.4, effect:'sleep_regulation' }],
      ['insulin', { hormone:'insulin', level:0.5, effect:'energy_regulation' }]
    ]);
    release(hormone: Hormone, amount: number): void {
      const s = this.states.get(hormone);
      if (s) {
        s.level = Math.min(1, s.level + amount);
        if (hormone === 'cortisol' && s.level > 0.7) neurotransmitter.reuptake('serotonin', 0.1);
        if (hormone === 'adrenaline') neurotransmitter.release('norepinephrine', amount);
        logger.info({ hormone, level: s.level }, '[HormoneSystem] Hormone released');
      }
    }
    get(hormone: Hormone): HormoneState | null { return this.states.get(hormone) ?? null; }
    getAll(): HormoneState[] { return [...this.states.values()]; }
  }
  export const hormoneSystem = new HormoneSystem();
  export default hormoneSystem;