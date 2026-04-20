import { logger } from '../lib/logger.js';

  export interface GeneticSequence {
    id: string;
    codons: string[];
    aminoAcids: string[];
    protein: string;
    functionType: 'structural' | 'regulatory' | 'signaling' | 'metabolic';
  }

  export interface GeneticCodeState {
    sequences: GeneticSequence[];
    totalGenes: number;
    activeGenes: number;
    mutationRate: number;
  }

  export class GeneticCode {
    private state: GeneticCodeState = {
      sequences: [], totalGenes: 0, activeGenes: 0, mutationRate: 0.001
    };

    encodeSequence(id: string, data: string): GeneticSequence {
      const codons = this.splitToCodons(data);
      const seq: GeneticSequence = {
        id, codons,
        aminoAcids: codons.map(c => this.translateCodon(c)),
        protein: id + '_protein',
        functionType: 'structural'
      };
      this.state.sequences.push(seq);
      this.state.totalGenes++;
      this.state.activeGenes++;
      logger.info({ seqId: id }, '[GeneticCode] Sequence encoded');
      return seq;
    }

    private splitToCodons(data: string): string[] {
      const chunks: string[] = [];
      for (let i = 0; i < Math.min(data.length, 30); i += 3) {
        chunks.push(data.slice(i, i + 3).padEnd(3, 'A'));
      }
      return chunks;
    }

    private translateCodon(codon: string): string {
      const map: Record<string, string> = { ATG:'Met', TAA:'Stop', GCG:'Ala', CGT:'Arg' };
      return map[codon] ?? 'Unknown';
    }

    getState(): GeneticCodeState { return { ...this.state }; }
    getMutationRate(): number { return this.state.mutationRate; }
    setMutationRate(rate: number): void { this.state.mutationRate = Math.max(0, Math.min(1, rate)); }
  }

  export const geneticCode = new GeneticCode();
  export default geneticCode;
  