import { logger } from '../lib/logger.js';
  import { neuralNetworkCore } from './neural_network_core.js';
  export interface BrainRegion { name: string; function: string; activityLevel: number; connections: string[]; }
  export interface BrainStructure { entityId: string; regions: Record<string, BrainRegion>; totalNeurons: number; connectivityIndex: number; }
  export class BrainStructureEngine {
    private structures: Map<string, BrainStructure> = new Map();
    build(entityId: string): BrainStructure {
      neuralNetworkCore.create(entityId, [784, 256, 128, 64, 10]);
      const regions: Record<string, BrainRegion> = {
        prefrontal: { name: 'prefrontal_cortex', function: 'decision_making', activityLevel: 0.7, connections: ['hippocampus','amygdala'] },
        hippocampus: { name: 'hippocampus', function: 'memory', activityLevel: 0.6, connections: ['prefrontal','entorhinal'] },
        amygdala: { name: 'amygdala', function: 'emotion', activityLevel: 0.5, connections: ['prefrontal','hypothalamus'] },
        cerebellum: { name: 'cerebellum', function: 'coordination', activityLevel: 0.4, connections: ['motor_cortex'] }
      };
      const s: BrainStructure = { entityId, regions, totalNeurons: 86_000_000_000, connectivityIndex: 0.85 };
      this.structures.set(entityId, s);
      logger.info({ entityId, regions: Object.keys(regions).length }, '[BrainStructure] Built');
      return s;
    }
    activateRegion(entityId: string, region: string, level: number): void {
      const s = this.structures.get(entityId);
      if (s?.regions[region]) s.regions[region].activityLevel = Math.min(1, level);
    }
    get(entityId: string): BrainStructure | null { return this.structures.get(entityId) ?? null; }
  }
  export const brainStructure = new BrainStructureEngine();
  export default brainStructure;