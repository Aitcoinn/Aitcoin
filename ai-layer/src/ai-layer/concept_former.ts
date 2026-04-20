import { logger } from '../lib/logger.js';
  export class ConceptFormer { form(entityId: string, instances: string[]): string { const concept = 'concept_from_'+instances.slice(0,3).join('_'); logger.info({ entityId, concept }, '[ConceptFormer] Formed'); return concept; } }
  export const conceptFormer = new ConceptFormer();
  export default conceptFormer;