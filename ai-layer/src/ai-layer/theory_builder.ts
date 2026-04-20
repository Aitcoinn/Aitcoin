import { logger } from '../lib/logger.js';
  export class TheoryBuilder { build(entityId: string, observations: string[]): string { return 'theory_explaining_'+observations.length+'_observations'; } }
  export const theoryBuilder = new TheoryBuilder();
  export default theoryBuilder;