import { cn } from '@/lib/utils';

export function Loading({ className, message = 'Loading...' }: { className?: string; message?: string }) {
    return (
        <div className={cn('bg-background flex min-h-screen w-full items-center justify-center', className)}>
            <div className="flex flex-col items-center gap-4">
                <svg
                    className="text-primary-ring h-10 w-10 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-50" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-primary-foreground text-lg">{message}</span>
            </div>
        </div>
    );
}
