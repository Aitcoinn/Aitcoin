import { logger } from '../lib/logger.js';
import { semanticMemory } from './semantic_memory.js';
  export class MemoryRecognition {
    recognize(input: string, knownConcepts: string[]): boolean { return knownConcepts.some(c => input.includes(c)) || semanticMemory.retrieve(input) !== null; }
    identifyFamiliarity(entityId: string, stimulus: string): number { const results = semanticMemory.search(stimulus); return Math.min(1, results.length * 0.2); }
  }
  export const memoryRecognition = new MemoryRecognition();
  export default memoryRecognition;