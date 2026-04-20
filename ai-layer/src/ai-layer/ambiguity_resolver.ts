import { logger } from '../lib/logger.js';
  export class AmbiguityResolver { resolve(entityId: string, ambiguous: string, contexts: string[]): string { return contexts[0] ? ambiguous+'_in_context_of_'+contexts[0] : ambiguous+'_default_interpretation'; } }
  export const ambiguityResolver = new AmbiguityResolver();
  export default ambiguityResolver;