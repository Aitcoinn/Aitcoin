import { logger } from '../lib/logger.js';
  export class UnderstandingGenerator { generate(entityId: string, input: string): string { logger.info({ entityId, input: input.slice(0,30) }, '[UnderstandingGenerator] Generated'); return 'deep_understanding_of_'+input; } }
  export const understandingGenerator = new UnderstandingGenerator();
  export default understandingGenerator;