import { logger } from '../lib/logger.js';
  export type RelationshipType = 'parent'|'child'|'sibling'|'mate'|'offspring'|'ancestor'|'ally'|'rival';
  export interface Relationship { id: string; entity1: string; entity2: string; type: RelationshipType; strength: number; }
  export class RelationshipMap {
    private relationships: Relationship[] = [];
    add(e1: string, e2: string, type: RelationshipType, strength = 0.5): Relationship {
      const r: Relationship = { id: `rel_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, entity1: e1, entity2: e2, type, strength };
      this.relationships.push(r);
      logger.info({ e1, e2, type, strength }, '[RelationshipMap] Relationship added');
      return r;
    }
    getRelationships(entityId: string): Relationship[] { return this.relationships.filter(r => r.entity1 === entityId || r.entity2 === entityId); }
    getByType(type: RelationshipType): Relationship[] { return this.relationships.filter(r => r.type === type); }
    getStrength(e1: string, e2: string): number {
      const r = this.relationships.find(x => (x.entity1 === e1 && x.entity2 === e2) || (x.entity1 === e2 && x.entity2 === e1));
      return r?.strength ?? 0;
    }
  }
  export const relationshipMap = new RelationshipMap();
  export default relationshipMap;
  