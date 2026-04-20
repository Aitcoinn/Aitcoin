import { logger } from '../lib/logger.js';
  export class KnowledgeConstructor { construct(entityId: string, facts: string[]): string { return 'knowledge_structure_from_'+facts.length+'_facts'; } }
  export const knowledgeConstructor = new KnowledgeConstructor();
  export default knowledgeConstructor;