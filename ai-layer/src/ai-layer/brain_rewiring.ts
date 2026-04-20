import { logger } from '../lib/logger.js';
import { neuralPlasticity } from './neural_plasticity.js';
  import { brainStructure } from './brain_structure.js';
  export class BrainRewiring {
    rewire(entityId: string, fromRegion: string, toRegion: string): void {
      const brain = brainStructure.get(entityId);
      if (brain?.regions[fromRegion]) {
        const connections = brain.regions[fromRegion].connections;
        if (!connections.includes(toRegion)) connections.push(toRegion);
      }
      neuralPlasticity.setPlasticityRate(entityId, 0.05);
      logger.info({ entityId, fromRegion, toRegion }, '[BrainRewiring] Rewired');
    }
  }
  export const brainRewiring = new BrainRewiring();
  export default brainRewiring;