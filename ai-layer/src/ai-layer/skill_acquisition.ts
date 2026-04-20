import { logger } from '../lib/logger.js';
export interface Skill { name: string; level: number; practiceHours: number; lastPracticed: number; }
  export class SkillAcquisition {
    private skills: Map<string, Map<string, Skill>> = new Map();
    practice(entityId: string, skillName: string, hours = 1): Skill {
      const skillMap = this.skills.get(entityId) ?? new Map();
      const s = skillMap.get(skillName) ?? { name: skillName, level: 0, practiceHours: 0, lastPracticed: 0 };
      s.practiceHours += hours; s.level = Math.min(10, s.practiceHours / 100); s.lastPracticed = Date.now();
      skillMap.set(skillName, s); this.skills.set(entityId, skillMap);
      logger.info({ entityId, skillName, level: s.level }, '[SkillAcquisition] Practiced');
      return s;
    }
    get(entityId: string, skillName: string): Skill | null { return this.skills.get(entityId)?.get(skillName) ?? null; }
    getAll(entityId: string): Skill[] { return [...(this.skills.get(entityId)?.values() ?? [])]; }
  }
  export const skillAcquisition = new SkillAcquisition();
  export default skillAcquisition;