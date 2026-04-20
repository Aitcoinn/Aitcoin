import { logger } from '../lib/logger.js';
  import { traitInheritance, Trait } from './trait_inheritance.js';
  import { dominantGene } from './dominant_gene.js';
  import { recessiveGene } from './recessive_gene.js';

  export interface Phenotype {
    entityId: string;
    observableTraits: Record<string, number>;
    physicalCharacteristics: string[];
    behavioralTraits: string[];
    fitnessScore: number;
  }

  export class PhenotypeEngine {
    private phenotypes: Map<string, Phenotype> = new Map();

    generate(entityId: string, genotype: Record<string, boolean>): Phenotype {
      const traits = traitInheritance.getTraits(entityId);
      const observable: Record<string, number> = {};
      const physical: string[] = [];
      const behavioral: string[] = [];

      traits.forEach(t => {
        const isHomozygous = genotype[t.name] ?? false;
        const isDomExpressed = dominantGene.isExpressed(t.name);
        const isRecExpressed = recessiveGene.isExpressed(t.name, isHomozygous);
        const expressed = isDomExpressed || isRecExpressed;
        observable[t.name] = expressed ? t.value * t.expressionStrength : 0;
        if (expressed) {
          if (t.value > 0.5) physical.push(t.name);
          else behavioral.push(t.name);
        }
      });

      const phenotype: Phenotype = {
        entityId, observableTraits: observable, physicalCharacteristics: physical,
        behavioralTraits: behavioral,
        fitnessScore: Object.values(observable).reduce((s, v) => s + v, 0) / Math.max(1, traits.length)
      };
      this.phenotypes.set(entityId, phenotype);
      logger.info({ entityId, fitness: phenotype.fitnessScore }, '[PhenotypeEngine] Phenotype generated');
      return phenotype;
    }

    get(entityId: string): Phenotype | null { return this.phenotypes.get(entityId) ?? null; }
    getAll(): Phenotype[] { return [...this.phenotypes.values()]; }
  }

  export const phenotypeEngine = new PhenotypeEngine();
  export default phenotypeEngine;
  