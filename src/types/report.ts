import type { AssessmentAnswer } from './assessment';
import type { ProficiencyLevel } from './competence';

export interface SkillResult {
    id: string;
    score: number;
    level: ProficiencyLevel;
}

export interface DomainResult {
    id: string;
    score: number;
    level: ProficiencyLevel;
    skills: SkillResult[];
}

export interface AssessmentResults {
    domains: DomainResult[];
    overallScore: number;
    overallLevel: ProficiencyLevel;
}

export interface ReportResults extends AssessmentResults {
    id: string;
    name: string;
    answers: AssessmentAnswer;
    startedAt: string;
    completedAt: string;
}
