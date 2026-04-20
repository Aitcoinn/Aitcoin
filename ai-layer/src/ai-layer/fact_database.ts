import { logger } from '../lib/logger.js';
export interface Fact { id: string; statement: string; confidence: number; sources: string[]; verified: boolean; }
  export class FactDatabase {
    private facts: Fact[] = [];
    add(statement: string, sources: string[], confidence = 0.8): Fact { const f: Fact = { id: 'fact_'+Date.now(), statement, confidence, sources, verified: sources.length > 1 }; this.facts.push(f); logger.info({ statement: statement.slice(0,30), confidence }, '[FactDatabase] Added'); return f; }
    search(query: string): Fact[] { return this.facts.filter(f => f.statement.includes(query)); }
    getVerified(): Fact[] { return this.facts.filter(f => f.verified); }
  }
  export const factDatabase = new FactDatabase();
  export default factDatabase;