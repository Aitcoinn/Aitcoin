import { logger } from '../lib/logger.js';
  import { chromosomeSystem } from './chromosome_system.js';
  import { alleleSystem } from './allele_system.js';

  export interface Genotype {
    entityId: string;
    geneMap: Record<string, [string, string]>;
    homozygousGenes: string[];
    heterozygousGenes: string[];
    heterozygosity: number;
  }

  export class GenotypeEngine {
    private genotypes: Map<string, Genotype> = new Map();

    buildGenotype(entityId: string, alleleMap: Record<string, [string, string]>): Genotype {
      const homozygous: string[] = [];
      const heterozygous: string[] = [];
      Object.entries(alleleMap).forEach(([gene, [a1, a2]]) => {
        if (a1 === a2) homozygous.push(gene);
        else heterozygous.push(gene);
      });
      const total = homozygous.length + heterozygous.length;
      const genotype: Genotype = {
        entityId, geneMap: alleleMap, homozygousGenes: homozygous, heterozygousGenes: heterozygous,
        heterozygosity: total > 0 ? heterozygous.length / total : 0
      };
      this.genotypes.set(entityId, genotype);
      logger.info({ entityId, heterozygosity: genotype.heterozygosity }, '[GenotypeEngine] Genotype built');
      return genotype;
    }

    isHomozygous(entityId: string, geneId: string): boolean {
      return this.genotypes.get(entityId)?.homozygousGenes.includes(geneId) ?? false;
    }

    get(entityId: string): Genotype | null { return this.genotypes.get(entityId) ?? null; }
  }

  export const genotypeEngine = new GenotypeEngine();
  export default genotypeEngine;
  