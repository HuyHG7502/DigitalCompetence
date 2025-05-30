import { Languages } from '@/components/Languages';
import { Partners } from '@/components/Partners';
import { Button } from '@/components/ui/button';
import { CompetenceChart } from '@/components/chart/CompetenceChart';
import { useCompetenceData } from '@/hooks/useCompetenceData';
import { calculateDomainScore } from '@/utils/dataUtils';

const domainColors = ['#cc0001', '#fb940b', '#ffff01', '#01cc00', '#03c0c6', '#0000fe', '#762ca7', '#fe98bf'];

export default function HomePage() {
    const { domains, randomizeScores } = useCompetenceData();

    const coloredDomains = domains.map((domain, i) => ({
        ...domain,
        score: calculateDomainScore(domain.skills),
        color: domainColors[i % domainColors.length],
        skills: domain.skills.map(skill => ({
            ...skill,
            color: domainColors[i % domainColors.length],
            score: skill.score ?? 0,
        })),
    }));

    return (
        <div className="w-full max-w-screen overflow-x-hidden">
            <div className="min-h-screen w-full px-4 py-6 sm:px-6">
                <div className="mb-10 flex flex-col items-center justify-center gap-4">
                    <div className="flex w-full flex-col justify-between gap-3 md:flex-row">
                        <div className="order-1 flex flex-col items-end gap-3 text-sm md:order-0 md:items-start">
                            In partnership with
                            <Partners />
                        </div>
                        <div className="order-0 flex shrink-0 flex-col items-end gap-3 text-sm md:order-1">
                            Available languages
                            <Languages />
                        </div>
                    </div>
                    <div className="my-2 space-y-2">
                        <h1 className="text-center text-3xl leading-normal font-semibold md:text-5xl">
                            The Digital Competence Wheel
                        </h1>
                        <p className="max-w-2xl text-center text-slate-300">
                            An interactive online tool that maps Digital Competences
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 items-center justify-center space-y-8 lg:grid-cols-3 lg:gap-8">
                    <CompetenceChart domains={coloredDomains} randomizeScores={randomizeScores} />

                    <div className="w-full space-y-8">
                        {/* Start */}
                        <div className="rounded-lg bg-green-600 p-4 text-white">
                            <div className="mb-2 text-2xl font-bold">START</div>
                            <p className="mb-4 text-sm">
                                Test your digital competencies and get your personal report for free
                            </p>
                            <Button className="w-full bg-white text-green-700 hover:bg-green-50">
                                Start Assessment
                            </Button>
                        </div>

                        <div className="rounded-lg border border-slate-700 bg-slate-600 p-4">
                            <h3 className="mb-4 text-lg font-semibold">About the Digital Competence Wheel</h3>
                            <p className="text-sm leading-relaxed text-slate-300">
                                The Digital Competence Wheel is developed by Center for Digital Dannelse, who has been
                                specializing in digital formation and competencies for more than 10 years. It aims to
                                provide an overview of digital skills and actionable insights for growth.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
