import type { AnswerType, AssessmentAnswer, AssessmentQuestion } from '@/types/assessment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchProgress, fetchQuestions, saveProgress, startAssessment } from '@/services/assessmentService';
import { AssessmentContext } from './AssessmentContext';
import { useData } from '@/hooks/useData';

export const AssessmentProvider: React.FC<{ children: React.ReactNode; assessmentId: string }> = ({
    children,
    assessmentId,
}) => {
    const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
    const [answers, setAnswers] = useState<AssessmentAnswer>({});
    const [currentQuestionId, setCurrentQuestionId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);

    const { domainsMap, isLoading: isDomainsLoading } = useData();

    useEffect(() => {
        async function load() {
            if (isDomainsLoading) return;
            const qs = await fetchQuestions().then(qs => {
                return qs.map(q => ({
                    ...q,
                    domain: q.domainId ? domainsMap[q.domainId]?.name || q.domain : q.domain,
                }));
            });
            setQuestions(qs.sort((a, b) => (a.order ?? 1000) - (b.order ?? 1000)));
            if (assessmentId) {
                const progress = await fetchProgress(assessmentId);
                if (progress) {
                    setQuestions(prev => prev.map(q => ({ ...q, completed: progress.answers[q.id] !== undefined })));
                    setAnswers(progress.answers || {});
                    setCurrentQuestionId(progress.currentQuestionId || qs[0].id);
                    setIsCompleted(progress.completedAt !== undefined);
                } else {
                    startAssessment(assessmentId);
                    setAnswers({});
                    setCurrentQuestionId(qs[0].id);
                    setIsCompleted(false);
                }
            }
            setIsLoading(false);
        }
        load();
    }, [assessmentId, domainsMap, isDomainsLoading]);

    const onAnswer = useCallback(
        (questionId: string, value: AnswerType) => {
            setAnswers(prev => {
                const updated = { ...prev, [questionId]: value };
                saveProgress(assessmentId, updated, questionId);
                return updated;
            });

            setQuestions(prev => prev.map(q => (q.id === questionId ? { ...q, completed: true } : q)));
        },
        [assessmentId]
    );

    const onQuestionChange = useCallback(
        (questionId: string) => {
            setCurrentQuestionId(questionId);
            saveProgress(assessmentId, answers, questionId);
        },
        [assessmentId, answers]
    );

    const resetAssessment = useCallback(() => {
        setQuestions(prev => prev.map(q => ({ ...q, completed: false })));
        setAnswers({});
        setCurrentQuestionId(questions[0]?.id || '');
        saveProgress(assessmentId, {}, questions[0]?.id || '');
    }, [assessmentId, questions]);

    const currentQuestionIndex = useMemo(
        () => questions.findIndex(q => q.id === currentQuestionId),
        [questions, currentQuestionId]
    );

    const answerIndices = useMemo(() => {
        return Object.keys(answers)
            .map(id => questions.findIndex(q => q.id === id))
            .filter(idx => idx >= 0);
    }, [answers, questions]);

    const furthestQuestionIndex = useMemo(
        () => Math.max(currentQuestionIndex, Math.max(-1, ...answerIndices) + 1, 0),
        [currentQuestionIndex, answerIndices]
    );

    return (
        <AssessmentContext.Provider
            value={{
                assessmentId,
                questions,
                answers,
                currentQuestionId,
                currentQuestionIndex,
                furthestQuestionIndex,
                onQuestionChange,
                onAnswer,
                resetAssessment,
                isLoading,
                isCompleted,
            }}
        >
            {children}
        </AssessmentContext.Provider>
    );
};
