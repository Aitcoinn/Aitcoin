import { logger } from '../lib/logger.js';
  import { tissueFormation, Tissue } from './tissue_formation.js';
  export interface Organ { id: string; name: string; function: string; tissues: string[]; health: number; isVital: boolean; }
  export class OrganSystem {
    private organs: Map<string, Organ> = new Map();
    createOrgan(name: string, fn: string, tissueIds: string[], isVital = false): Organ {
      const o: Organ = { id: `organ_${name}_${Date.now()}`, name, function: fn, tissues: tissueIds, health: 1.0, isVital };
      this.organs.set(o.id, o);
      logger.info({ name, fn, isVital }, '[OrganSystem] Organ created');
      return o;
    }
    updateHealth(organId: string): void {
      const o = this.organs.get(organId);
      if (!o) return;
      const avgIntegrity = o.tissues.map(tid => tissueFormation.get(tid)?.integrity ?? 1).reduce((s,v) => s+v, 0) / Math.max(1, o.tissues.length);
      o.health = avgIntegrity;
      if (o.isVital && o.health < 0.1) logger.warn({ organId, name: o.name }, '[OrganSystem] Vital organ critical');
    }
    get(id: string): Organ | null { return this.organs.get(id) ?? null; }
    getAll(): Organ[] { return [...this.organs.values()]; }
    getVitalOrgans(): Organ[] { return [...this.organs.values()].filter(o => o.isVital); }
  }
  export const organSystem = new OrganSystem();
  export default organSystem;
  