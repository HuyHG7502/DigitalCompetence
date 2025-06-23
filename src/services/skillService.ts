import { db } from '@/lib/firebase';
import { getDocs, collection } from 'firebase/firestore';
import type { Domain, Skill } from '@/types/competence';
import { mapDomainColors } from '@/utils/colorUtils';

export async function fetchDomainsWithSkills(): Promise<Domain[]> {
    const domainSnapshot = await getDocs(collection(db, 'domains'));
    const baseDomains: Domain[] = [];

    for (const domainDoc of domainSnapshot.docs) {
        const domainId = domainDoc.id;
        const domainData = domainDoc.data();
        const skillSnapshot = await getDocs(collection(db, 'domains', domainId, 'skills'));

        const skills: Skill[] = skillSnapshot.docs.map(skillDoc => {
            const skillData = skillDoc.data();
            return {
                id: skillDoc.id,
                name: skillData.name,
                description: skillData.description,
                levels: skillData.levels,
                domainId: domainId,
            };
        });

        baseDomains.push({
            id: domainId,
            name: domainData.name,
            description: domainData.description,
            color: '',
            skills,
        });
    }

    return mapDomainColors(baseDomains);
}
