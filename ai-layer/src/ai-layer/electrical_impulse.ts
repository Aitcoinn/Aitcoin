import { logger } from '../lib/logger.js';
  import { signalTransmission } from './signal_transmission.js';
  export interface Impulse { id: string; neuronId: string; voltage: number; frequency: number; duration: number; }
  export class ElectricalImpulse {
    private impulses: Impulse[] = [];
    fire(neuronId: string, voltage = 70, frequency = 40): Impulse {
      const imp: Impulse = { id: `imp_${Date.now()}`, neuronId, voltage, frequency, duration: 1000/frequency };
      this.impulses.push(imp);
      logger.info({ neuronId, voltage, frequency }, '[ElectricalImpulse] Impulse fired');
      return imp;
    }
    propagate(sourceId: string, targetId: string, voltage: number): void { signalTransmission.transmit(sourceId, targetId, voltage/100); }
    getFrequency(neuronId: string): number { const imps = this.impulses.filter(i => i.neuronId === neuronId); return imps[imps.length-1]?.frequency ?? 0; }
  }
  export const electricalImpulse = new ElectricalImpulse();
  export default electricalImpulse;