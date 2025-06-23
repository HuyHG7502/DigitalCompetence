import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Option } from '@/components/assessment/Option';
import { AssessmentContext } from '@/contexts/assessment/AssessmentContext';
import { useData } from '@/hooks/useData';
import { cn } from '@/lib/utils';
import { saveResults } from '@/services/assessmentService';
import { RatingOptions, type AnswerType, type AssessmentQuestion } from '@/types/assessment';
import { calculateResults } from '@/utils/reportUtils';
import { Check, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { isValidEmail } from '@/utils/dataUtils';
import { Loading } from '@/components/loading/Loading';
import { useNavigate } from 'react-router-dom';

export default function AssessmentPage() {
    const navigate = useNavigate();
    const ctx = useContext(AssessmentContext);
    const { domains, skills } = useData();
    const {
        assessmentId,
        questions,
        answers,
        currentQuestionId,
        currentQuestionIndex,
        onQuestionChange,
        onAnswer,
        isLoading,
        isCompleted,
    } = ctx!;

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    // For answers
    const [selectedText, setSelectedText] = useState<string>('');
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const [extraInput, setExtraInput] = useState<string>('');

    const isAnswered = (answer: AnswerType, isConfirmed: boolean = true) => {
        if (!currentQuestion) return false;
        switch (currentQuestion.type) {
            case 'static':
                return true;
            case 'multi-select': {
                if (!Array.isArray(answer)) return false;
                if (!isConfirmed) return answer.length > 0;
                const min =
                    typeof currentQuestion.required === 'object'
                        ? currentQuestion.required.min || 1
                        : currentQuestion.required
                          ? 1
                          : 0;
                const max =
                    typeof currentQuestion.required === 'object'
                        ? currentQuestion.required.max || Infinity
                        : currentQuestion.required
                          ? Infinity
                          : 0;
                return answer.length >= min && answer.length <= max;
            }
            case 'select':
                if (typeof answer === 'object' && answer && 'value' in answer) {
                    const { value, extra } = answer as { value: string; extra?: string };
                    const opt = currentQuestion.options?.find(o => o.value === value);
                    if (opt?.extraInput && isConfirmed) {
                        if (opt.extraInput.type === 'email') {
                            return !!extra && isValidEmail(extra);
                        }
                        if (opt.extraInput.required) {
                            return !!extra && extra !== '';
                        }
                    }
                    return !!value;
                }
                return typeof answer === 'string' && answer !== '';
            default:
                if (typeof currentQuestion.required === 'boolean' && !currentQuestion.required) {
                    return true;
                }
                return answer !== undefined && answer !== null && answer !== '' && answer !== 0;
        }
    };

    // Loading existing answer
    useEffect(() => {
        if (!currentQuestion) return;

        const answer = answers[currentQuestion.id];
        switch (currentQuestion.type) {
            case 'rating':
                setSelectedRating(typeof answer === 'number' ? answer : 0);
                break;
            case 'select':
                if (typeof answer === 'object' && answer && 'extra' in answer) {
                    setSelectedOption(answer.value);
                    setExtraInput(answer.extra || '');
                } else {
                    setSelectedOption(typeof answer === 'string' ? answer : '');
                }
                break;
            case 'multi-select':
                setSelectedOptions(Array.isArray(answer) ? answer : []);
                break;
            case 'text':
                setSelectedText(typeof answer === 'string' ? answer : '');
                break;
            case 'static':
            default:
                break;
        }
    }, [currentQuestionId, currentQuestion, answers]);

    const handleRatingSelect = (rating: number) => {
        setSelectedRating(rating);
        onAnswer(currentQuestion.id, rating);
    };

    const handleSelect = (option: string) => {
        if (selectedOption !== option) {
            setSelectedOption(option);
            const currentOption = currentQuestion.options?.find(o => o.value === option);
            if (currentOption?.extraInput) {
                onAnswer(currentQuestion.id, {
                    value: option,
                    extra: extraInput || '',
                });
            } else {
                onAnswer(currentQuestion.id, option);
            }
        }
    };

    const handleMultiSelect = (option: string) => {
        const updated = selectedOptions.includes(option)
            ? selectedOptions.filter(o => o !== option)
            : [...selectedOptions, option];
        setSelectedOptions(updated);
        onAnswer(currentQuestion.id, updated);
    };

    const handleTextChange = (value: string) => {
        setSelectedText(value);
        onAnswer(currentQuestion.id, value);
    };

    const handleExtraInput = (value: string) => {
        setExtraInput(value);
        onAnswer(currentQuestion.id, {
            value: selectedOption,
            extra: value,
        });
    };

    // Navigation handlers
    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            onQuestionChange(questions[currentQuestionIndex + 1].id);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            onQuestionChange(questions[currentQuestionIndex - 1].id);
        }
    };

    const handleComplete = async () => {
        const qs = questions.filter(q => q.type == 'rating');
        const results = calculateResults(qs, answers, skills, domains);

        await saveResults(assessmentId, results);
        navigate(`/report/${assessmentId}`);
    };

    const renderQuestion = (question: AssessmentQuestion) => {
        switch (question.type) {
            case 'rating':
                return (
                    <div className="my-4">
                        <div className="grid h-20 grid-cols-7 items-center justify-items-center gap-2 lg:gap-8">
                            {RatingOptions.map(option => (
                                <Tooltip key={option.value}>
                                    <TooltipTrigger>
                                        <Star
                                            onClick={() => handleRatingSelect(option.value)}
                                            className={cn(
                                                'hover:text-secondary-ring hover:fill-secondary-ring size-6 cursor-pointer lg:size-12',
                                                option.value === selectedRating || option.value < (selectedRating ?? 0)
                                                    ? 'fill-primary-ring text-primary-ring'
                                                    : 'fill-muted text-muted',
                                                option.value === selectedRating ? 'scale-125' : ''
                                            )}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>{option.label}</TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                );
            case 'select':
                return (
                    <div
                        className={cn(
                            'my-4 w-full',
                            currentQuestion.options!.length > 7
                                ? 'grid grid-cols-2 gap-2 md:grid-cols-4'
                                : 'flex flex-col gap-2 lg:w-3/4'
                        )}
                    >
                        {question.options?.map(opt => (
                            <Option
                                className={
                                    currentQuestion.options!.length > 7 ? 'h-24 text-center' : 'h-auto text-left'
                                }
                                key={opt.value}
                                selected={selectedOption === opt.value}
                                icon={opt.icon}
                                onClick={() => {
                                    if (selectedOption !== opt.value) {
                                        handleSelect(opt.value);
                                    }
                                }}
                            >
                                {opt.label}
                                {opt.extraInput && (
                                    <Input
                                        className="placeholder:text-accent bg-accent-foreground border-accent-foreground text-accent mt-2"
                                        type={opt.extraInput.type}
                                        placeholder={opt.extraInput.placeholder}
                                        value={extraInput}
                                        onChange={e => handleExtraInput(e.target.value)}
                                        required={opt.extraInput.required}
                                        disabled={selectedOption !== opt.value}
                                    />
                                )}
                            </Option>
                        ))}
                    </div>
                );
            case 'multi-select':
                return (
                    <div
                        className={cn(
                            'my-4 w-full',
                            currentQuestion.options!.length > 7
                                ? 'grid grid-cols-2 gap-2 md:grid-cols-4'
                                : 'flex flex-col gap-2 lg:w-3/4'
                        )}
                    >
                        {question.options?.map(opt => (
                            <Option
                                className={
                                    currentQuestion.options!.length > 7 ? 'h-24 text-center' : 'h-auto text-left'
                                }
                                key={opt.value}
                                selected={selectedOptions.includes(opt.value)}
                                icon={opt.icon}
                                onClick={() => handleMultiSelect(opt.value)}
                            >
                                {opt.label}
                                {opt.extraInput && (
                                    <Input
                                        className="placeholder:text-accent bg-accent-foreground border-accent-foreground text-accent mt-2"
                                        type={opt.extraInput.type}
                                        placeholder={opt.extraInput.placeholder}
                                        value={extraInput}
                                        onClick={e => e.stopPropagation()}
                                        onChange={e => handleExtraInput(e.target.value)}
                                        required={opt.extraInput.required}
                                        disabled={!selectedOptions.includes(opt.value)}
                                    />
                                )}
                            </Option>
                        ))}
                    </div>
                );
            case 'text':
                return (
                    <div className="my-4 w-full space-y-2 lg:w-3/4">
                        <Label htmlFor="text-input">{currentQuestion.title}</Label>
                        <Input
                            id="text-input"
                            type="text"
                            className="bg-accent-foreground text-accent w-full"
                            value={selectedText}
                            onChange={e => handleTextChange(e.target.value)}
                        />
                    </div>
                );
            case 'static':
            default:
                return null;
        }
    };

    const renderAnswerLabel = (question: AssessmentQuestion, answer: AnswerType): string => {
        if (question.type === 'static') return 'I have read and understood the instructions.';
        if (!answer) return '';
        switch (question.type) {
            case 'rating':
                return typeof answer === 'number'
                    ? RatingOptions[answer - 1]?.label || answer.toString()
                    : answer.toString();
            case 'select':
                if (typeof answer === 'object' && answer !== null && 'value' in answer) {
                    const { value, extra } = answer as { value: string; extra?: string };
                    const optLabel = question.options?.find(o => o.value === value)?.label || value;

                    const opt = currentQuestion.options?.find(o => o.value === value);
                    if (opt?.extraInput) {
                        if (opt.extraInput.type === 'email') {
                            return !!extra && isValidEmail(extra) ? extra : 'Invalid email';
                        }
                    }
                    return extra ? extra : optLabel;
                }
                return typeof answer === 'string'
                    ? question.options?.find(o => o.value === answer)?.label || answer
                    : '';
            case 'multi-select':
                if (!Array.isArray(answer)) return '';
                return answer.map(opt => question.options?.find(o => o.value === opt)?.label || opt).join(', ');
            case 'text':
                return typeof answer === 'string' ? answer : answer.toString();
            default:
                return '';
        }
    };

    if (isLoading || !currentQuestion) {
        return <Loading message="Preparing Assessment..." />;
    }

    return (
        <div className="w-full overflow-x-hidden">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 text-center sm:px-6">
                <div className="flex grow flex-col">
                    {/* Question Header */}
                    <h1 className="border-border bg-input rounded-sm border py-2 text-2xl">{currentQuestion.title}</h1>
                    <div className="flex w-fit flex-1 flex-col items-center justify-center self-center md:w-2xl">
                        <div className="my-4 space-y-2">
                            <p className="text-muted-foreground text-lg">{currentQuestion.statement}</p>
                            <p className={cn('text-accent-foreground leading-relaxed whitespace-pre-wrap')}>
                                {currentQuestion.description}
                            </p>
                        </div>

                        {renderQuestion(currentQuestion)}

                        {/* Answer Confirmation */}
                        <div
                            className={cn(
                                'my-4 flex min-h-10 w-full justify-center rounded-sm px-4 py-2',
                                isAnswered(answers[currentQuestion.id], false) ? 'bg-input' : ''
                            )}
                        >
                            {isAnswered(answers[currentQuestion.id], false) && (
                                <div
                                    className={cn(
                                        'flex items-center justify-center gap-2 text-sm font-semibold md:text-base',
                                        isAnswered(answers[currentQuestion.id]) ? 'text-success' : 'text-destructive'
                                    )}
                                >
                                    {isAnswered(answers[currentQuestion.id]) ? (
                                        <Check className="size-6 shrink-0" />
                                    ) : (
                                        <X className="size-6 shrink-0" />
                                    )}
                                    <span className="line-clamp-2">
                                        {renderAnswerLabel(currentQuestion, answers[currentQuestion.id])}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            {isCompleted ? (
                                <div className="text-muted-foreground text-sm">
                                    Assessment completed. You can only review your answers now.
                                </div>
                            ) : (
                                <Button
                                    onClick={() => {
                                        if (currentQuestion.type === 'static') {
                                            onAnswer(currentQuestion.id, 'acknowledged');
                                        } else {
                                            onAnswer(currentQuestion.id, answers[currentQuestion.id]);
                                        }

                                        if (currentQuestionIndex === totalQuestions - 1) {
                                            handleComplete();
                                        } else {
                                            handleNext();
                                        }
                                    }}
                                    disabled={!isAnswered(answers[currentQuestion.id])}
                                    className="hover:bg-blue-700 md:order-3"
                                >
                                    {currentQuestionIndex === totalQuestions - 1 ? 'Complete' : 'Confirm and Continue'}
                                    <ChevronRight className="size-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <footer className="border-border mt-8 border-t p-4">
                    <div className="mx-auto flex flex-wrap items-center justify-between gap-2">
                        <div className="w-full text-center md:order-2 md:w-auto">
                            <div className="text-muted-foreground text-sm">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </div>
                            <div className="text-muted text-xs">{currentQuestion.domain}</div>
                        </div>
                        <Button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="bg-ring hover:bg-muted md:order-1"
                        >
                            <ChevronLeft className="size-4" />
                            Previous
                        </Button>

                        <Button
                            onClick={handleNext}
                            disabled={!isAnswered || currentQuestionIndex === totalQuestions - 1}
                            className="hover:bg-blue-700 md:order-3"
                        >
                            Next
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </footer>
            </div>
        </div>
    );
}
