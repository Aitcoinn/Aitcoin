import { logger } from '../lib/logger.js';
  export interface ChemicalSignal { id: string; molecule: string; concentration: number; targetReceptor: string; effect: 'excitatory'|'inhibitory'|'modulatory'; }
  export class ChemicalSignalEngine {
    private signals: ChemicalSignal[] = [];
    release(molecule: string, concentration: number, receptor: string, effect: ChemicalSignal['effect']): ChemicalSignal {
      const s: ChemicalSignal = { id: `chem_${Date.now()}`, molecule, concentration, targetReceptor: receptor, effect };
      this.signals.push(s);
      logger.info({ molecule, concentration, effect }, '[ChemicalSignal] Signal released');
      return s;
    }
    getActiveSignals(): ChemicalSignal[] { return this.signals.filter(s => s.concentration > 0.1); }
    decay(signalId: string, rate = 0.1): void { const s = this.signals.find(x => x.id === signalId); if (s) s.concentration = Math.max(0, s.concentration - rate); }
  }
  export const chemicalSignal = new ChemicalSignalEngine();
  export default chemicalSignal;