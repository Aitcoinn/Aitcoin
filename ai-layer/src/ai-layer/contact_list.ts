import { logger } from '../lib/logger.js';

/**
 * CONTACT_LIST — Module #580
 * Contact list management
 * Kategori: JARINGAN & KONEKSI
 */
export interface ContactListState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ContactList {
  private states: Map<string, ContactListState> = new Map();

  private getOrCreate(entityId: string): ContactListState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ContactListState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'contact_list', value: state.value }, '[ContactList] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'contact_list' }, '[ContactList] Reset');
  }

  getState(entityId: string): ContactListState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ContactListState> {
    return this.states;
  }
}

export const contactList = new ContactList();
export default contactList;
