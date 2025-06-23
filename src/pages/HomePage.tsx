import { Languages } from '@/components/Languages';
import { Partners } from '@/components/Partners';
import { Button } from '@/components/ui/button';
import { CompetenceChart } from '@/components/chart/Wheel';
import { useData } from '@/hooks/useData';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { getRandomDomainScores } from '@/utils/dataUtils';
import { fetchProgress, startAssessment } from '@/services/assessmentService';
import type { ChartDomain } from '@/types/chart';

export default function HomePage() {
    const navigate = useNavigate();
    const { domains, isLoading } = useData();
    const [assessmentId, setAssessmentId] = useState<string>();
    const [demoDomains, setDemoDomains] = useState<ChartDomain[]>([]);

    useEffect(() => {
        if (isLoading) return;

        setDemoDomains(getRandomDomainScores(domains));
        const interval = setInterval(() => {
            setDemoDomains(getRandomDomainScores(domains));
        }, 5000);

        return () => clearInterval(interval);
    }, [domains, isLoading]);

    useEffect(() => {
        const existingId = localStorage.getItem('assessmentId');
        if (existingId) {
            setAssessmentId(existingId);
        }
    }, []);

    const handleStartAssessment = async () => {
        let id = assessmentId;
        if (!id) {
            id = nanoid();
            setAssessmentId(id);
            await startAssessment(id);
        } else {
            const progress = await fetchProgress(id);
            if (!progress) {
                await startAssessment(id);
            }
        }
        navigate(`/assessment/${id}`);
    };

    const handleResetAssessment = async () => {
        const newId = nanoid();
        setAssessmentId(newId);

        await startAssessment(newId);
        navigate(`/assessment/${newId}`);
    };

    return (
        <div className="w-full overflow-x-hidden">
            <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6">
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
                        <p className="text-accent-foreground max-w-2xl text-center">
                            An interactive online tool that maps Digital Competences
                        </p>
                    </div>
                </div>

                <div className="mx-auto grid w-fit grid-cols-1 items-center justify-center space-y-8 lg:grid-cols-3 lg:gap-8">
                    <CompetenceChart domains={demoDomains} />

                    <div className="w-full max-w-md space-y-8">
                        <div className="bg-success/50 text-primary-foreground rounded-lg p-4">
                            <div className="mb-2 text-center text-2xl font-bold">Start</div>
                            <p className="mb-4 text-sm">
                                Test your digital competencies and get your personal report for free
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    className="bg-foreground hover:bg-primary-foreground flex-1 font-semibold text-green-700"
                                    onClick={handleStartAssessment}
                                >
                                    {assessmentId ? 'Resume' : 'Start Assessment'}
                                </Button>
                                {assessmentId && (
                                    <Button
                                        className="bg-ring hover:bg-muted flex-1 text-white"
                                        onClick={handleResetAssessment}
                                    >
                                        Restart
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="border-accent bg-accent rounded-lg border p-4">
                            <h3 className="mb-4 text-lg font-semibold">About the Digital Competence Wheel</h3>
                            <p className="text-accent-foreground text-sm leading-relaxed">
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
