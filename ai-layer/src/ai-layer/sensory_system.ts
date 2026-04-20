import { logger } from '../lib/logger.js';
  export class SensorySystem { sense(entityId: string, input: string, modality: string): string { logger.info({ entityId, modality, inputLen: input.length }, '[SensorySystem] Sensed'); return modality+'_processed_'+input.slice(0,10); } }
  export const sensorySystem = new SensorySystem();
  export default sensorySystem;