import { logger } from '../lib/logger.js';
export class CulturalKnowledge {
    private cultures: Map<string, Record<string, any>> = new Map();
    learn(culture: string, norms: Record<string, any>): void { this.cultures.set(culture, norms); logger.info({ culture, normsCount: Object.keys(norms).length }, '[CulturalKnowledge] Learned'); }
    get(culture: string): Record<string, any> | null { return this.cultures.get(culture) ?? null; }
    getKnownCultures(): string[] { return [...this.cultures.keys()]; }
    isNormViolation(culture: string, action: string): boolean { const norms = this.cultures.get(culture); return norms ? Object.values(norms).some(n => action.includes('violate_'+String(n))) : false; }
  }
  export const culturalKnowledge = new CulturalKnowledge();
  export default culturalKnowledge;