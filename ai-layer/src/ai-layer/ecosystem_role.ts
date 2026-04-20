import { logger } from '../lib/logger.js';
  import { speciesCore } from './species_core.js';
  export type EcologicalRole = 'apex_predator'|'primary_producer'|'decomposer'|'herbivore'|'omnivore'|'filter_feeder';
  export interface EcosystemRole { speciesId: string; role: EcologicalRole; trophicLevel: number; ecosystemImpact: number; }
  export class EcosystemRoleEngine {
    private roles: Map<string, EcosystemRole> = new Map();
    assign(speciesId: string, role: EcologicalRole): EcosystemRole {
      const trophicMap: Record<EcologicalRole, number> = { primary_producer:1, filter_feeder:2, herbivore:2, decomposer:1, omnivore:3, apex_predator:4 };
      const r: EcosystemRole = { speciesId, role, trophicLevel: trophicMap[role], ecosystemImpact: trophicMap[role] * 0.2 };
      this.roles.set(speciesId, r);
      logger.info({ speciesId, role, trophicLevel: r.trophicLevel }, '[EcosystemRole] Role assigned');
      return r;
    }
    get(speciesId: string): EcosystemRole | null { return this.roles.get(speciesId) ?? null; }
    getByRole(role: EcologicalRole): EcosystemRole[] { return [...this.roles.values()].filter(r => r.role === role); }
  }
  export const ecosystemRole = new EcosystemRoleEngine();
  export default ecosystemRole;
  