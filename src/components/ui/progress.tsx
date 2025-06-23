import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

function Progress({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn('bg-primary/25 relative h-2 w-full overflow-hidden rounded-full', className)}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className={cn(
                    'h-full w-full flex-1 transition-all',
                    value && value >= 80
                        ? 'bg-success'
                        : value && value >= 60
                          ? 'bg-primary'
                          : value && value >= 40
                            ? 'bg-yellow-500'
                            : value && value >= 20
                              ? 'bg-orange-500'
                              : 'bg-destructive'
                )}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };
