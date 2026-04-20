import { logger } from '../lib/logger.js';
  import { neuronSystem } from './neuron_system.js';
  import { synapseFormation } from './synapse_formation.js';
  export interface SignalEvent { sourceId: string; targetId: string; signalStrength: number; transmitted: boolean; latencyMs: number; }
  export class SignalTransmission {
    private events: SignalEvent[] = [];
    transmit(sourceId: string, targetId: string, strength: number): SignalEvent {
      const synapses = synapseFormation.getAll().filter(s => s.preNeuronId === sourceId && s.postNeuronId === targetId);
      const totalWeight = synapses.reduce((s,syn) => s + syn.weight, 0);
      const actualStrength = strength * (totalWeight || 0.5);
      const fired = neuronSystem.stimulate(targetId, actualStrength);
      const e: SignalEvent = { sourceId, targetId, signalStrength: actualStrength, transmitted: fired, latencyMs: 1 + Math.random() * 5 };
      this.events.push(e);
      return e;
    }
    getTransmissionRate(): number {
      if (!this.events.length) return 0;
      return this.events.filter(e => e.transmitted).length / this.events.length;
    }
    getEvents(): SignalEvent[] { return [...this.events]; }
  }
  export const signalTransmission = new SignalTransmission();
  export default signalTransmission;