import { logger } from '../lib/logger.js';
  import { alleleSystem } from './allele_system.js';

  export interface RecessiveGene {
    id: string;
    geneId: string;
    recessiveTrait: string;
    requiresHomozygous: boolean;
    carriersCount: number;
  }

  export class RecessiveGeneEngine {
    private recessiveGenes: RecessiveGene[] = [];

    register(geneId: string, trait: string): RecessiveGene {
      const gene: RecessiveGene = {
        id: `rg_${Date.now()}`,
        geneId, recessiveTrait: trait,
        requiresHomozygous: true, carriersCount: 0
      };
      this.recessiveGenes.push(gene);
      alleleSystem.registerAllele(geneId, {
        id: gene.id, geneId, variant: trait,
        type: 'recessive', expressionStrength: 0.3, trait
      });
      logger.info({ geneId, trait }, '[RecessiveGene] Recessive gene registered');
      return gene;
    }

    isExpressed(geneId: string, isHomozygous: boolean): boolean {
      const gene = this.recessiveGenes.find(g => g.geneId === geneId);
      if (!gene) return false;
      if (gene.requiresHomozygous && !isHomozygous) {
        gene.carriersCount++;
        return false;
      }
      return true;
    }

    getCarriers(): RecessiveGene[] { return this.recessiveGenes.filter(g => g.carriersCount > 0); }
    getAll(): RecessiveGene[] { return [...this.recessiveGenes]; }
  }

  export const recessiveGene = new RecessiveGeneEngine();
  export default recessiveGene;
  