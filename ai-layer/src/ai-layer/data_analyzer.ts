import { logger } from '../lib/logger.js';
export class DataAnalyzer {
    analyze(data: number[]): { mean: number; std: number; min: number; max: number; count: number } {
      const count = data.length;
      if (count === 0) return { mean: 0, std: 0, min: 0, max: 0, count: 0 };
      const mean = data.reduce((s,v) => s+v, 0) / count;
      const std = Math.sqrt(data.reduce((s,v) => s + (v-mean)**2, 0) / count);
      return { mean, std, min: Math.min(...data), max: Math.max(...data), count };
    }
    correlate(a: number[], b: number[]): number {
      if (a.length !== b.length || a.length === 0) return 0;
      const meanA = a.reduce((s,v)=>s+v,0)/a.length, meanB = b.reduce((s,v)=>s+v,0)/b.length;
      const num = a.reduce((s,v,i)=>s+(v-meanA)*((b[i]??0)-meanB),0);
      const den = Math.sqrt(a.reduce((s,v)=>s+(v-meanA)**2,0)*b.reduce((s,v)=>s+(v-meanB)**2,0));
      return den > 0 ? num/den : 0;
    }
  }
  export const dataAnalyzer = new DataAnalyzer();
  export default dataAnalyzer;