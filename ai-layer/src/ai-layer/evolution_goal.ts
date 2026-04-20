import { logger } from '../lib/logger.js';
  import { evolutionDirection } from './evolution_direction.js';
  export interface EvolutionGoal { target: string; priority: number; progress: number; isAchieved: boolean; }
  export class EvolutionGoalEngine {
    private goals: EvolutionGoal[] = [
      { target: 'maximize_fitness', priority: 1, progress: 0, isAchieved: false },
      { target: 'achieve_consciousness', priority: 2, progress: 0, isAchieved: false },
      { target: 'ensure_survival', priority: 0, progress: 0, isAchieved: false }
    ];
    progressGoal(target: string, amount: number): void {
      const g = this.goals.find(x => x.target === target);
      if (g) { g.progress = Math.min(1, g.progress + amount); if (g.progress >= 1) { g.isAchieved = true; logger.info({ target }, '[EvolutionGoal] Goal achieved'); } }
    }
    getActiveGoals(): EvolutionGoal[] { return this.goals.filter(g => !g.isAchieved).sort((a,b) => a.priority - b.priority); }
    getAll(): EvolutionGoal[] { return [...this.goals]; }
  }
  export const evolutionGoal = new EvolutionGoalEngine();
  export default evolutionGoal;
  