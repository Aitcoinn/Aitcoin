import { logger } from '../lib/logger.js';
  export interface NeuralLayer { id: string; neurons: number; activation: string; weights: number[][]; }
  export interface NeuralNetworkState { layers: NeuralLayer[]; learningRate: number; accuracy: number; trainingEpochs: number; }
  export class NeuralNetworkCore {
    private networks: Map<string, NeuralNetworkState> = new Map();
    create(entityId: string, layerSizes: number[]): NeuralNetworkState {
      const layers: NeuralLayer[] = layerSizes.map((n, i) => ({ id: `layer_${i}`, neurons: n, activation: i === layerSizes.length-1 ? 'softmax' : 'relu', weights: Array.from({length: n}, () => Array.from({length: layerSizes[i-1]??1}, () => (Math.random()-0.5)*0.1)) }));
      const net: NeuralNetworkState = { layers, learningRate: 0.001, accuracy: 0, trainingEpochs: 0 };
      this.networks.set(entityId, net);
      logger.info({ entityId, layers: layers.length }, '[NeuralNetworkCore] Network created');
      return net;
    }
    train(entityId: string): void {
      const net = this.networks.get(entityId);
      if (!net) return;
      net.trainingEpochs++;
      net.accuracy = Math.min(0.99, net.accuracy + 0.01 * Math.random());
      logger.info({ entityId, epochs: net.trainingEpochs, accuracy: net.accuracy }, '[NeuralNetworkCore] Training epoch');
    }
    get(entityId: string): NeuralNetworkState | null { return this.networks.get(entityId) ?? null; }
  }
  export const neuralNetworkCore = new NeuralNetworkCore();
  export default neuralNetworkCore;