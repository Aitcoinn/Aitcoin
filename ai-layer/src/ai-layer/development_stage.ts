import { logger } from '../lib/logger.js';
  import { growthEngine, GrowthStage } from './growth_engine.js';
  export interface DevelopmentMilestone { stage: GrowthStage; capability: string; achievedAt: number; }
  export class DevelopmentStage {
    private milestones: Map<string, DevelopmentMilestone[]> = new Map();
    private stageMilestones: Record<GrowthStage, string> = {
      embryo: 'basic_structure', juvenile: 'locomotion', adolescent: 'social_awareness', adult: 'full_capability', elder: 'wisdom'
    };
    checkMilestones(entityId: string): DevelopmentMilestone[] {
      const gs = growthEngine.get(entityId);
      if (!gs) return [];
      const existing = this.milestones.get(entityId) ?? [];
      const cap = this.stageMilestones[gs.stage];
      if (!existing.find(m => m.capability === cap)) {
        const m: DevelopmentMilestone = { stage: gs.stage, capability: cap, achievedAt: Date.now() };
        existing.push(m);
        this.milestones.set(entityId, existing);
        logger.info({ entityId, stage: gs.stage, cap }, '[DevelopmentStage] Milestone achieved');
      }
      return existing;
    }
    get(entityId: string): DevelopmentMilestone[] { return this.milestones.get(entityId) ?? []; }
  }
  export const developmentStage = new DevelopmentStage();
  export default developmentStage;
  