import type { AssessmentQuestion, AssessmentAnswer, AnswerType } from '@/types/assessment';
import { createContext } from 'react';

export interface AssessmentContextType {
    assessmentId: string;
    questions: AssessmentQuestion[];
    answers: AssessmentAnswer;
    currentQuestionId: string;
    currentQuestionIndex: number;
    furthestQuestionIndex: number;
    isLoading: boolean;
    isCompleted: boolean;
    onQuestionChange: (questionId: string) => void;
    onAnswer: (questionId: string, value: AnswerType) => void;
    resetAssessment?: () => void;
}

export const AssessmentContext = createContext<AssessmentContextType | null>(null);
