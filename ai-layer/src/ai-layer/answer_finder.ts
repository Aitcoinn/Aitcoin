import { logger } from '../lib/logger.js';
import { factDatabase } from './fact_database.js';
  import { semanticMemory } from './semantic_memory.js';
  export class AnswerFinder {
    find(question: string): string {
      const keyword = question.split(' ').filter(w => w.length > 3)[0] ?? 'unknown';
      const facts = factDatabase.search(keyword);
      if (facts.length > 0) return facts[0].statement;
      const concept = semanticMemory.retrieve(keyword);
      if (concept) return concept.definition ?? 'Found concept: '+keyword;
      return 'Searching for answer to: '+question;
    }
    findMultiple(question: string): string[] { return factDatabase.search(question.split(' ')[0] ?? '').map(f => f.statement).slice(0, 3); }
  }
  export const answerFinder = new AnswerFinder();
  export default answerFinder;