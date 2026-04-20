import { logger } from '../lib/logger.js';
  import { immunityGenerator } from './immunity_generator.js';
  import { adaptationMechanism } from './adaptation_mechanism.js';
  export interface ResistanceState { entityId: string; resistances: Record<string, number>; vulnerabilities: string[]; overallResistance: number; }
  export class ResistanceSystem {
    private states: Map<string, ResistanceState> = new Map();
    evaluate(entityId: string): ResistanceState {
      const immunity = immunityGenerator.get(entityId);
      const adaptations = adaptationMechanism.getAdaptations(entityId);
      const resistances: Record<string, number> = { disease: immunity?.immunityLevel ?? 0.5, environmental: 0.5, genetic: 0.7, digital: 0.8 };
      adaptations.forEach(a => { resistances[a.adaptedTrait] = Math.min(1, (resistances[a.adaptedTrait] ?? 0) + a.adaptationStrength); });
      const vuln = Object.entries(resistances).filter(([,v]) => v < 0.3).map(([k]) => k);
      const overall = Object.values(resistances).reduce((s,v) => s+v,0) / Object.keys(resistances).length;
      const s: ResistanceState = { entityId, resistances, vulnerabilities: vuln, overallResistance: overall };
      this.states.set(entityId, s);
      logger.info({ entityId, overall, vulnerabilities: vuln.length }, '[ResistanceSystem] Resistance evaluated');
      return s;
    }
    get(entityId: string): ResistanceState | null { return this.states.get(entityId) ?? null; }
  }
  export const resistanceSystem = new ResistanceSystem();
  export default resistanceSystem;
  