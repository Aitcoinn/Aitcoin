import { logger } from '../lib/logger.js';
  import { organSystem, Organ } from './organ_system.js';
  export interface BodyStructure { entityId: string; organs: string[]; structuralIntegrity: number; systems: Record<string, string[]>; }
  export class BodyStructureEngine {
    private bodies: Map<string, BodyStructure> = new Map();
    build(entityId: string): BodyStructure {
      const vitalOrgans = organSystem.getVitalOrgans();
      const b: BodyStructure = {
        entityId, organs: vitalOrgans.map(o => o.id), structuralIntegrity: 1.0,
        systems: { nervous: [], circulatory: [], digestive: [], immune: [] }
      };
      this.bodies.set(entityId, b);
      logger.info({ entityId, organs: b.organs.length }, '[BodyStructure] Body structure built');
      return b;
    }
    addOrganToSystem(entityId: string, system: string, organId: string): void {
      const b = this.bodies.get(entityId);
      if (b && b.systems[system]) b.systems[system].push(organId);
    }
    getIntegrity(entityId: string): number {
      const b = this.bodies.get(entityId);
      if (!b) return 0;
      const organs = b.organs.map(id => organSystem.get(id)?.health ?? 0);
      return organs.length > 0 ? organs.reduce((s,v) => s+v,0)/organs.length : 0;
    }
    get(entityId: string): BodyStructure | null { return this.bodies.get(entityId) ?? null; }
  }
  export const bodyStructure = new BodyStructureEngine();
  export default bodyStructure;
  