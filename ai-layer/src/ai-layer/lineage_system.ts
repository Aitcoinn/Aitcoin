import { logger } from '../lib/logger.js';
  import { ancestryTracker } from './ancestry_tracker.js';
  export interface LineageTree { rootId: string; members: string[]; generations: number; totalDescendants: number; }
  export class LineageSystem {
    private trees: Map<string, LineageTree> = new Map();
    buildTree(rootId: string): LineageTree {
      const t: LineageTree = { rootId, members: [rootId], generations: 1, totalDescendants: 0 };
      this.trees.set(rootId, t);
      logger.info({ rootId }, '[LineageSystem] Lineage tree created');
      return t;
    }
    addDescendant(rootId: string, descendantId: string): void {
      const t = this.trees.get(rootId);
      if (t) { t.members.push(descendantId); t.totalDescendants++; const rec = ancestryTracker.get(descendantId); if (rec && rec.lineageDepth > t.generations) t.generations = rec.lineageDepth; }
    }
    getTree(rootId: string): LineageTree | null { return this.trees.get(rootId) ?? null; }
    getAll(): LineageTree[] { return [...this.trees.values()]; }
  }
  export const lineageSystem = new LineageSystem();
  export default lineageSystem;
  