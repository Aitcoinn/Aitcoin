import { logger } from '../lib/logger.js';
export class WorkingMemory {
    private workspaces: Map<string, Record<string, any>> = new Map();
    set(entityId: string, key: string, value: any): void { const ws = this.workspaces.get(entityId) ?? {}; ws[key] = value; this.workspaces.set(entityId, ws); }
    get_item(entityId: string, key: string): any { return this.workspaces.get(entityId)?.[key]; }
    clear(entityId: string): void { this.workspaces.set(entityId, {}); }
    getWorkspace(entityId: string): Record<string, any> { return { ...this.workspaces.get(entityId) }; }
  }
  export const workingMemory = new WorkingMemory();
  export default workingMemory;