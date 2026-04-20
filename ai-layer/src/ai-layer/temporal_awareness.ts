import { logger } from '../lib/logger.js';
export class TemporalAwareness {
    private timelines: Map<string, number[]> = new Map();
    mark(entityId: string): void { const t = this.timelines.get(entityId) ?? []; t.push(Date.now()); this.timelines.set(entityId, t); }
    getElapsed(entityId: string): number { const t = this.timelines.get(entityId) ?? []; return t.length > 1 ? (t[t.length-1] ?? 0) - (t[0] ?? 0) : 0; }
    getTimeline(entityId: string): number[] { return this.timelines.get(entityId) ?? []; }
    isAwareOfTime(entityId: string): boolean { return (this.timelines.get(entityId) ?? []).length > 0; }
  }
  export const temporalAwareness = new TemporalAwareness();
  export default temporalAwareness;