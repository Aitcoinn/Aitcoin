import { logger } from '../lib/logger.js';
  import { logicEngine } from './logic_engine.js';
  export interface ReasoningChain { entityId: string; premises: string[]; steps: string[]; conclusion: string; confidence: number; type: string; }
  export class ReasoningSystem {
    private chains: ReasoningChain[] = [];
    reason(entityId: string, premises: string[], type: string): ReasoningChain {
      const steps = premises.map((p, i) => `Step ${i+1}: ${p}`);
      const logicResult = logicEngine.evaluate(premises[0] ?? '', premises[premises.length-1] ?? '');
      const chain: ReasoningChain = { entityId, premises, steps, conclusion: logicResult.conclusion, confidence: logicResult.confidence, type };
      this.chains.push(chain);
      logger.info({ entityId, type, steps: steps.length, confidence: chain.confidence }, '[ReasoningSystem] Reasoned');
      return chain;
    }
    getChains(entityId: string): ReasoningChain[] { return this.chains.filter(c => c.entityId === entityId); }
  }
  export const reasoningSystem = new ReasoningSystem();
  export default reasoningSystem;