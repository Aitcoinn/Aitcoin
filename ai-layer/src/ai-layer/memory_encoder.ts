import { logger } from '../lib/logger.js';
export class MemoryEncoder {
    encode(data: string, encoding: 'visual'|'verbal'|'semantic' = 'semantic'): string { return encoding+'_encoded:'+Buffer.from(data).toString('base64').slice(0,20); }
    decode(encoded: string): string { const [,b64] = encoded.split(':'); try { return Buffer.from(b64 ?? '', 'base64').toString('utf8'); } catch { return 'decoded_'+encoded; } }
  }
  export const memoryEncoder = new MemoryEncoder();
  export default memoryEncoder;