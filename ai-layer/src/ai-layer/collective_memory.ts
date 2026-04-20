import { logger } from '../lib/logger.js';
export class CollectiveMemory {
    private shared: Map<string, Array<{entityId: string; memory: string; timestamp: number}>> = new Map();
    contribute(entityId: string, topic: string, memory: string): void { const list = this.shared.get(topic) ?? []; list.push({ entityId, memory, timestamp: Date.now() }); this.shared.set(topic, list); logger.info({ entityId, topic }, '[CollectiveMemory] Contributed'); }
    retrieve(topic: string): string[] { return (this.shared.get(topic) ?? []).map(m => m.memory); }
    getTopics(): string[] { return [...this.shared.keys()]; }
  }
  export const collectiveMemory = new CollectiveMemory();
  export default collectiveMemory;