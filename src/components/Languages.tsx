import { cn } from '@/lib/utils';
import { useState } from 'react';

const languages = [
    { code: 'sh', label: 'English' },
    { code: 'vn', label: 'Tiếng Việt' },
];

export function Languages() {
    const [selected, setSelected] = useState(languages[0].code);

    return (
        <div className="flex items-center justify-center gap-2 lg:justify-start">
            {languages.map(lang => (
                <button
                    key={lang.code}
                    className={cn(
                        'transition-transform hover:scale-110',
                        selected === lang.code ? 'opacity-100' : 'opacity-75'
                    )}
                    title={lang.label}
                    onClick={() => setSelected(lang.code)}
                >
                    <img
                        aria-label={lang.label}
                        src={`/digital-competence/assets/flags/${lang.code}.svg`}
                        alt={lang.label}
                        className="size-6"
                    />
                </button>
            ))}
        </div>
    );
}
