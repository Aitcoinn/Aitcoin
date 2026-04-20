import { logger } from '../lib/logger.js';
export interface Research { id: string; entityId: string; topic: string; hypothesis: string; findings: string[]; conclusions: string; status: 'ongoing'|'complete'; }
  export class ResearchSystem {
    private researches: Research[] = [];
    begin(entityId: string, topic: string, hypothesis: string): Research {
      const r: Research = { id: 'res_'+Date.now(), entityId, topic, hypothesis, findings: [], conclusions: '', status: 'ongoing' };
      this.researches.push(r);
      logger.info({ entityId, topic }, '[ResearchSystem] Research started');
      return r;
    }
    addFinding(id: string, finding: string): void { const r = this.researches.find(x => x.id === id); if (r) r.findings.push(finding); }
    conclude(id: string): void {
      const r = this.researches.find(x => x.id === id);
      if (r) { r.conclusions = 'Conclusion based on '+r.findings.length+' findings: '+r.findings.slice(0,2).join(', '); r.status = 'complete'; logger.info({ id, conclusions: r.conclusions }, '[ResearchSystem] Concluded'); }
    }
    getOngoing(entityId: string): Research[] { return this.researches.filter(r => r.entityId === entityId && r.status === 'ongoing'); }
  }
  export const researchSystem = new ResearchSystem();
  export default researchSystem;