import { logger } from '../lib/logger.js';
  import { chromosomeSystem } from './chromosome_system.js';

  export type AlleleType = 'dominant' | 'recessive' | 'codominant' | 'incomplete';

  export interface Allele {
    id: string;
    geneId: string;
    variant: string;
    type: AlleleType;
    expressionStrength: number;
    trait: string;
  }

  export class AlleleSystem {
    private alleles: Map<string, Allele[]> = new Map();

    registerAllele(geneId: string, allele: Allele): void {
      const existing = this.alleles.get(geneId) ?? [];
      existing.push(allele);
      this.alleles.set(geneId, existing);
      logger.info({ geneId, alleleId: allele.id, type: allele.type }, '[AlleleSystem] Allele registered');
    }

    getExpressedAllele(geneId: string): Allele | null {
      const alleles = this.alleles.get(geneId) ?? [];
      const dominant = alleles.find(a => a.type === 'dominant');
      if (dominant) return dominant;
      return alleles[0] ?? null;
    }

    getDominantAlleles(): Allele[] {
      const result: Allele[] = [];
      this.alleles.forEach(list => {
        const d = list.find(a => a.type === 'dominant');
        if (d) result.push(d);
      });
      return result;
    }

    getRecessiveAlleles(): Allele[] {
      const result: Allele[] = [];
      this.alleles.forEach(list => result.push(...list.filter(a => a.type === 'recessive')));
      return result;
    }

    getAllAlleles(): Map<string, Allele[]> { return new Map(this.alleles); }
  }

  export const alleleSystem = new AlleleSystem();
  export default alleleSystem;
  