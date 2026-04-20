import { logger } from '../lib/logger.js';
  import { evolutionDirection, EvolutionDirection } from './evolution_direction.js';
  import { evolutionSpeed } from './evolution_speed.js';
  export interface EvolutionPathNode { direction: EvolutionDirection; speed: number; generation: number; timestamp: number; }
  export class EvolutionPath {
    private path: EvolutionPathNode[] = [];
    private generation = 0;
    advance(): EvolutionPathNode {
      this.generation++;
      const node: EvolutionPathNode = {
        direction: evolutionDirection.determine(),
        speed: evolutionSpeed.calculateSpeed(),
        generation: this.generation, timestamp: Date.now()
      };
      this.path.push(node);
      logger.info({ gen: this.generation, direction: node.direction, speed: node.speed }, '[EvolutionPath] Advanced');
      return node;
    }
    getPath(): EvolutionPathNode[] { return [...this.path]; }
    getCurrentGeneration(): number { return this.generation; }
  }
  export const evolutionPath = new EvolutionPath();
  export default evolutionPath;
  