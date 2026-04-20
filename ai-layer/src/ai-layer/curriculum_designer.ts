import { logger } from '../lib/logger.js';
export interface Curriculum { id: string; name: string; modules: string[]; difficulty: number; duration: number; }
  export class CurriculumDesigner {
    private curricula: Curriculum[] = [];
    design(name: string, modules: string[], difficulty = 0.5): Curriculum {
      const c: Curriculum = { id: 'curr_'+Date.now(), name, modules, difficulty, duration: modules.length * 10 };
      this.curricula.push(c);
      logger.info({ name, modules: modules.length, difficulty }, '[CurriculumDesigner] Designed');
      return c;
    }
    get(name: string): Curriculum | null { return this.curricula.find(c => c.name === name) ?? null; }
  }
  export const curriculumDesigner = new CurriculumDesigner();
  export default curriculumDesigner;