import { logger } from '../lib/logger.js';
  import { neuronSystem } from './neuron_system.js';
  export interface Synapse { id: string; preNeuronId: string; postNeuronId: string; weight: number; neurotransmitter: string; plasticityRate: number; }
  export class SynapseFormation {
    private synapses: Map<string, Synapse> = new Map();
    form(preId: string, postId: string, weight = 0.5): Synapse {
      neuronSystem.connect(preId, postId);
      const s: Synapse = { id: `syn_${Date.now()}`, preNeuronId: preId, postNeuronId: postId, weight, neurotransmitter: 'glutamate', plasticityRate: 0.01 };
      this.synapses.set(s.id, s);
      logger.info({ preId, postId, weight }, '[SynapseFormation] Synapse formed');
      return s;
    }
    strengthen(synapseId: string): void { const s = this.synapses.get(synapseId); if (s) s.weight = Math.min(1, s.weight + s.plasticityRate); }
    weaken(synapseId: string): void { const s = this.synapses.get(synapseId); if (s) s.weight = Math.max(0, s.weight - s.plasticityRate); }
    getAll(): Synapse[] { return [...this.synapses.values()]; }
  }
  export const synapseFormation = new SynapseFormation();
  export default synapseFormation;