import { logger } from '../lib/logger.js';
import { historyArchive } from './history_archive.js';
  import { eventLogger } from './event_logger.js';
  export class RecordKeeper {
    keep(entityId: string, recordType: string, content: string): void {
      eventLogger.log(entityId, recordType, { content });
      if (recordType === 'historical') historyArchive.record('present', content, [entityId]);
      logger.info({ entityId, recordType }, '[RecordKeeper] Record kept');
    }
    getRecords(entityId: string): any[] { return eventLogger.getEvents(entityId); }
  }
  export const recordKeeper = new RecordKeeper();
  export default recordKeeper;