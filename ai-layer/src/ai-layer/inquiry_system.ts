import { logger } from '../lib/logger.js';
import { questionAsker } from './question_asker.js';
  import { answerFinder } from './answer_finder.js';
  export interface Inquiry { entityId: string; question: string; answer: string; satisfactionScore: number; }
  export class InquirySystem {
    private inquiries: Inquiry[] = [];
    inquire(entityId: string, question: string): Inquiry {
      questionAsker.ask(entityId, question);
      const answer = answerFinder.find(question);
      const i: Inquiry = { entityId, question, answer, satisfactionScore: answer.length > 20 ? 0.8 : 0.3 };
      this.inquiries.push(i);
      logger.info({ entityId, question, satisfactionScore: i.satisfactionScore }, '[InquirySystem] Inquired');
      return i;
    }
    getInquiries(entityId: string): Inquiry[] { return this.inquiries.filter(i => i.entityId === entityId); }
  }
  export const inquirySystem = new InquirySystem();
  export default inquirySystem;