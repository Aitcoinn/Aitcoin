import { logger } from '../lib/logger.js';
  import { lineageSystem } from './lineage_system.js';
  import { ancestryTracker } from './ancestry_tracker.js';
  export interface FamilyNode { entityId: string; parentIds: string[]; childIds: string[]; generation: number; }
  export class FamilyTree {
    private nodes: Map<string, FamilyNode> = new Map();
    addNode(entityId: string, parentIds: string[]): FamilyNode {
      const n: FamilyNode = { entityId, parentIds, childIds: [], generation: parentIds.length > 0 ? ((this.nodes.get(parentIds[0])?.generation ?? 0) + 1) : 0 };
      this.nodes.set(entityId, n);
      parentIds.forEach(pid => { const pNode = this.nodes.get(pid); if (pNode && !pNode.childIds.includes(entityId)) pNode.childIds.push(entityId); });
      logger.info({ entityId, generation: n.generation }, '[FamilyTree] Node added');
      return n;
    }
    getNode(entityId: string): FamilyNode | null { return this.nodes.get(entityId) ?? null; }
    getDescendants(entityId: string, depth = 3): string[] {
      const node = this.nodes.get(entityId);
      if (!node || depth === 0) return [];
      return [...node.childIds, ...node.childIds.flatMap(c => this.getDescendants(c, depth - 1))];
    }
  }
  export const familyTree = new FamilyTree();
  export default familyTree;
  