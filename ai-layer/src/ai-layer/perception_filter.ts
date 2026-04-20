import { logger } from '../lib/logger.js';
  export class PerceptionFilter { filter(rawInput: string, biases: string[]): string { return biases.reduce((acc, b) => acc.replace(b, ''), rawInput); } }
  export const perceptionFilter = new PerceptionFilter();
  export default perceptionFilter;