import { cn } from '@/lib/utils';
import { Check, CircleDot, Mars, Venus, X } from 'lucide-react';
import type { ReactNode } from 'react';

const IconMap: Record<string, ReactNode> = {
    yes: <Check className="size-6 shrink-0" />,
    no: <X className="size-6 shrink-0" />,
    male: <Mars className="size-6 shrink-0" />,
    female: <Venus className="size-6 shrink-0" />,
    default: <CircleDot className="size-6 shrink-0" />,
    none: <></>,
};

interface OptionProps {
    onClick?: () => void;
    icon?: string;
    children?: ReactNode;
    className?: string;
    selected?: boolean;
    disabled?: boolean;
}

export const Option: React.FC<OptionProps> = ({ onClick, icon = '', children, className, selected, disabled }) => {
    return (
        <div
            onClick={disabled ? undefined : onClick}
            className={cn(
                'text-primary-foreground flex w-full cursor-pointer items-center gap-3 rounded border p-2 text-xs transition-colors md:text-sm',
                selected ? 'border-primary-ring bg-primary-ring/50' : 'border-input bg-input hover:bg-input/50',
                disabled && 'cursor-not-allowed opacity-50',
                className
            )}
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-pressed={selected}
        >
            {icon && IconMap[icon]}
            <span className="flex-1">{children}</span>
        </div>
    );
};
