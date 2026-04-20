import { logger } from '../lib/logger.js';
import { longTermMemory } from './long_term_memory.js';
  import { falseMemory } from './false_memory.js';
  export class MemoryManipulation {
    alter(entityId: string, originalKey: string, newValue: string): void { longTermMemory.store(entityId, originalKey, newValue, 0.6); logger.warn({ entityId, originalKey }, '[MemoryManipulation] Memory altered'); }
    erase(entityId: string, key: string): void { logger.warn({ entityId, key }, '[MemoryManipulation] Memory erased'); }
    inject(entityId: string, falseContent: string): void { falseMemory.implant(entityId, falseContent); }
  }
  export const memoryManipulation = new MemoryManipulation();
  export default memoryManipulation;