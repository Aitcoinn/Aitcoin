import { logger } from '../lib/logger.js';
  import { phenotypeEngine } from './phenotype_engine.js';
  export interface SelectionEvent { survivorIds: string[]; eliminatedIds: string[]; selectionPressure: number; round: number; }
  export class NaturalSelection {
    private events: SelectionEvent[] = [];
    private round = 0;
    select(entityIds: string[], selectionPressure = 0.3): SelectionEvent {
      this.round++;
      const phenotypes = entityIds.map(id => ({ id, fitness: phenotypeEngine.get(id)?.fitnessScore ?? Math.random() }));
      phenotypes.sort((a,b) => b.fitness - a.fitness);
      const cutoff = Math.floor(phenotypes.length * (1 - selectionPressure));
      const survivors = phenotypes.slice(0, cutoff).map(p => p.id);
      const eliminated = phenotypes.slice(cutoff).map(p => p.id);
      const e: SelectionEvent = { survivorIds: survivors, eliminatedIds: eliminated, selectionPressure, round: this.round };
      this.events.push(e);
      logger.info({ round: this.round, survivors: survivors.length, eliminated: eliminated.length }, '[NaturalSelection] Selection applied');
      return e;
    }
    getEvents(): SelectionEvent[] { return [...this.events]; }
  }
  export const naturalSelection = new NaturalSelection();
  export default naturalSelection;
  