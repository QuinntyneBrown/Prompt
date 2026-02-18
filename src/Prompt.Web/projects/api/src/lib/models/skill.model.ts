export type SkillStatus = 'published' | 'draft' | 'archived';

export interface Skill {
  id: number;
  name: string;
  description: string;
  content: string;
  status: SkillStatus;
  tags: string[];
  template: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateSkillRequest {
  name: string;
  description: string;
  content?: string;
  status?: SkillStatus;
  tags?: string[];
  template?: string;
}

export interface UpdateSkillRequest {
  name: string;
  description: string;
  content?: string;
  status?: SkillStatus;
  tags?: string[];
  template?: string;
}
