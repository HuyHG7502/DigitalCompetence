import type { ProficiencyLevel } from './competence';

export interface ChartSkill {
    id: string;
    name: string;
    description: string;
    score: number;
    level: ProficiencyLevel;
    levels: Record<ProficiencyLevel, string>;
}

export interface ChartDomain {
    id: string;
    name: string;
    description: string;
    color: string;
    score: number;
    level: ProficiencyLevel;
    skills: ChartSkill[];
}
