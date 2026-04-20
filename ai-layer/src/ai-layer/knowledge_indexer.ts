import { logger } from '../lib/logger.js';
export class KnowledgeIndexer {
    private index: Map<string, string[]> = new Map();
    index_item(entityId: string, key: string, tags: string[]): void {
      tags.forEach(tag => { const list = this.index.get(tag) ?? []; if (!list.includes(key)) { list.push(key); this.index.set(tag, list); } });
      logger.info({ entityId, key, tags: tags.length }, '[KnowledgeIndexer] Indexed');
    }
    search(tag: string): string[] { return this.index.get(tag) ?? []; }
    getIndex(): Record<string, string[]> { return Object.fromEntries(this.index.entries()); }
  }
  export const knowledgeIndexer = new KnowledgeIndexer();
  export default knowledgeIndexer;