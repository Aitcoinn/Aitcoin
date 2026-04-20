import { logger } from '../lib/logger.js';
import { blockchainBridge } from './blockchain_bridge.js';

/**
 * WORLD_MASTER.TS — Master Hub untuk semua modul dunia
 * Menghubungkan: Kimia, Cuaca, Sistem Pengatur, Bangunan, Tubuh, Pikiran, Emosi, Sosial
 * Terhubung ke Blockchain AITCOIN melalui BlockchainBridge
 */

export class WorldMaster {
  private modules: string[] = [];
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    const allModules = [
      // Chemistry
      'crystal_form','precipitate','dissolve','mix_liquid','separate','filter','evaporate',
      'condense','sublimation_process','deposition','melting','freezing','boiling','vaporize',
      'state_matter','solid','liquid','gas','plasma_state',
      // Weather
      'weather_core','temperature','wind','storm','hurricane','tornado','rain','snow','thunder',
      'lightning','ocean','earthquake','volcano','mountain','plate_tectonic','magnetic_field',
      // System
      'system_core','world_engine','physics_engine','ai_engine','logic_engine','database',
      'encrypt','decrypt','hash','authenticate','authorize','performance','render','collision',
      'coordinate','vector','matrix','transform','reality_core','existence','creation','infinity','world_complete',
      // Human Body
      'human_body','brain_cell','consciousness','dopamine_sys','serotonin_sys',
      // Emotion
      'feeling_core','emotion_sys','happy','sad','fear','love_emo','calm','courage',
      // Social
      'social_core','family','community','society',
      // Building
      'wall_builder','bridge_build','house_small','palace_build',
    ];

    for (const m of allModules) {
      blockchainBridge.registerModule(m);
      this.modules.push(m);
    }

    logger.info({ totalModules: this.modules.length }, '[WorldMaster] All modules connected to blockchain');
  }

  validateAll(entityId: string): Record<string, boolean> {
    const results: Record<string, boolean> = {};
    for (const m of this.modules) {
      results[m] = blockchainBridge.validateAIOutput(m, { entityId, source: 'world_master' });
    }
    return results;
  }

  getChainStatus() {
    return blockchainBridge.getStatus();
  }

  getModuleCount(): number { return this.modules.length; }
}

export const worldMaster = new WorldMaster();
worldMaster.init();
export default worldMaster;
