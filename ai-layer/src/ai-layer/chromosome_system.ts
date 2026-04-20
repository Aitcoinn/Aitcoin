import { logger } from '../lib/logger.js';
  import { GeneticSequence } from './genetic_code.js';

  export interface Chromosome {
    id: string;
    number: number;
    genes: GeneticSequence[];
    length: number;
    isHomologous: boolean;
  }

  export class ChromosomeSystem {
    private chromosomes: Chromosome[] = [];
    private totalPairs = 23;

    initialize(entityId: string): void {
      this.chromosomes = [];
      for (let i = 1; i <= this.totalPairs; i++) {
        this.chromosomes.push({ id: `${entityId}_chr${i}a`, number: i, genes: [], length: 100 + i * 10, isHomologous: true });
        this.chromosomes.push({ id: `${entityId}_chr${i}b`, number: i, genes: [], length: 100 + i * 10, isHomologous: true });
      }
      logger.info({ entityId, count: this.chromosomes.length }, '[ChromosomeSystem] Chromosomes initialized');
    }

    addGeneToChromosome(chrNumber: number, gene: GeneticSequence): void {
      const chr = this.chromosomes.find(c => c.number === chrNumber);
      if (chr) chr.genes.push(gene);
    }

    getChromosomePair(number: number): Chromosome[] {
      return this.chromosomes.filter(c => c.number === number);
    }

    getAllChromosomes(): Chromosome[] { return [...this.chromosomes]; }
    getCount(): number { return this.chromosomes.length; }
  }

  export const chromosomeSystem = new ChromosomeSystem();
  export default chromosomeSystem;
  