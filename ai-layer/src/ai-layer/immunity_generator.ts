import { logger } from '../lib/logger.js';
  export interface ImmunityState { entityId: string; immunityLevel: number; knownPathogens: string[]; activeDefenses: string[]; }
  export class ImmunityGenerator {
    private states: Map<string, ImmunityState> = new Map();
    init(entityId: string): ImmunityState {
      const s: ImmunityState = { entityId, immunityLevel: 0.7, knownPathogens: [], activeDefenses: ['innate'] };
      this.states.set(entityId, s); return s;
    }
    expose(entityId: string, pathogen: string): void {
      const s = this.states.get(entityId) ?? this.init(entityId);
      if (!s.knownPathogens.includes(pathogen)) { s.knownPathogens.push(pathogen); s.immunityLevel = Math.min(1, s.immunityLevel + 0.05); s.activeDefenses.push(`adaptive_${pathogen}`); }
      logger.info({ entityId, pathogen, immunity: s.immunityLevel }, '[ImmunityGenerator] Immunity updated');
    }
    get(entityId: string): ImmunityState | null { return this.states.get(entityId) ?? null; }
    getImmunityLevel(entityId: string): number { return this.states.get(entityId)?.immunityLevel ?? 0; }
  }
  export const immunityGenerator = new ImmunityGenerator();
  export default immunityGenerator;
  