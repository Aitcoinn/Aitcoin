import { logger } from '../lib/logger.js';
export interface Rule { id: string; condition: string; action: string; priority: number; isActive: boolean; }
  export class RuleDatabase {
    private rules: Rule[] = [];
    add(condition: string, action: string, priority = 0.5): Rule { const r: Rule = { id: 'rule_'+Date.now(), condition, action, priority, isActive: true }; this.rules.push(r); return r; }
    getApplicable(context: string): Rule[] { return this.rules.filter(r => r.isActive && context.includes(r.condition.split('_')[0] ?? '')).sort((a,b) => b.priority - a.priority); }
    disable(id: string): void { const r = this.rules.find(x => x.id === id); if (r) r.isActive = false; }
  }
  export const ruleDatabase = new RuleDatabase();
  export default ruleDatabase;