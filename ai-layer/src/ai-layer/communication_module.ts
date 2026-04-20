import { logger } from '../lib/logger.js';
import { languageSystem } from './language_system.js';
  export interface Message { from: string; to: string; content: string; language: string; sent: number; }
  export class CommunicationModule {
    private messages: Message[] = [];
    send(from: string, to: string, content: string, language = 'english'): Message {
      const proficiency = languageSystem.getProficiency(language);
      const actualContent = proficiency > 0.5 ? content : languageSystem.translate(content, 'unknown', language);
      const m: Message = { from, to, content: actualContent, language, sent: Date.now() };
      this.messages.push(m);
      logger.info({ from, to, language }, '[CommunicationModule] Message sent');
      return m;
    }
    getConversation(e1: string, e2: string): Message[] { return this.messages.filter(m => (m.from === e1 && m.to === e2) || (m.from === e2 && m.to === e1)); }
  }
  export const communicationModule = new CommunicationModule();
  export default communicationModule;