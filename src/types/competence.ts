export type ProficiencyLevel = 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';

export interface BaseSkill {
    id: string;
    name: string;
    description: string;
    levels: Record<ProficiencyLevel, string>;
}

export interface BaseDomain {
    id: string;
    name: string;
    description: string;
    skills: BaseSkill[];
}

export interface Skill extends BaseSkill {
    score: number;
    level: ProficiencyLevel;
}

export interface Domain extends BaseDomain {
    skills: Skill[];
    score: number;
    level: ProficiencyLevel;
    color: string;
}
