import { logger } from '../lib/logger.js';

/**
 * SECURE_PIPE — Module #569
 * Secure data pipe
 * Kategori: JARINGAN & KONEKSI
 */
export interface SecurePipeState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SecurePipe {
  private states: Map<string, SecurePipeState> = new Map();

  private getOrCreate(entityId: string): SecurePipeState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SecurePipeState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'secure_pipe', value: state.value }, '[SecurePipe] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'secure_pipe' }, '[SecurePipe] Reset');
  }

  getState(entityId: string): SecurePipeState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SecurePipeState> {
    return this.states;
  }
}

export const securePipe = new SecurePipe();
export default securePipe;
