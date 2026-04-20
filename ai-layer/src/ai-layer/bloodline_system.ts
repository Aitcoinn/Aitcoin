import { logger } from '../lib/logger.js';
  import { lineageSystem } from './lineage_system.js';
  import { familyTree } from './family_tree.js';
  export interface Bloodline { id: string; founderIds: string[]; name: string; purity: number; specialTraits: string[]; generation: number; }
  export class BloodlineSystem {
    private bloodlines: Map<string, Bloodline> = new Map();
    establish(founderId: string, name: string, traits: string[]): Bloodline {
      const tree = lineageSystem.buildTree(founderId);
      familyTree.addNode(founderId, []);
      const b: Bloodline = { id: `bl_${founderId}`, founderIds: [founderId], name, purity: 1.0, specialTraits: traits, generation: 1 };
      this.bloodlines.set(b.id, b);
      logger.info({ founderId, name }, '[BloodlineSystem] Bloodline established');
      return b;
    }
    addMember(bloodlineId: string, entityId: string, parentIds: string[]): void {
      const bl = this.bloodlines.get(bloodlineId);
      if (!bl) return;
      familyTree.addNode(entityId, parentIds);
      lineageSystem.addDescendant(bl.founderIds[0], entityId);
      bl.generation = Math.max(bl.generation, (familyTree.getNode(entityId)?.generation ?? 0));
      bl.purity = Math.max(0.1, bl.purity * 0.99);
    }
    get(id: string): Bloodline | null { return this.bloodlines.get(id) ?? null; }
    getAll(): Bloodline[] { return [...this.bloodlines.values()]; }
  }
  export const bloodlineSystem = new BloodlineSystem();
  export default bloodlineSystem;
  