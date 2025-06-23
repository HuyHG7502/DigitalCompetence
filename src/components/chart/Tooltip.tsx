import React from 'react';
import type { ProficiencyLevel } from '@/types/competence';
import type { ChartDomain } from '@/types/chart';

interface TooltipProps {
    tooltip: {
        x: number;
        y: number;
        score: number;
        level: ProficiencyLevel;
        domainId?: number;
        skillId?: number;
    };
    domains: ChartDomain[];
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export const Tooltip: React.FC<TooltipProps> = ({ tooltip, domains, containerRef }) => {
    const { x, y, score, level, domainId, skillId } = tooltip;

    const top = y - (containerRef.current?.getBoundingClientRect().top || 0) + 10;
    const left = x - (containerRef.current?.getBoundingClientRect().left || 0) + 10;

    const domain = domains[domainId || 0];
    const skill = skillId !== undefined ? domain.skills[skillId] : null;

    return (
        <div
            className="animate-in slide-in-from-bottom pointer-events-none absolute z-10 flex h-fit w-full max-w-[300px] rounded-xl border-2 bg-slate-900 p-4 text-sm shadow-lg backdrop-blur-sm md:max-w-sm"
            style={{
                top,
                left,
                borderColor: domain.color,
            }}
        >
            <div className="flex flex-col items-start justify-between gap-2">
                <h3 className="mb-2 font-semibold">{skill ? skill.name : domain.name}</h3>
                <div className="text-slate-300">{skill?.description || domain.description}</div>
                <div className="flex items-center gap-3">
                    <div className="font-bold text-blue-400">{score}%</div>
                    <div
                        className="rounded-sm border bg-gray-800 px-2 py-1 text-xs font-semibold text-white"
                        style={{ borderColor: domain.color }}
                    >
                        {level}
                    </div>
                </div>
                {skill && <div className="text-xs text-slate-300">{skill.levels[skill.level]}</div>}{' '}
            </div>
        </div>
    );
};
