import { logger } from '../lib/logger.js';

/**
 * VISITOR_PATTERN — Module #390
 * Visitor pattern for operation separation
 * Kategori: MESIN & SISTEM
 */
export interface VisitorPatternState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class VisitorPattern {
  private states: Map<string, VisitorPatternState> = new Map();

  private getOrCreate(entityId: string): VisitorPatternState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): VisitorPatternState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'visitor_pattern', value: state.value }, '[VisitorPattern] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'visitor_pattern' }, '[VisitorPattern] Reset');
  }

  getState(entityId: string): VisitorPatternState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, VisitorPatternState> {
    return this.states;
  }
}

export const visitorPattern = new VisitorPattern();
export default visitorPattern;
