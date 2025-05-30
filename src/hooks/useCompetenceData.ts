import { useEffect, useState } from 'react';
import userData from '@/lib/data/userData.json';
import competenceData from '@/lib/data/competenceData.json';
import { getProficiencyLevel } from '@/utils/dataUtils';

export type ProficiencyLevel = 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';

export interface Skill {
    name: string;
    levels: Record<ProficiencyLevel, string>;
    score: number;
    level: ProficiencyLevel;
}

export interface Domain {
    name: string;
    skills: Skill[];
}

export interface UserScore {
    domain: string;
    skill: string;
    score: number;
}

export function useCompetenceData() {
    const [domains, setDomains] = useState<Domain[]>([]);

    useEffect(() => {
        const scores: UserScore[] = userData.scores;
        const merged = competenceData.domains.map(domain => {
            return {
                ...domain,
                skills: domain.skills.map(skill => {
                    const match = scores.find(s => s.domain === domain.name && s.skill === skill.name);
                    const score = match?.score || 0;
                    const level = getProficiencyLevel(score);
                    return {
                        ...skill,
                        score,
                        level,
                    };
                }),
            };
        });
        setDomains(merged);
    }, []);

    function randomizeScores() {
        setDomains(domains =>
            domains.map(domain => ({
                ...domain,
                skills: domain.skills.map(skill => {
                    const randomScore = Math.floor(Math.random() * 101);
                    const level = getProficiencyLevel(randomScore);
                    return {
                        ...skill,
                        score: randomScore,
                        level,
                    };
                }),
            }))
        );
    }

    return { user: userData.user, domains, randomizeScores };
}
