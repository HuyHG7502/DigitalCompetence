import { CompetenceChart } from '@/components/chart/Wheel';
import { useState, useEffect } from 'react';
import { fetchChartResults } from '@/utils/reportUtils';
import { Calendar, IdCard, Timer, Users, ListOrdered } from 'lucide-react';
import { DomainAccordion } from '@/components/assessment/Accordion';
import { Accordion } from '@/components/ui/accordion';
import { formatDuration, intervalToDuration } from 'date-fns';
import type { Domain, Skill } from '@/types/competence';
import type { ReportResults } from '@/types/report';
import type { ChartDomain } from '@/types/chart';

const reportStats = {
    name: {
        icon: <IdCard className="size-5 shrink-0" />,
        label: 'Name',
        value: 'anonymous',
    },
    score: {
        icon: <ListOrdered className="size-5 shrink-0" />,
        label: 'Score',
        value: '0%',
    },
    date: {
        icon: <Calendar className="size-5 shrink-0" />,
        label: 'Date',
        value: new Date().toLocaleDateString(),
    },
    duration: {
        icon: <Timer className="size-5 shrink-0" />,
        label: 'Duration',
        value: '0 min',
    },
    group: {
        icon: <Users className="size-5 shrink-0" />,
        label: 'Group',
        value: 'digital-competence.vn',
    },
};

export function ReportResult({
    results,
    domainsMap,
    skillsMap,
}: {
    results: ReportResults;
    domainsMap: Record<string, Domain>;
    skillsMap: Record<string, Skill>;
}) {
    const [chartResults, setChartResults] = useState<ChartDomain[]>([]);
    const [chartStats, setChartStats] = useState<typeof reportStats>(reportStats);

    useEffect(() => {
        if (results) {
            setChartResults(fetchChartResults(results, domainsMap, skillsMap));
            setChartStats({
                name: {
                    ...reportStats.name,
                    value: results.name || 'anonymous',
                },
                score: {
                    ...reportStats.score,
                    value: `${results.overallScore}% - ${results.overallLevel}`,
                },
                date: {
                    ...reportStats.date,
                    value: new Date(results.completedAt).toLocaleDateString(),
                },
                duration: {
                    ...reportStats.duration,
                    value: formatDuration(
                        intervalToDuration({
                            start: new Date(results.startedAt),
                            end: new Date(results.completedAt),
                        }),
                        { format: ['hours', 'minutes'], zero: false, delimiter: ' ' }
                    ),
                },
                group: {
                    ...reportStats.group,
                },
            });
        }
    }, [results, domainsMap, skillsMap]);

    return (
        <div className="w-full overflow-x-hidden">
            <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                    <div className="flex-1 space-y-4">
                        <h1 className="text-xl leading-normal font-semibold md:text-3xl">Report</h1>
                        <p className="text-foreground leading-relaxed">
                            Report for <span className="text-secondary-ring italic">{chartStats.name.value}</span> on
                            The Digital Competence Wheel.
                            <br />
                            The assessment was completed on {chartStats.date.value}.
                        </p>
                        <p className="text-accent-foreground text-sm leading-relaxed">
                            Each bar represents a competence with a possible score between 0 and 100%. The higher the
                            score, the stronger the competence.
                            <br />
                            <br />
                            Tip: Hover/Click on a bar for more details on that competence.
                        </p>
                    </div>
                    <div className="space-y-2 lg:w-1/4">
                        {Object.entries(chartStats).map(([key, stat]) => (
                            <div key={key} className="bg-input flex items-center gap-3 rounded-md border p-2">
                                <div className="border-secondary-ring bg-secondary/50 text-secondary-foreground flex items-center justify-center rounded-full border p-2">
                                    {stat.icon}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="text-primary-ring text-sm font-semibold">{stat.label}</div>
                                    <div className="text-xs font-semibold">{stat.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 flex flex-col gap-4 xl:flex-row">
                    <div className="flex flex-col gap-2 xl:max-w-sm">
                        <h2 className="text-base font-medium">Digital Competence Domains and Skills</h2>
                        <p className="text-accent-foreground text-sm">
                            The key components of digital competence are summarised as below.
                        </p>
                        <Accordion
                            type="single"
                            collapsible
                            className="my-4 grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-1"
                        >
                            {chartResults.map(domain => (
                                <DomainAccordion key={domain.id} domain={domain} />
                            ))}
                        </Accordion>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-4 md:gap-8">
                        <h2 className="text-base font-medium">Digital Competences</h2>
                        <CompetenceChart domains={chartResults} />
                    </div>
                </div>
            </div>
        </div>
    );
}
