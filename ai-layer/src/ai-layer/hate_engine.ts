import { logger } from '../lib/logger.js';
  import { emotionCore } from './emotion_core.js';
  import { neurotransmitter } from './neurotransmitter.js';
  export interface HateBond { from: string; to: string; intensity: number; reason: string; isActive: boolean; }
  export class HateEngine {
    private bonds: HateBond[] = [];
    form(from: string, to: string, intensity: number, reason: string): HateBond {
      emotionCore.feel(from, 'anger', intensity);
      neurotransmitter.release('norepinephrine', intensity * 0.15);
      const bond: HateBond = { from, to, intensity, reason, isActive: true };
      this.bonds.push(bond);
      logger.warn({ from, to, intensity, reason }, '[HateEngine] Hate bond formed');
      return bond;
    }
    resolve(from: string, to: string): boolean {
      const bond = this.bonds.find(b => b.from === from && b.to === to);
      if (bond) { bond.isActive = false; bond.intensity *= 0.1; return true; }
      return false;
    }
    getActiveBonds(entityId: string): HateBond[] { return this.bonds.filter(b => b.from === entityId && b.isActive); }
  }
  export const hateEngine = new HateEngine();
  export default hateEngine;