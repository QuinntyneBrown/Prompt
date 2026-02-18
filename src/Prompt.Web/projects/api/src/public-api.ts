/*
 * Public API Surface of api
 */

// Configuration
export { API_CONFIGURATION, provideApi } from './lib/api-configuration';
export type { ApiConfiguration } from './lib/api-configuration';

// Models
export type { Skill, CreateSkillRequest, UpdateSkillRequest } from './lib/models/skill.model';
export type { SkillStatus } from './lib/models/skill.model';

// Services
export { SkillService } from './lib/services/skill.service';
