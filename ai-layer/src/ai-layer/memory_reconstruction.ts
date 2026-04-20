import { logger } from '../lib/logger.js';
import { memoryRecall } from './memory_recall.js';
  export class MemoryReconstruction {
    reconstruct(entityId: string, fragmentedCue: string): string {
      const recalled = memoryRecall.contextualRecall(entityId, fragmentedCue);
      const reconstructed = recalled.length > 0 ? 'reconstructed_'+recalled.join('_') : 'reconstructed_from_fragments_'+fragmentedCue;
      logger.info({ entityId, fragmentedCue, reconstructed }, '[MemoryReconstruction] Reconstructed');
      return reconstructed;
    }
  }
  export const memoryReconstruction = new MemoryReconstruction();
  export default memoryReconstruction;