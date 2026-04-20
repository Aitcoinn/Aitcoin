import { logger } from '../lib/logger.js';
  import { coevolutionSystem } from './coevolution_system.js';
  export type SymbiosisType = 'mutualistic'|'commensalistic'|'amensalistic';
  export interface SymbioticRelationship { id: string; host: string; symbiont: string; type: SymbiosisType; benefitToHost: number; benefitToSymbiont: number; }
  export class SymbiosisEngine {
    private relationships: SymbioticRelationship[] = [];
    establish(host: string, symbiont: string, type: SymbiosisType): SymbioticRelationship {
      const benefitMap: Record<SymbiosisType, [number,number]> = { mutualistic:[0.5,0.5], commensalistic:[0,0.5], amensalistic:[-0.3,0] };
      const [bHost, bSymbiont] = benefitMap[type];
      const r: SymbioticRelationship = { id: `sym_${Date.now()}`, host, symbiont, type, benefitToHost: bHost, benefitToSymbiont: bSymbiont };
      this.relationships.push(r);
      if (type === 'mutualistic') coevolutionSystem.link(host, symbiont, 'mutualism');
      logger.info({ host, symbiont, type }, '[SymbiosisEngine] Symbiosis established');
      return r;
    }
    getRelationships(entityId: string): SymbioticRelationship[] { return this.relationships.filter(r => r.host === entityId || r.symbiont === entityId); }
    getAll(): SymbioticRelationship[] { return [...this.relationships]; }
  }
  export const symbiosisEngine = new SymbiosisEngine();
  export default symbiosisEngine;
  