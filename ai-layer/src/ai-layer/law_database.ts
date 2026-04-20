import { logger } from '../lib/logger.js';
export interface Law { id: string; name: string; domain: string; statement: string; isEnforced: boolean; penalty: number; }
  export class LawDatabase {
    private laws: Law[] = [];
    add(name: string, domain: string, statement: string, penalty = 0.5): Law { const l: Law = { id: 'law_'+Date.now(), name, domain, statement, isEnforced: true, penalty }; this.laws.push(l); return l; }
    getByDomain(domain: string): Law[] { return this.laws.filter(l => l.domain === domain); }
    isViolation(action: string): Law | null { return this.laws.find(l => l.isEnforced && action.includes('violate_'+l.name)) ?? null; }
  }
  export const lawDatabase = new LawDatabase();
  export default lawDatabase;