import { logger } from '../lib/logger.js';
import { questionAsker } from './question_asker.js';
  export class ProblemFormulator {
    formulate(entityId: string, rawIssue: string): string {
      const questions = questionAsker.generateQuestions(rawIssue);
      const formulation = 'Problem: How to address '+rawIssue+'? Subquestions: '+questions.slice(0,2).join('; ');
      logger.info({ entityId, rawIssue }, '[ProblemFormulator] Formulated');
      return formulation;
    }
  }
  export const problemFormulator = new ProblemFormulator();
  export default problemFormulator;