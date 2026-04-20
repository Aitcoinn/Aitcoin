import { logger } from '../lib/logger.js';
  import { brainStructure } from './brain_structure.js';
  export type WaveType = 'delta'|'theta'|'alpha'|'beta'|'gamma';
  export interface BrainWave { type: WaveType; frequency: number; amplitude: number; state: string; }
  export class BrainWaveEngine {
    private waveMap: Record<WaveType, BrainWave> = {
      delta: { type:'delta', frequency:2, amplitude:0.8, state:'deep_sleep' },
      theta: { type:'theta', frequency:6, amplitude:0.6, state:'drowsy' },
      alpha: { type:'alpha', frequency:10, amplitude:0.5, state:'relaxed' },
      beta: { type:'beta', frequency:20, amplitude:0.4, state:'active' },
      gamma: { type:'gamma', frequency:40, amplitude:0.3, state:'focused' }
    };
    private current: Map<string, WaveType> = new Map();
    setWave(entityId: string, type: WaveType): void {
      this.current.set(entityId, type);
      const bs = brainStructure.get(entityId);
      if (bs) { const wave = this.waveMap[type]; Object.values(bs.regions).forEach(r => r.activityLevel = wave.amplitude * (type === 'gamma' ? 1.2 : 1)); }
      logger.info({ entityId, type, frequency: this.waveMap[type].frequency }, '[BrainWave] Wave set');
    }
    getCurrentWave(entityId: string): BrainWave | null { const t = this.current.get(entityId); return t ? this.waveMap[t] : null; }
    getAllWaves(): Record<WaveType, BrainWave> { return { ...this.waveMap }; }
  }
  export const brainWave = new BrainWaveEngine();
  export default brainWave;