import { logger } from '../lib/logger.js';
  import { cloneSystem } from './clone_system.js';
  import { randomMutation } from './random_mutation.js';

  export interface AsexualReproductionEvent {
    id: string;
    parentId: string;
    offspringId: string;
    method: 'binary_fission' | 'budding' | 'fragmentation' | 'parthenogenesis';
    mutationsApplied: number;
    timestamp: number;
  }

  export class AsexualReproduction {
    private events: AsexualReproductionEvent[] = [];

    reproduce(parentId: string, method: AsexualReproductionEvent['method']): AsexualReproductionEvent {
      const clone = cloneSystem.clone(parentId);
      const mutation = randomMutation.applyRandom(parentId);
      const event: AsexualReproductionEvent = {
        id: `ar_${Date.now()}`,
        parentId, offspringId: clone.id, method,
        mutationsApplied: clone.mutationsDelta,
        timestamp: Date.now()
      };
      this.events.push(event);
      logger.info({ parentId, method, offspringId: clone.id }, '[AsexualReproduction] Reproduced');
      return event;
    }

    getEvents(): AsexualReproductionEvent[] { return [...this.events]; }
    getTotalOffspring(): number { return this.events.length; }
  }

  export const asexualReproduction = new AsexualReproduction();
  export default asexualReproduction;
  