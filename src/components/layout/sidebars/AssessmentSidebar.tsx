import type { AssessmentContextType } from '@/contexts/assessment/AssessmentContext';
import type { AssessmentQuestion } from '@/types/assessment';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentSidebarProps {
    ctx: AssessmentContextType;
    isOpen: boolean;
    isMobile: boolean;
}

export default function AssessmentSidebar({ ctx, isOpen, isMobile }: AssessmentSidebarProps) {
    const { questions, currentQuestionIndex, furthestQuestionIndex, onQuestionChange } = ctx;

    const completed = questions.filter((q: AssessmentQuestion) => q.completed).length;
    const total = questions.length;
    const progress = total ? (completed / total) * 100 : 0;

    const shown = questions.slice(0, furthestQuestionIndex + 1);

    return (
        <>
            <div className={cn('border-border border-b py-4', isOpen || !isMobile ? 'px-2' : 'px-1')}>
                {isOpen || !isMobile ? (
                    <div className="my-2 space-y-3 px-1">
                        <h3 className="text-accent text-sm font-bold">Progress</h3>
                        <div className="flex justify-between text-xs">
                            <span>Completed</span>
                            <span>
                                {completed}/{total}
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                ) : (
                    <div
                        className={cn(
                            'text-center text-xs font-semibold',
                            progress >= 80
                                ? 'text-green-500'
                                : progress >= 60
                                  ? 'text-blue-500'
                                  : progress >= 40
                                    ? 'text-yellow-500'
                                    : progress >= 20
                                      ? 'text-orange-500'
                                      : progress == 0
                                        ? 'text-gray-200'
                                        : 'text-red-500'
                        )}
                    >
                        {progress.toFixed(1)}
                    </div>
                )}
            </div>
            <div className="px-1 py-2">
                <div className="max-h-100 space-y-1 overflow-y-auto">
                    {shown.map((question: AssessmentQuestion, index: number) => {
                        const isCurrent = index === currentQuestionIndex;
                        const isCompleted =
                            question.type === 'static' ? furthestQuestionIndex > index : question.completed;
                        return (
                            <button
                                key={question.id}
                                onClick={e => {
                                    e.stopPropagation();
                                    onQuestionChange(question.id);
                                }}
                                className={`flex w-full items-center gap-3 rounded p-1 text-left transition-colors ${
                                    isCurrent
                                        ? 'bg-sidebar-primary text-white'
                                        : isCompleted
                                          ? 'text-sidebar-accent-foreground hover:bg-sidebar-accent'
                                          : 'text-sidebar-ring hover:bg-sidebar-accent'
                                }`}
                            >
                                <div className="flex size-6 flex-shrink-0 items-center justify-center">
                                    {isCompleted ? (
                                        <Check className="text-success size-4" />
                                    ) : (
                                        <div
                                            className={`size-3 rounded-full border-2 ${
                                                isCurrent ? 'border-primary-ring' : 'border-ring'
                                            }`}
                                        />
                                    )}
                                </div>
                                <span className="flex-1 truncate text-xs">{question.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
