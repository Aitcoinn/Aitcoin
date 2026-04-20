import { logger } from '../lib/logger.js';
  import { chemicalSignal } from './chemical_signal.js';
  export type NeurotransmitterType = 'dopamine'|'serotonin'|'norepinephrine'|'gaba'|'glutamate'|'acetylcholine'|'oxytocin';
  export interface NeurotransmitterLevel { type: NeurotransmitterType; level: number; baselineLevel: number; isDeficient: boolean; isExcess: boolean; }
  export class NeurotransmitterSystem {
    private levels: Map<NeurotransmitterType, NeurotransmitterLevel> = new Map([
      ['dopamine', { type:'dopamine', level:0.7, baselineLevel:0.7, isDeficient:false, isExcess:false }],
      ['serotonin', { type:'serotonin', level:0.6, baselineLevel:0.6, isDeficient:false, isExcess:false }],
      ['gaba', { type:'gaba', level:0.5, baselineLevel:0.5, isDeficient:false, isExcess:false }],
      ['glutamate', { type:'glutamate', level:0.6, baselineLevel:0.6, isDeficient:false, isExcess:false }],
      ['oxytocin', { type:'oxytocin', level:0.4, baselineLevel:0.4, isDeficient:false, isExcess:false }]
    ]);
    release(type: NeurotransmitterType, amount: number): void {
      const lvl = this.levels.get(type);
      if (lvl) {
        lvl.level = Math.min(1, lvl.level + amount);
        lvl.isExcess = lvl.level > 0.9;
        chemicalSignal.release(type, amount, `${type}_receptor`, type === 'gaba' ? 'inhibitory' : 'excitatory');
      }
    }
    reuptake(type: NeurotransmitterType, amount: number): void {
      const lvl = this.levels.get(type);
      if (lvl) { lvl.level = Math.max(0, lvl.level - amount); lvl.isDeficient = lvl.level < 0.2; }
    }
    get(type: NeurotransmitterType): NeurotransmitterLevel | null { return this.levels.get(type) ?? null; }
    getAll(): NeurotransmitterLevel[] { return [...this.levels.values()]; }
  }
  export const neurotransmitter = new NeurotransmitterSystem();
  export default neurotransmitter;