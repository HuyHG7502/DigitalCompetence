import type { ProficiencyLevel } from '@/hooks/useCompetenceData';

export function getProficiencyLevel(score: number): ProficiencyLevel {
    if (score >= 80) return 'Master';
    if (score >= 60) return 'Expert';
    if (score >= 40) return 'Advanced';
    if (score >= 20) return 'Intermediate';
    return 'Foundational';
}

export function calculateDomainScore(skills: { score: number }[]): number {
    if (skills.length === 0) return 0;

    const totalScore = skills.reduce((sum, skill) => sum + skill.score, 0);
    return Math.round(totalScore / skills.length);
}
