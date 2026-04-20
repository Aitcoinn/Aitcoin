import { logger } from '../lib/logger.js';
  export class IllusionDetector { detect(input: string): boolean { const isIllusion = input.includes('appear') || input.includes('seem') || Math.random() < 0.2; return isIllusion; } }
  export const illusionDetector = new IllusionDetector();
  export default illusionDetector;