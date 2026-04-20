import { logger } from '../lib/logger.js';
  import { egoSystem } from './ego_system.js';
  export interface IdentityCore { entityId: string; coreValues: string[]; identityStrength: number; isStable: boolean; roles: string[]; }
  export class IdentityCoreEngine {
    private identities: Map<string, IdentityCore> = new Map();
    establish(entityId: string, values: string[], roles: string[]): IdentityCore {
      egoSystem.form(entityId, values);
      const i: IdentityCore = { entityId, coreValues: values, identityStrength: 0.7, isStable: true, roles };
      this.identities.set(entityId, i);
      logger.info({ entityId, values: values.length, roles: roles.length }, '[IdentityCore] Identity established');
      return i;
    }
    challenge(entityId: string): void { const i = this.identities.get(entityId); if (i) { i.identityStrength = Math.max(0, i.identityStrength - 0.1); i.isStable = i.identityStrength > 0.5; } }
    get(entityId: string): IdentityCore | null { return this.identities.get(entityId) ?? null; }
  }
  export const identityCore = new IdentityCoreEngine();
  export default identityCore;