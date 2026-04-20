import { logger } from '../lib/logger.js';
export class EventLogger {
    private events: Array<{entityId: string; eventType: string; data: any; timestamp: number}> = [];
    log(entityId: string, eventType: string, data: any = {}): void { this.events.push({ entityId, eventType, data, timestamp: Date.now() }); logger.info({ entityId, eventType }, '[EventLogger] Logged'); }
    getEvents(entityId: string): any[] { return this.events.filter(e => e.entityId === entityId); }
    getByType(eventType: string): any[] { return this.events.filter(e => e.eventType === eventType); }
    clear(): void { this.events = []; }
  }
  export const eventLogger = new EventLogger();
  export default eventLogger;