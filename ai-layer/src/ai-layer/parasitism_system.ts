import { logger } from '../lib/logger.js';
  import { harmfulMutation } from './harmful_mutation.js';
  import { immunityGenerator } from './immunity_generator.js';
  export interface ParasiticRelationship { id: string; hostId: string; parasiteId: string; extractionRate: number; harmLevel: number; isDetected: boolean; }
  export class ParasitismSystem {
    private parasites: ParasiticRelationship[] = [];
    infect(hostId: string, parasiteId: string, extractionRate = 0.1): ParasiticRelationship {
      const r: ParasiticRelationship = { id: `par_${Date.now()}`, hostId, parasiteId, extractionRate, harmLevel: extractionRate * 10, isDetected: false };
      this.parasites.push(r);
      immunityGenerator.expose(hostId, parasiteId);
      logger.info({ hostId, parasiteId, extractionRate }, '[ParasitismSystem] Parasite infected host');
      return r;
    }
    detect(id: string): boolean {
      const r = this.parasites.find(p => p.id === id);
      if (r) { r.isDetected = true; r.harmLevel *= 0.5; return true; }
      return false;
    }
    getActiveParasites(hostId: string): ParasiticRelationship[] { return this.parasites.filter(p => p.hostId === hostId && !p.isDetected); }
  }
  export const parasitismSystem = new ParasitismSystem();
  export default parasitismSystem;
  