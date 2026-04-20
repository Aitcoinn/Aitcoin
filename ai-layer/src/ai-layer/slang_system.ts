import { logger } from '../lib/logger.js';

/**
 * SLANG_SYSTEM — Module #613
 * Slang and informal language system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SlangSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SlangSystem {
  private states: Map<string, SlangSystemState> = new Map();

  private getOrCreate(entityId: string): SlangSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SlangSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'slang_system', value: state.value }, '[SlangSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'slang_system' }, '[SlangSystem] Reset');
  }

  getState(entityId: string): SlangSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SlangSystemState> {
    return this.states;
  }
}

export const slangSystem = new SlangSystem();
export default slangSystem;
