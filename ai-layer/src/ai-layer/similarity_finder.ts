import { logger } from '../lib/logger.js';
  export class SimilarityFinder { findSimilarity(a: string, b: string): number { const common = a.split('').filter(c => b.includes(c)).length; return common / Math.max(a.length, b.length); } }
  export const similarityFinder = new SimilarityFinder();
  export default similarityFinder;