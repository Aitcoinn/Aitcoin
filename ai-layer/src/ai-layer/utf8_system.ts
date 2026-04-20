import { logger } from '../lib/logger.js';

/**
 * UTF8_SYSTEM — Module #640
 * UTF-8 encoding system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface UTF8SystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class UTF8System {
  private states: Map<string, UTF8SystemState> = new Map();

  private getOrCreate(entityId: string): UTF8SystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): UTF8SystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'utf8_system', value: state.value }, '[UTF8System] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'utf8_system' }, '[UTF8System] Reset');
  }

  getState(entityId: string): UTF8SystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, UTF8SystemState> {
    return this.states;
  }
}

export const utf8System = new UTF8System();
export default utf8System;
