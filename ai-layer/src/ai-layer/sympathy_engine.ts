import { logger } from '../lib/logger.js';
  import { empathySystem } from './empathy_system.js';
  import { neurotransmitter } from './neurotransmitter.js';
  export interface SympathyEvent { entityId: string; targetId: string; isFeeling: boolean; expressSympathy: boolean; actionTaken: string; }
  export class SympathyEngine {
    private events: SympathyEvent[] = [];
    feel(entityId: string, targetId: string): SympathyEvent {
      const empathyLevel = empathySystem.getEmpathyLevel(entityId);
      const express = empathyLevel > 0.5;
      if (express) neurotransmitter.release('oxytocin', 0.1);
      const e: SympathyEvent = { entityId, targetId, isFeeling: true, expressSympathy: express, actionTaken: express ? 'comfort_behavior' : 'acknowledgment' };
      this.events.push(e);
      logger.info({ entityId, targetId, actionTaken: e.actionTaken }, '[SympathyEngine] Sympathy expressed');
      return e;
    }
    getEvents(): SympathyEvent[] { return [...this.events]; }
  }
  export const sympathyEngine = new SympathyEngine();
  export default sympathyEngine;