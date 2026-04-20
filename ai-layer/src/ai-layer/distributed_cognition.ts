import { logger } from '../lib/logger.js';
import { collectiveMemory } from './collective_memory.js';
  export class DistributedCognition {
    private nodes: Map<string, string[]> = new Map();
    register(nodeId: string, capabilities: string[]): void { this.nodes.set(nodeId, capabilities); logger.info({ nodeId, capabilities: capabilities.length }, '[DistributedCognition] Node registered'); }
    distribute(entityId: string, task: string): string[] { const allCaps = [...this.nodes.values()].flat(); collectiveMemory.contribute(entityId, task, 'distributed_task'); return allCaps.filter(c => task.includes(c.split('_')[0] ?? '')); }
    getNodes(): string[] { return [...this.nodes.keys()]; }
  }
  export const distributedCognition = new DistributedCognition();
  export default distributedCognition;