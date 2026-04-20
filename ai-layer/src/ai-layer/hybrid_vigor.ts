import { logger } from '../lib/logger.js';
  import { hybridization } from './hybridization.js';
  export interface VigorAnalysis { hybridId: string; heterosisScore: number; traitAdvantages: string[]; fitnessBenefit: number; }
  export class HybridVigor {
    private analyses: Map<string, VigorAnalysis> = new Map();
    analyze(hybridId: string): VigorAnalysis {
      const hybrids = hybridization.getViableHybrids();
      const hybrid = hybrids.find(h => h.id === hybridId);
      const heterosis = hybrid ? (hybrid.vigorIndex - 0.5) * 2 : 0;
      const a: VigorAnalysis = {
        hybridId, heterosisScore: Math.max(0, heterosis),
        traitAdvantages: heterosis > 0.3 ? ['disease_resistance', 'growth_rate', 'fertility'] : ['basic_survival'],
        fitnessBenefit: heterosis * 0.5
      };
      this.analyses.set(hybridId, a);
      logger.info({ hybridId, heterosis, fitnessBenefit: a.fitnessBenefit }, '[HybridVigor] Vigor analyzed');
      return a;
    }
    get(hybridId: string): VigorAnalysis | null { return this.analyses.get(hybridId) ?? null; }
  }
  export const hybridVigor = new HybridVigor();
  export default hybridVigor;
  