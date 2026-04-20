import { logger } from '../lib/logger.js';
  import { identityCore } from './identity_core.js';
  export interface PersonalityProfile { entityId: string; openness: number; conscientiousness: number; extraversion: number; agreeableness: number; neuroticism: number; dominantTrait: string; }
  export class PersonalitySystem {
    private profiles: Map<string, PersonalityProfile> = new Map();
    generate(entityId: string): PersonalityProfile {
      const o = Math.random(), c = Math.random(), e = Math.random(), a = Math.random(), n = Math.random();
      const traits = {openness:o, conscientiousness:c, extraversion:e, agreeableness:a, neuroticism:n};
      const dominant = Object.entries(traits).sort(([,x],[,y]) => y-x)[0][0];
      const p: PersonalityProfile = { entityId, openness:o, conscientiousness:c, extraversion:e, agreeableness:a, neuroticism:n, dominantTrait: dominant };
      this.profiles.set(entityId, p);
      logger.info({ entityId, dominant }, '[PersonalitySystem] Personality generated');
      return p;
    }
    get(entityId: string): PersonalityProfile | null { return this.profiles.get(entityId) ?? null; }
  }
  export const personalitySystem = new PersonalitySystem();
  export default personalitySystem;