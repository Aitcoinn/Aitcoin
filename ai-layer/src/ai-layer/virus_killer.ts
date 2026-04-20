import { logger } from '../lib/logger.js';

/**
 * VIRUS_KILLER — Module #456
 * Virus elimination system
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface VirusKillerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class VirusKiller {
  private states: Map<string, VirusKillerState> = new Map();

  private getOrCreate(entityId: string): VirusKillerState {
    if (!this.states.has(entityId)) {
      this.states.set(entityId, {
        entityId,
        active: false,
        value: 0,
        data: {},
        updatedAt: Date.now(),
      });
    }
    return this.states.get(entityId)!;
  }

  execute(entityId: string, input: Record<string, unknown> = {}): VirusKillerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'virus_killer', value: state.value }, '[VirusKiller] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'virus_killer' }, '[VirusKiller] Reset');
  }

  getState(entityId: string): VirusKillerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, VirusKillerState> {
    return this.states;
  }
}

export const virusKiller = new VirusKiller();
export default virusKiller;
