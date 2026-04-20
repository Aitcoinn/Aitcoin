import { logger } from '../lib/logger.js';
  export class UncertaintyHandler { handle(entityId: string, uncertainty: number): string { if (uncertainty > 0.7) return 'gather_more_info'; if (uncertainty > 0.4) return 'proceed_cautiously'; return 'proceed'; } }
  export const uncertaintyHandler = new UncertaintyHandler();
  export default uncertaintyHandler;