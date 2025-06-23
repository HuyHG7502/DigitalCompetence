import { useState, useEffect } from 'react';
import type { AssessmentAnswer, AssessmentQuestion } from '@/types/assessment';
import type { ReportResults } from '@/types/report';
import { fetchQuestions } from '@/services/assessmentService';
import type { Domain } from '@/types/competence';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Response {
    question: AssessmentQuestion;
    answer: number;
    score: number;
    domain: Domain;
}

export function ReportQuestions({
    results,
    domainsMap,
}: {
    results: ReportResults;
    domainsMap: Record<string, Domain>;
}) {
    const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
    const [answers, setAnswers] = useState<AssessmentAnswer>({});
    const [responses, setResponses] = useState<Response[]>([]);

    const mapResponses = (
        questions: AssessmentQuestion[],
        answers: AssessmentAnswer,
        domainsMap: Record<string, Domain>
    ) => {
        const rs: Response[] = [];
        questions.forEach(q => {
            if (answers[q.id]) {
                const answer = answers[q.id] as number;
                rs.push({
                    question: q,
                    answer,
                    score: Math.round((answer / 7) * 100),
                    domain: domainsMap[q.domainId || ''],
                });
            }
        });
        return rs.sort((a, b) => b.score - a.score);
    };

    useEffect(() => {
        async function loadQuestionAnswers() {
            const qs = await fetchQuestions().then(res => res.filter(q => q.type === 'rating'));
            setQuestions(qs);
            setAnswers(results.answers);
        }

        if (results) {
            loadQuestionAnswers();
        }
    }, [results]);

    useEffect(() => {
        if (questions.length > 0 && Object.keys(answers).length > 0) {
            setResponses(mapResponses(questions, answers, domainsMap));
        }
    }, [questions, answers, domainsMap]);

    return (
        <div className="w-full overflow-x-hidden">
            <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6">
                <div className="space-y-4">
                    <h1 className="text-xl leading-normal font-semibold md:text-3xl">Question Scores</h1>
                    <p className="text-foreground leading-relaxed">
                        The chart below shows the score on all rating questions in the assessment.
                    </p>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(domainsMap).map(([domainId, domain]) => {
                        return (
                            <div key={domainId} className="flex items-center gap-2">
                                <div
                                    className="size-3 shrink-0 rounded-full"
                                    style={{ background: domain.color }}
                                ></div>
                                <h4 className="text-sm">{domain.name}</h4>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {responses.map((response, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger>
                                <div className="bg-input relative flex items-center gap-4 rounded-md border p-2">
                                    <div
                                        className="bg-accent absolute top-0 left-0 h-full rounded-md"
                                        style={{
                                            width: `${response.score}%`,
                                        }}
                                    />
                                    <div
                                        className="z-10 size-3 shrink-0 rounded-full"
                                        style={{ background: response.domain.color }}
                                    ></div>

                                    <div className="text-primary-foreground z-10 flex-1 text-left text-sm font-medium">
                                        {response.question.title}
                                    </div>
                                    <div className="z-10 text-xs font-semibold">{response.score}%</div>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-popover border-2 p-4 text-sm shadow-lg backdrop-blur-sm"
                                borderColor={response.domain.color}
                            >
                                <div className="flex flex-col items-start justify-between gap-2">
                                    <h3 className="mb-2 font-semibold">{response.question.title}</h3>
                                    <div>{response.question.statement}</div>
                                    <div className="text-accent-foreground text-xs">
                                        {response.question.description}
                                    </div>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </div>
        </div>
    );
}
