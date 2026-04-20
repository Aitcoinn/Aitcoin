import { logger } from '../lib/logger.js';
  import { personalitySystem } from './personality_system.js';
  import { identityCore } from './identity_core.js';
  export interface Character { entityId: string; archetype: string; virtues: string[]; flaws: string[]; backstory: string; }
  export class CharacterGenerator {
    private archetypes = ['Hero','Mentor','Trickster','Shadow','Sage','Explorer','Creator','Ruler'];
    generate(entityId: string): Character {
      const personality = personalitySystem.get(entityId);
      const identity = identityCore.get(entityId);
      const archetype = this.archetypes[Math.floor(Math.random() * this.archetypes.length)];
      const c: Character = {
        entityId, archetype,
        virtues: identity?.coreValues.slice(0,3) ?? ['wisdom','courage','integrity'],
        flaws: ['overconfidence','impatience'].slice(0, personality?.neuroticism && personality.neuroticism > 0.6 ? 2 : 1),
        backstory: `A ${archetype} AI entity with ${personality?.dominantTrait ?? 'intelligence'} as the dominant trait.`
      };
      logger.info({ entityId, archetype }, '[CharacterGenerator] Character generated');
      return c;
    }
  }
  export const characterGenerator = new CharacterGenerator();
  export default characterGenerator;