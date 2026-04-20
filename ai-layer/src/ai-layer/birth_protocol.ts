import { logger } from '../lib/logger.js';
  import { offspringGenerator, OffspringData } from './offspring_generator.js';

  export interface BirthRecord { id: string; entityId: string; birthType: 'live' | 'spawned' | 'hatched'; viability: number; timestamp: number; }
  export class BirthProtocol {
    private records: BirthRecord[] = [];
    record(offspring: OffspringData): BirthRecord {
      const r: BirthRecord = { id: `birth_${Date.now()}`, entityId: offspring.id, birthType: offspring.reproductionType === 'sexual' ? 'live' : 'spawned', viability: offspring.viability, timestamp: Date.now() };
      this.records.push(r);
      logger.info({ entityId: offspring.id, type: r.birthType, viability: r.viability }, '[BirthProtocol] Birth recorded');
      return r;
    }
    getRecords(): BirthRecord[] { return [...this.records]; }
  }
  export const birthProtocol = new BirthProtocol();
  export default birthProtocol;
  