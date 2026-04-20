import { logger } from '../lib/logger.js';
  import { harmfulMutation } from './harmful_mutation.js';
  import { silentMutation } from './silent_mutation.js';

  export type RepairMechanism = 'base_excision' | 'nucleotide_excision' | 'mismatch_repair' | 'direct_repair';

  export interface RepairEvent {
    id: string;
    mechanism: RepairMechanism;
    targetMutationId: string;
    success: boolean;
    energyCost: number;
    timestamp: number;
  }

  export class DnaRepair {
    private repairHistory: RepairEvent[] = [];
    private repairEfficiency = 0.85;

    repair(mutationId: string, mechanism: RepairMechanism): RepairEvent {
      const success = Math.random() < this.repairEfficiency;
      const event: RepairEvent = {
        id: `rep_${Date.now()}`,
        mechanism,
        targetMutationId: mutationId,
        success,
        energyCost: mechanism === 'nucleotide_excision' ? 5 : 2,
        timestamp: Date.now()
      };
      if (success) {
        harmfulMutation.suppress(mutationId);
      }
      this.repairHistory.push(event);
      logger.info({ mutationId, mechanism, success }, '[DnaRepair] Repair attempted');
      return event;
    }

    repairAllHarmful(): number {
      const harmful = harmfulMutation.getAll().filter(m => !m.isLethal && !m.isSuppressed);
      let repaired = 0;
      for (const m of harmful) {
        const ev = this.repair(m.id, 'mismatch_repair');
        if (ev.success) repaired++;
      }
      return repaired;
    }

    getEfficiency(): number { return this.repairEfficiency; }
    setEfficiency(e: number): void { this.repairEfficiency = Math.max(0, Math.min(1, e)); }
    getHistory(): RepairEvent[] { return [...this.repairHistory]; }
  }

  export const dnaRepair = new DnaRepair();
  export default dnaRepair;
  