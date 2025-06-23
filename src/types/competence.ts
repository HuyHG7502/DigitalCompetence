export type ProficiencyLevel = 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';

export interface Skill {
    id: string;
    name: string;
    description: string;
    levels: Record<ProficiencyLevel, string>;
    domainId: string;
}

export interface Domain {
    id: string;
    name: string;
    description: string;
    color: string;
    skills: Skill[];
}
