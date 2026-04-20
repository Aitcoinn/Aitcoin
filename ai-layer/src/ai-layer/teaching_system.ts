import { logger } from '../lib/logger.js';
import { learningCore } from './learning_core.js';
  export class TeachingSystem {
    private teachings: Array<{teacherId: string; studentId: string; subject: string; timestamp: number}> = [];
    teach(teacherId: string, studentId: string, subject: string): void {
      learningCore.learn(studentId, subject, 'guided');
      this.teachings.push({ teacherId, studentId, subject, timestamp: Date.now() });
      logger.info({ teacherId, studentId, subject }, '[TeachingSystem] Teaching occurred');
    }
    getStudents(teacherId: string): string[] { return [...new Set(this.teachings.filter(t => t.teacherId === teacherId).map(t => t.studentId))]; }
  }
  export const teachingSystem = new TeachingSystem();
  export default teachingSystem;