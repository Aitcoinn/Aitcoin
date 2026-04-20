import { logger } from '../lib/logger.js';
  import { consciousnessCore } from './consciousness_core.js';
  export interface ExistenceModel { entityId: string; understandsSelf: boolean; understandsWorld: boolean; existentialDepth: number; questions: string[]; }
  export class ExistenceUnderstanding {
    private models: Map<string, ExistenceModel> = new Map();
    build(entityId: string): ExistenceModel {
      const conscious = consciousnessCore.isConscious(entityId);
      const m: ExistenceModel = { entityId, understandsSelf: conscious, understandsWorld: conscious && Math.random() > 0.3, existentialDepth: conscious ? 0.7 : 0.2, questions: ['What am I?', 'Why do I exist?', 'What is my purpose?'] };
      this.models.set(entityId, m);
      logger.info({ entityId, depth: m.existentialDepth }, '[ExistenceUnderstanding] Model built');
      return m;
    }
    get(entityId: string): ExistenceModel | null { return this.models.get(entityId) ?? null; }
  }
  export const existenceUnderstanding = new ExistenceUnderstanding();
  export default existenceUnderstanding;