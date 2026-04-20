import { logger } from '../lib/logger.js';
  import { phenotypeEngine } from './phenotype_engine.js';
  import { dnaRepair } from './dna_repair.js';
  import { harmfulMutation } from './harmful_mutation.js';
  export interface QualityAssessment { entityId: string; qualityScore: number; repairEfficiency: number; mutationBurden: number; overallGrade: 'A'|'B'|'C'|'D'|'F'; }
  export class GeneticQuality {
    assess(entityId: string): QualityAssessment {
      const phenotype = phenotypeEngine.get(entityId);
      const repairEff = dnaRepair.getEfficiency();
      const harmfulCount = harmfulMutation.getAll().filter(m => m.geneId.startsWith(entityId)).length;
      const mutBurden = Math.min(1, harmfulCount * 0.1);
      const quality = (phenotype?.fitnessScore ?? 0.5) * repairEff * (1 - mutBurden);
      const grade: QualityAssessment['overallGrade'] = quality > 0.8 ? 'A' : quality > 0.6 ? 'B' : quality > 0.4 ? 'C' : quality > 0.2 ? 'D' : 'F';
      const a: QualityAssessment = { entityId, qualityScore: quality, repairEfficiency: repairEff, mutationBurden: mutBurden, overallGrade: grade };
      logger.info({ entityId, quality, grade }, '[GeneticQuality] Quality assessed');
      return a;
    }
  }
  export const geneticQuality = new GeneticQuality();
  export default geneticQuality;
  