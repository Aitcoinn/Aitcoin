import { logger } from '../lib/logger.js';
  import { alleleSystem, Allele } from './allele_system.js';

  export interface HeredityRule {
    traitName: string;
    pattern: 'mendelian' | 'polygenic' | 'sex_linked' | 'mitochondrial';
    dominanceRatio: number;
  }

  export interface HeritageRecord {
    entityId: string;
    parent1Id: string;
    parent2Id: string;
    inheritedTraits: string[];
    timestamp: number;
  }

  export class HereditySystem {
    private rules: Map<string, HeredityRule> = new Map();
    private records: HeritageRecord[] = [];

    addRule(rule: HeredityRule): void {
      this.rules.set(rule.traitName, rule);
    }

    inherit(entityId: string, parent1Id: string, parent2Id: string, traits: string[]): HeritageRecord {
      const record: HeritageRecord = {
        entityId, parent1Id, parent2Id,
        inheritedTraits: traits.filter(t => {
          const rule = this.rules.get(t);
          return !rule || Math.random() < rule.dominanceRatio;
        }),
        timestamp: Date.now()
      };
      this.records.push(record);
      logger.info({ entityId, traitCount: record.inheritedTraits.length }, '[HereditySystem] Traits inherited');
      return record;
    }

    getRecords(): HeritageRecord[] { return [...this.records]; }
    getRules(): Map<string, HeredityRule> { return new Map(this.rules); }
  }

  export const hereditySystem = new HereditySystem();
  export default hereditySystem;
  