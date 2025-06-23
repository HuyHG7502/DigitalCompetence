export type QuestionType = 'static' | 'rating' | 'select' | 'multi-select' | 'text';

export interface QuestionOption {
    icon?: string;
    value: string;
    label: string;
    extraInput?: {
        type: 'text' | 'number' | 'email';
        placeholder?: string;
        required?: boolean;
    };
}

export interface AssessmentQuestion {
    id: string;
    order: number;
    type: QuestionType;
    title: string;
    statement: string;
    description: string;
    domain: string;
    options?: QuestionOption[];
    skillId?: string;
    domainId?: string;
    required?: boolean | { min?: number; max?: number };
    completed?: boolean;
}

export type AnswerType = string | number | string[] | { value: string; extra?: string };

export type AssessmentAnswer = Record<string, AnswerType>;

export const RatingOptions = [
    { value: 1, label: 'To a very small degree' },
    { value: 2, label: 'To a small degree' },
    { value: 3, label: 'To a lesser extent' },
    { value: 4, label: 'Partially' },
    { value: 5, label: 'To some extent' },
    { value: 6, label: 'To a large extent' },
    { value: 7, label: 'To a very large extent' },
];
