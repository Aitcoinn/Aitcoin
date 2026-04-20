import { logger } from '../lib/logger.js';
export class InformationProcessor {
    process(raw: string, format: 'text'|'numeric'|'structured' = 'text'): any {
      if (format === 'numeric') return parseFloat(raw) || 0;
      if (format === 'structured') return { data: raw, processedAt: Date.now() };
      return raw.trim().toLowerCase().replace(/[^a-z0-9_s]/g, '');
    }
    batch(items: string[], format: 'text'|'numeric'|'structured' = 'text'): any[] { return items.map(item => this.process(item, format)); }
  }
  export const informationProcessor = new InformationProcessor();
  export default informationProcessor;