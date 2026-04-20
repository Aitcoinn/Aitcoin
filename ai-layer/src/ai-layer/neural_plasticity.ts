import { logger } from '../lib/logger.js';
import { synapseFormation } from './synapse_formation.js';
  export class NeuralPlasticity {
    private plasticityRates: Map<string, number> = new Map();
    applyHebbian(entityId: string, preId: string, postId: string, correlation: number): void {
      const syn = synapseFormation.getAll().find(s => s.preNeuronId === preId && s.postNeuronId === postId);
      if (syn) { if (correlation > 0) synapseFormation.strengthen(syn.id); else synapseFormation.weaken(syn.id); }
      logger.info({ entityId, correlation }, '[NeuralPlasticity] Hebbian applied');
    }
    setPlasticityRate(entityId: string, rate: number): void { this.plasticityRates.set(entityId, Math.min(1, Math.max(0, rate))); }
    getRate(entityId: string): number { return this.plasticityRates.get(entityId) ?? 0.01; }
  }
  export const neuralPlasticity = new NeuralPlasticity();
  export default neuralPlasticity;