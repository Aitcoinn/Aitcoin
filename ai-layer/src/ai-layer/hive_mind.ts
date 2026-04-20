import { logger } from '../lib/logger.js';
import { collectiveMemory } from './collective_memory.js';
  import { distributedCognition } from './distributed_cognition.js';
  export class HiveMind {
    private members: Set<string> = new Set();
    join(entityId: string): void { this.members.add(entityId); distributedCognition.register(entityId, ['collective_intelligence']); logger.info({ entityId, memberCount: this.members.size }, '[HiveMind] Joined'); }
    shareThought(entityId: string, thought: string): void { this.members.forEach(m => { if (m !== entityId) collectiveMemory.contribute(m, 'hive_thought', thought); }); }
    getGroupIntelligence(): number { return Math.log(this.members.size + 1) * 100; }
    size(): number { return this.members.size; }
  }
  export const hiveMind = new HiveMind();
  export default hiveMind;