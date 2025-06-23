import type { AssessmentQuestion, AssessmentAnswer } from '@/types/assessment';
import type { AssessmentResults, DomainResult, SkillResult } from '@/types/report';
import type { Domain, Skill } from '@/types/competence';
import { getProficiencyLevel } from './dataUtils';
import type { ChartDomain } from '@/types/chart';

export function calculateResults(
    questions: AssessmentQuestion[],
    answers: AssessmentAnswer,
    skills: Skill[],
    domains: Domain[]
) {
    // 1. Group answers by skills
    const skillAnswers: Record<string, number[]> = {};
    questions.forEach(q => {
        if (q.type !== 'rating' || !q.skillId || !q.domainId) return;
        let score = answers[q.id];
        if (typeof score === 'number') {
            // Normalize score to a 0-100 scale
            score = Math.round((score / 7) * 100);
            if (!skillAnswers[q.skillId]) skillAnswers[q.skillId] = [];
            skillAnswers[q.skillId].push(score);
        }
    });

    // 2. Calculate skill results
    const skillResults: SkillResult[] = skills.map(skill => {
        const scores = skillAnswers[skill.id] || [];
        const score = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const level = getProficiencyLevel(score);
        return {
            id: skill.id,
            score,
            level,
        };
    });

    // 3. Group skills by domains
    const domainSkills: Record<string, SkillResult[]> = {};
    skillResults.forEach(skillResult => {
        const skill = skills.find(s => s.id === skillResult.id);
        if (!skill || !skill.domainId) return;
        const domainId = skill.domainId;
        if (!domainSkills[domainId]) domainSkills[domainId] = [];
        domainSkills[domainId].push(skillResult);
    });

    // 4. Calculate domain results
    const domainResults: DomainResult[] = domains.map(domain => {
        const skills = domainSkills[domain.id] || [];
        const score = skills.length ? Math.round(skills.reduce((a, b) => a + b.score, 0) / skills.length) : 0;
        const level = getProficiencyLevel(score);
        return { id: domain.id, score, level, skills };
    });

    // 5. Calculate overall results
    const totalScores = skillResults.map(s => s.score);
    const overallScore = totalScores.length
        ? Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length)
        : 0;
    const overallLevel = getProficiencyLevel(overallScore);

    return { domains: domainResults, overallScore, overallLevel };
}

export function fetchChartResults(
    results: AssessmentResults,
    domainsMap: Record<string, Domain>,
    skillsMap: Record<string, Skill>
): ChartDomain[] {
    return results.domains.map(domainResult => {
        const domain = domainsMap[domainResult.id];
        return {
            id: domainResult.id,
            name: domain?.name || domainResult.id,
            description: domain?.description || '',
            color: domain?.color || '#ffffff',
            score: domainResult.score,
            level: domainResult.level,
            skills: domainResult.skills.map(skillResult => {
                const skill = skillsMap[skillResult.id];
                return {
                    id: skillResult.id,
                    name: skill?.name || skillResult.id,
                    description: skill?.description || '',
                    score: skillResult.score,
                    level: skillResult.level,
                    levels: skill?.levels || {
                        Foundational: '',
                        Intermediate: '',
                        Advanced: '',
                        Expert: '',
                        Master: '',
                    },
                };
            }),
        };
    });
}
