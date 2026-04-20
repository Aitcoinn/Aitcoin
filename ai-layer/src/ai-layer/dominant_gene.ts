import { logger } from '../lib/logger.js';
  import { alleleSystem, Allele } from './allele_system.js';

  export interface DominantGene {
    id: string;
    geneId: string;
    dominantTrait: string;
    maskedTraits: string[];
    penetrance: number;
  }

  export class DominantGeneEngine {
    private dominantGenes: DominantGene[] = [];

    register(geneId: string, trait: string, maskedTraits: string[], penetrance = 1.0): DominantGene {
      const gene: DominantGene = {
        id: `dg_${Date.now()}`,
        geneId, dominantTrait: trait, maskedTraits,
        penetrance: Math.min(1, Math.max(0, penetrance))
      };
      this.dominantGenes.push(gene);
      alleleSystem.registerAllele(geneId, {
        id: gene.id, geneId, variant: trait,
        type: 'dominant', expressionStrength: penetrance, trait
      });
      logger.info({ geneId, trait, penetrance }, '[DominantGene] Dominant gene registered');
      return gene;
    }

    isExpressed(geneId: string): boolean {
      const gene = this.dominantGenes.find(g => g.geneId === geneId);
      return gene ? Math.random() < gene.penetrance : false;
    }

    getAll(): DominantGene[] { return [...this.dominantGenes]; }
  }

  export const dominantGene = new DominantGeneEngine();
  export default dominantGene;
  