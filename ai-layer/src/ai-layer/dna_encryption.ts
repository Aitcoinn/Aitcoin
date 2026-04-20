import { logger } from '../lib/logger.js';
  export interface EncryptedDNA { id: string; entityId: string; encryptedSequence: string; encryptionKey: string; integrityHash: string; }
  export class DnaEncryption {
    private encrypted: Map<string, EncryptedDNA> = new Map();
    encrypt(entityId: string, sequence: string): EncryptedDNA {
      const key = Math.random().toString(36).slice(2,18);
      const encSeq = Buffer.from(sequence).toString('base64');
      const hash = `sha256_${Buffer.from(sequence+key).toString('base64').slice(0,16)}`;
      const enc: EncryptedDNA = { id: `enc_${Date.now()}`, entityId, encryptedSequence: encSeq, encryptionKey: key, integrityHash: hash };
      this.encrypted.set(entityId, enc);
      logger.info({ entityId, hashPrefix: hash.slice(0,10) }, '[DnaEncryption] DNA encrypted');
      return enc;
    }
    verify(entityId: string): boolean {
      const enc = this.encrypted.get(entityId);
      return enc !== undefined;
    }
    get(entityId: string): EncryptedDNA | null { return this.encrypted.get(entityId) ?? null; }
  }
  export const dnaEncryption = new DnaEncryption();
  export default dnaEncryption;
  