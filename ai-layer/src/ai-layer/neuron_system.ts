import { logger } from '../lib/logger.js';
  export interface Neuron { id: string; type: 'excitatory'|'inhibitory'|'modulatory'; potential: number; threshold: number; isFiring: boolean; connections: string[]; }
  export class NeuronSystem {
    private neurons: Map<string, Neuron> = new Map();
    createNeuron(type: Neuron['type'] = 'excitatory'): Neuron {
      const n: Neuron = { id: `neuron_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, type, potential: -70, threshold: -55, isFiring: false, connections: [] };
      this.neurons.set(n.id, n); return n;
    }
    stimulate(neuronId: string, input: number): boolean {
      const n = this.neurons.get(neuronId);
      if (!n) return false;
      n.potential += input * (n.type === 'excitatory' ? 1 : -1);
      if (n.potential >= n.threshold) { n.isFiring = true; n.potential = -70; return true; }
      n.isFiring = false; return false;
    }
    connect(n1: string, n2: string): void { const n = this.neurons.get(n1); if (n && !n.connections.includes(n2)) n.connections.push(n2); }
    getFiringCount(): number { return [...this.neurons.values()].filter(n => n.isFiring).length; }
    get(id: string): Neuron | null { return this.neurons.get(id) ?? null; }
  }
  export const neuronSystem = new NeuronSystem();
  export default neuronSystem;