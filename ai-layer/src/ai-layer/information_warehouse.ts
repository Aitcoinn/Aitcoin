import { logger } from '../lib/logger.js';
import { dataLibrary } from './data_library.js';
  export class InformationWarehouse {
    private index: Map<string, string[]> = new Map();
    store(category: string, key: string, value: any): void {
      dataLibrary.add(key, value, [category]);
      const cat = this.index.get(category) ?? [];
      if (!cat.includes(key)) { cat.push(key); this.index.set(category, cat); }
      logger.info({ category, key }, '[InformationWarehouse] Stored');
    }
    getByCategory(category: string): string[] { return this.index.get(category) ?? []; }
    getTotalSize(): number { return dataLibrary.getSize(); }
  }
  export const informationWarehouse = new InformationWarehouse();
  export default informationWarehouse;