import { logger } from '../lib/logger.js';

/**
 * PATCH_SERVER — Module #556
 * Patch distribution server
 * Kategori: JARINGAN & KONEKSI
 */
export interface PatchServerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PatchServer {
  private states: Map<string, PatchServerState> = new Map();

  private getOrCreate(entityId: string): PatchServerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PatchServerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'patch_server', value: state.value }, '[PatchServer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'patch_server' }, '[PatchServer] Reset');
  }

  getState(entityId: string): PatchServerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PatchServerState> {
    return this.states;
  }
}

export const patchServer = new PatchServer();
export default patchServer;
