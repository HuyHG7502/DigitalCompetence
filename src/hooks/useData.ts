import { useEffect, useMemo, useState } from 'react';
import { mapDomainColors } from '@/utils/colorUtils';
import { fetchDomainsWithSkills } from '@/services/skillService';
import type { Domain, Skill } from '@/types/competence';

export function useData() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const baseDomains = await fetchDomainsWithSkills();
            const withColors = mapDomainColors(baseDomains);

            setDomains(withColors);
            setIsLoading(false);
        }

        fetchData();
    }, []);

    const skills = useMemo(() => {
        return domains.flatMap(domain => domain.skills);
    }, [domains]);

    const domainsMap = useMemo(() => {
        const map: Record<string, Domain> = {};
        for (const domain of domains) {
            map[domain.id] = domain;
        }
        return map;
    }, [domains]);

    const skillsMap = useMemo(() => {
        const map: Record<string, Skill> = {};
        for (const domain of domains) {
            for (const skill of domain.skills) {
                map[skill.id] = skill;
            }
        }
        return map;
    }, [domains]);

    return { domains, skills, domainsMap, skillsMap, isLoading };
}
