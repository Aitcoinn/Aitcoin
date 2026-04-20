import { logger } from '../lib/logger.js';
  import { hereditySystem } from './heredity_system.js';
  export interface AncestryRecord { entityId: string; parents: string[]; grandparents: string[]; lineageDepth: number; commonAncestors: string[]; }
  export class AncestryTracker {
    private records: Map<string, AncestryRecord> = new Map();
    track(entityId: string, parent1: string, parent2: string): AncestryRecord {
      const p1Rec = this.records.get(parent1);
      const p2Rec = this.records.get(parent2);
      const grandparents = [...new Set([...(p1Rec?.parents ?? []), ...(p2Rec?.parents ?? [])])];
      const commonAnc = (p1Rec?.commonAncestors ?? []).filter(a => (p2Rec?.commonAncestors ?? []).includes(a));
      const maxDepth = Math.max(p1Rec?.lineageDepth ?? 0, p2Rec?.lineageDepth ?? 0);
      const r: AncestryRecord = { entityId, parents: [parent1, parent2], grandparents, lineageDepth: maxDepth + 1, commonAncestors: commonAnc };
      this.records.set(entityId, r);
      logger.info({ entityId, lineageDepth: r.lineageDepth }, '[AncestryTracker] Ancestry tracked');
      return r;
    }
    get(entityId: string): AncestryRecord | null { return this.records.get(entityId) ?? null; }
  }
  export const ancestryTracker = new AncestryTracker();
  export default ancestryTracker;
  