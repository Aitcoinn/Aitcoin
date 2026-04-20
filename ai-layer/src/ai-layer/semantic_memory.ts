import { logger } from '../lib/logger.js';
export class SemanticMemory {
    private concepts: Map<string, Record<string, any>> = new Map();
    store(concept: string, definition: string, relatedConcepts: string[]): void { this.concepts.set(concept, { definition, relatedConcepts, learnedAt: Date.now() }); logger.info({ concept }, '[SemanticMemory] Stored'); }
    retrieve(concept: string): any { return this.concepts.get(concept) ?? null; }
    search(query: string): string[] { return [...this.concepts.keys()].filter(k => k.includes(query)); }
    getSize(): number { return this.concepts.size; }
  }
  export const semanticMemory = new SemanticMemory();
  export default semanticMemory;