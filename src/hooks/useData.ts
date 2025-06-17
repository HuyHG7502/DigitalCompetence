import { useEffect, useState } from 'react';
import { getDomainScore, getProficiencyLevel } from '@/utils/dataUtils';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BaseDomain, BaseSkill, Domain, Skill, ProficiencyLevel } from '@/types/competence';
import { mapDomainColors } from '@/utils/colorUtils';

import userData from '@/lib/data/userData.json';

function mapDomainScores(domain: BaseDomain | Domain, randomised: boolean = false): Domain {
    const skills: Skill[] = domain.skills.map(skill => {
        const score = randomised ? Math.floor(Math.random() * 101) : 0;
        const level: ProficiencyLevel = getProficiencyLevel(score);
        return {
            ...skill,
            score,
            level,
        };
    });

    const domainScore = getDomainScore(skills);
    const domainLevel = getProficiencyLevel(domainScore);

    return {
        ...domain,
        skills,
        score: domainScore,
        level: domainLevel,
        color: (domain as Domain).color || '',
    };
}

export function useData() {
    const [domains, setDomains] = useState<Domain[]>([]);

    useEffect(() => {
        async function fetchData() {
            const domainSnapshot = await getDocs(collection(db, 'domains'));
            const baseDomains: BaseDomain[] = [];

            for (const domainDoc of domainSnapshot.docs) {
                const domainId = domainDoc.id;
                const domainInfo = domainDoc.data();
                const skillsSnapshot = await getDocs(collection(db, 'domains', domainId, 'skills'));

                const skills: BaseSkill[] = skillsSnapshot.docs.map(skillDoc => {
                    const skill = skillDoc.data();
                    return {
                        id: skillDoc.id,
                        name: skill.name,
                        description: skill.description,
                        levels: skill.levels,
                    };
                });

                baseDomains.push({
                    id: domainId,
                    name: domainInfo.name,
                    description: domainInfo.description,
                    skills,
                });
            }

            const withScores = baseDomains.map(domain => mapDomainScores(domain));
            const withColors = mapDomainColors(withScores);

            setDomains(withColors);
        }

        fetchData();
    }, []);

    function enrichScores() {
        setDomains(domains => domains.map(domain => mapDomainScores(domain, true)));
    }

    return { user: userData.user, domains, enrichScores };
}
