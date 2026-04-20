import { logger } from '../lib/logger.js';

/**
 * ADDRESS_BOOK — Module #579
 * Network address book
 * Kategori: JARINGAN & KONEKSI
 */
export interface AddressBookState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AddressBook {
  private states: Map<string, AddressBookState> = new Map();

  private getOrCreate(entityId: string): AddressBookState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AddressBookState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'address_book', value: state.value }, '[AddressBook] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'address_book' }, '[AddressBook] Reset');
  }

  getState(entityId: string): AddressBookState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AddressBookState> {
    return this.states;
  }
}

export const addressBook = new AddressBook();
export default addressBook;
