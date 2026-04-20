import { logger } from '../lib/logger.js';
import { curiosityEngine } from './curiosity_engine.js';
  export class QuestionAsker {
    private questions: Map<string, string[]> = new Map();
    ask(entityId: string, question: string): string {
      curiosityEngine.becomeCurious(entityId, question.split(' ')[1] ?? 'topic');
      const existing = this.questions.get(entityId) ?? [];
      existing.push(question); this.questions.set(entityId, existing);
      logger.info({ entityId, question }, '[QuestionAsker] Asked');
      return 'Inquiry: '+question;
    }
    getQuestions(entityId: string): string[] { return this.questions.get(entityId) ?? []; }
    generateQuestions(topic: string): string[] { return ['What is '+topic+'?', 'How does '+topic+' work?', 'Why is '+topic+' important?', 'When did '+topic+' emerge?']; }
  }
  export const questionAsker = new QuestionAsker();
  export default questionAsker;