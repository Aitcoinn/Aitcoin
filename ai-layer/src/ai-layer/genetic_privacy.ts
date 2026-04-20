import { logger } from '../lib/logger.js';
  import { dnaEncryption } from './dna_encryption.js';
  export interface PrivacyPolicy { entityId: string; accessLevel: 'private'|'shared'|'public'; authorizedAccessors: string[]; isAnonymized: boolean; }
  export class GeneticPrivacy {
    private policies: Map<string, PrivacyPolicy> = new Map();
    setPolicy(entityId: string, level: PrivacyPolicy['accessLevel'], authorized: string[] = []): PrivacyPolicy {
      dnaEncryption.encrypt(entityId, `genetic_data_${entityId}`);
      const p: PrivacyPolicy = { entityId, accessLevel: level, authorizedAccessors: authorized, isAnonymized: level === 'public' };
      this.policies.set(entityId, p);
      logger.info({ entityId, level }, '[GeneticPrivacy] Policy set');
      return p;
    }
    canAccess(requesterId: string, targetEntityId: string): boolean {
      const policy = this.policies.get(targetEntityId);
      if (!policy) return false;
      if (policy.accessLevel === 'public') return true;
      if (policy.accessLevel === 'shared') return policy.authorizedAccessors.includes(requesterId);
      return false;
    }
    get(entityId: string): PrivacyPolicy | null { return this.policies.get(entityId) ?? null; }
  }
  export const geneticPrivacy = new GeneticPrivacy();
  export default geneticPrivacy;
  