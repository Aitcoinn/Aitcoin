import { logger } from '../lib/logger.js';
  export class ScenarioGenerator { generate(entityId: string, trigger: string): string[] { return ['best_case_'+trigger,'worst_case_'+trigger,'most_likely_'+trigger]; } }
  export const scenarioGenerator = new ScenarioGenerator();
  export default scenarioGenerator;