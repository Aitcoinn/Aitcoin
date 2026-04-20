import { logger } from '../lib/logger.js';
  export class ContradictionHandler { resolve(premise1: string, premise2: string): string { return premise1.length > premise2.length ? premise1 : premise2; } }
  export const contradictionHandler = new ContradictionHandler();
  export default contradictionHandler;