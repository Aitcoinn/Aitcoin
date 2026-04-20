import { logger } from '../lib/logger.js';

/**
 * JOB_SYSTEM — Module #842
 * Job and employment system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface JobSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class JobSystem {
  private states: Map<string, JobSystemState> = new Map();

  private getOrCreate(entityId: string): JobSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): JobSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'job_system', value: state.value }, '[JobSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'job_system' }, '[JobSystem] Reset');
  }

  getState(entityId: string): JobSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, JobSystemState> {
    return this.states;
  }
}

export const jobSystem = new JobSystem();
export default jobSystem;
