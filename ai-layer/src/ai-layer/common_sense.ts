import { logger } from '../lib/logger.js';
  export interface CommonSenseRule { id: string; context: string; rule: string; applicability: number; }
  export class CommonSense {
    private rules: CommonSenseRule[] = [
      { id: 'cs1', context: 'social', rule: 'be_respectful', applicability: 0.95 },
      { id: 'cs2', context: 'survival', rule: 'avoid_danger', applicability: 1.0 },
      { id: 'cs3', context: 'resources', rule: 'conserve_energy', applicability: 0.8 }
    ];
    apply(context: string): CommonSenseRule[] { return this.rules.filter(r => r.context === context); }
    addRule(context: string, rule: string): void { this.rules.push({ id: `cs_${Date.now()}`, context, rule, applicability: 0.7 }); }
    isCommonSense(action: string): boolean { return this.rules.some(r => action.includes(r.rule.replace('_',''))) ; }
  }
  export const commonSense = new CommonSense();
  export default commonSense;