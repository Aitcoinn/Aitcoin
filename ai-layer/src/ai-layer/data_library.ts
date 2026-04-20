import { logger } from '../lib/logger.js';
export class DataLibrary {
    private library: Map<string, any> = new Map();
    add(key: string, data: any, tags: string[] = []): void { this.library.set(key, { data, tags, addedAt: Date.now() }); logger.info({ key, tags }, '[DataLibrary] Added'); }
    get(key: string): any { return this.library.get(key)?.data; }
    search(tag: string): string[] { return [...this.library.entries()].filter(([,v]) => v.tags.includes(tag)).map(([k]) => k); }
    getSize(): number { return this.library.size; }
  }
  export const dataLibrary = new DataLibrary();
  export default dataLibrary;