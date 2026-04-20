import { logger } from '../lib/logger.js';
  export class ClassificationSystem { classify(entityId: string, input: string, categories: string[]): string { return categories[Math.floor(Math.random() * categories.length)] ?? 'unknown'; } }
  export const classificationSystem = new ClassificationSystem();
  export default classificationSystem;