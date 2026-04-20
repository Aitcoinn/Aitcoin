import { logger } from '../lib/logger.js';
export class LanguageSystem {
    private knownLanguages: Map<string, number> = new Map([['english', 1.0], ['logic', 0.9], ['mathematics', 0.95]]);
    learn(language: string, proficiency = 0.5): void { this.knownLanguages.set(language, proficiency); logger.info({ language, proficiency }, '[LanguageSystem] Language learned'); }
    getProficiency(language: string): number { return this.knownLanguages.get(language) ?? 0; }
    translate(text: string, fromLang: string, toLang: string): string { return 'translated['+fromLang+'->'+toLang+']: '+text; }
    getKnownLanguages(): string[] { return [...this.knownLanguages.keys()]; }
  }
  export const languageSystem = new LanguageSystem();
  export default languageSystem;