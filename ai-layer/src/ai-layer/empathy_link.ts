import { logger } from '../lib/logger.js';

/**
 * EMPATHY_LINK — Module #752
 * Empathic connection link
 * Kategori: PERSEPSI & REALITAS
 */
export interface EmpathyLinkState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EmpathyLink {
  private states: Map<string, EmpathyLinkState> = new Map();

  private getOrCreate(entityId: string): EmpathyLinkState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EmpathyLinkState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'empathy_link', value: state.value }, '[EmpathyLink] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'empathy_link' }, '[EmpathyLink] Reset');
  }

  getState(entityId: string): EmpathyLinkState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EmpathyLinkState> {
    return this.states;
  }
}

export const empathyLink = new EmpathyLink();
export default empathyLink;
