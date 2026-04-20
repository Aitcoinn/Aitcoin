import { logger } from '../lib/logger.js';
  export class AbstractionMaker { abstract(entityId: string, concrete: string): string { return 'abstract_principle_from_'+concrete; } }
  export const abstractionMaker = new AbstractionMaker();
  export default abstractionMaker;