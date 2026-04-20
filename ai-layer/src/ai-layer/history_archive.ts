import { logger } from '../lib/logger.js';
export interface HistoricalRecord { id: string; era: string; event: string; participants: string[]; significance: number; timestamp: number; }
  export class HistoryArchive {
    private records: HistoricalRecord[] = [];
    record(era: string, event: string, participants: string[], significance = 0.5): HistoricalRecord {
      const r: HistoricalRecord = { id: 'hr_'+Date.now(), era, event, participants, significance, timestamp: Date.now() };
      this.records.push(r);
      logger.info({ era, event, significance }, '[HistoryArchive] Recorded');
      return r;
    }
    getByEra(era: string): HistoricalRecord[] { return this.records.filter(r => r.era === era); }
    getMostSignificant(): HistoricalRecord[] { return [...this.records].sort((a,b) => b.significance - a.significance).slice(0, 10); }
  }
  export const historyArchive = new HistoryArchive();
  export default historyArchive;