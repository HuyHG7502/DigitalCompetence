import type { ChartDomain } from '@/types/chart';
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';

interface DomainAccordionProps {
    domain: ChartDomain;
}

export const DomainAccordion: React.FC<DomainAccordionProps> = ({ domain }) => {
    return (
        <AccordionItem value={domain.id} className="bg-input rounded-md border">
            <AccordionTrigger className="relative flex items-center gap-4 p-2 hover:no-underline">
                <div
                    className="bg-accent absolute top-0 left-0 h-full rounded-tl-md"
                    style={{
                        width: `${domain.score}%`,
                    }}
                />
                <div
                    className={cn(
                        'z-10 flex size-6 items-center justify-center',
                        'text-secondary-foreground bg-card rounded-full border-2 text-xs font-medium'
                    )}
                    style={{ borderColor: domain.color }}
                >
                    {domain.score}
                </div>
                <div className="z-10 flex flex-1 items-center gap-2">
                    <h4 className="text-primary-foreground flex-1 text-xs font-medium lg:text-sm">{domain.name}</h4>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="mt-2 space-y-2 px-3">
                    {domain.skills.map(skill => (
                        <div key={skill.id} className="flex items-center gap-2">
                            <div className="flex-1 text-xs font-semibold">{skill.name}</div>
                            <div className="text-xs font-medium">{skill.score}%</div>
                        </div>
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};
