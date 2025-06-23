import type { ChartDomain } from '@/types/chart';
import type { Domain, ProficiencyLevel } from '@/types/competence';
import type { SkillResult } from '@/types/report';

export function getProficiencyLevel(score: number): ProficiencyLevel {
    if (score >= 80) return 'Master';
    if (score >= 60) return 'Expert';
    if (score >= 40) return 'Advanced';
    if (score >= 20) return 'Intermediate';
    return 'Foundational';
}

export function getDomainScore(skills: SkillResult[]): number {
    if (skills.length === 0) return 0;

    const total = skills.reduce((sum, skill) => sum + skill.score, 0);
    return Math.round(total / skills.length);
}

export function getRandomDomainScores(domains: Domain[], isInitial: boolean = false): ChartDomain[] {
    return domains.map(domain => {
        const skills = domain.skills.map(skill => {
            const score = isInitial ? 20 : Math.floor(Math.random() * 101);
            const level = getProficiencyLevel(score);
            return {
                ...skill,
                score,
                level,
            };
        });

        const score = getDomainScore(skills);
        const level = getProficiencyLevel(score);

        return {
            id: domain.id,
            name: domain.name,
            description: domain.description,
            color: domain.color || '',
            score,
            level,
            skills,
        };
    });
}

export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
