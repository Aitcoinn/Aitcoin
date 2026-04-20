import { logger } from '../lib/logger.js';
export class SupervisedLearning {
    private model: Map<string, string> = new Map();
    train(inputs: string[], labels: string[]): void { inputs.forEach((inp, i) => { if (labels[i]) this.model.set(inp, labels[i]); }); logger.info({ pairs: inputs.length }, '[SupervisedLearning] Trained'); }
    predict(input: string): string { return this.model.get(input) ?? 'unknown'; }
    evaluate(inputs: string[], labels: string[]): number { const correct = inputs.filter((inp,i) => this.predict(inp) === labels[i]).length; return correct / Math.max(1, inputs.length); }
  }
  export const supervisedLearning = new SupervisedLearning();
  export default supervisedLearning;