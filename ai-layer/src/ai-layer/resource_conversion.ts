import { logger } from '../lib/logger.js';
  import { energyFlow } from './energy_flow.js';
  export interface ConversionEvent { entityId: string; inputResource: string; outputResource: string; conversionRate: number; energyUsed: number; }
  export class ResourceConversion {
    private events: ConversionEvent[] = [];
    convert(entityId: string, input: string, output: string, rate = 0.8): ConversionEvent {
      const flow = energyFlow.get(entityId);
      const energyUsed = (flow?.outflow ?? 1) * 0.1;
      const e: ConversionEvent = { entityId, inputResource: input, outputResource: output, conversionRate: rate, energyUsed };
      this.events.push(e);
      logger.info({ entityId, input, output, rate }, '[ResourceConversion] Resource converted');
      return e;
    }
    getEfficiency(entityId: string): number {
      const entityEvents = this.events.filter(e => e.entityId === entityId);
      return entityEvents.length > 0 ? entityEvents.reduce((s,e) => s + e.conversionRate,0)/entityEvents.length : 1;
    }
    getEvents(): ConversionEvent[] { return [...this.events]; }
  }
  export const resourceConversion = new ResourceConversion();
  export default resourceConversion;
  