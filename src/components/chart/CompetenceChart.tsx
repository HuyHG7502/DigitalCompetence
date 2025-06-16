import type { ProficiencyLevel } from '@/hooks/useCompetenceData';
import { lightenColor } from '@/utils/colorUtils';
import { getProficiencyLevel } from '@/utils/dataUtils';
import { getLevelFromScore, getSkillAngleRange, getRingPath, polarRadToCartesian } from '@/utils/radialUtils';
import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Skill {
    name: string;
    score: number;
    color: string;
    level: ProficiencyLevel;
    levels: Record<ProficiencyLevel, string>;
}

interface Domain {
    name: string;
    score: number;
    color: string;
    skills: Skill[];
}

interface CompetenceChartProps {
    domains: Domain[];
    size?: number;
    randomizeScores?: () => void;
}

const proficiencyLevelMap: Record<number, ProficiencyLevel> = {
    1: 'Foundational',
    2: 'Intermediate',
    3: 'Advanced',
    4: 'Expert',
    5: 'Master',
};

export const CompetenceChart: React.FC<CompetenceChartProps> = ({ domains, randomizeScores, size = 480 }) => {
    const [dimensions, setDimensions] = useState({
        width: size,
        height: size,
    });
    const [tooltip, setTooltip] = useState<{
        x: number;
        y: number;
        score: number;
        level: ProficiencyLevel;
        domainId?: number;
        skillId?: number;
    } | null>(null);
    const [activeSkillKey, setActiveSkillKey] = useState<string | null>(null);
    const [activeDomainKey, setActiveDomainKey] = useState<string | null>(null);
    const [baseRadius, setBaseRadius] = useState(40);

    const containerRef = useRef<HTMLDivElement>(null);
    const baseMargin = 40;
    const domainArcGap = 2;

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const w = entry.contentRect.width;
                const offset = w <= 1024 ? 40 : 240;
                const clamped = Math.min(w - offset, 600);
                setDimensions({
                    width: clamped,
                    height: clamped,
                });

                const respRadius = Math.max(20, Math.min(40, clamped / 8));
                setBaseRadius(respRadius);
            }
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!randomizeScores) return;
        const interval = setInterval(() => {
            randomizeScores();
        }, 3000);
        return () => clearInterval(interval);
    }, [randomizeScores]);

    const { ringStep, arcInnerRadius, arcOuterRadius, chartRadius } = useMemo(() => {
        const chartRadius = dimensions.width / 2;
        const ringStep = Math.max(0, (chartRadius - baseRadius - baseMargin) / 5);
        const arcInnerRadius = baseRadius + 5 * ringStep + 15;
        const arcOuterRadius = arcInnerRadius + 5;

        return { ringStep, arcInnerRadius, arcOuterRadius, chartRadius };
    }, [dimensions.width, baseRadius]);

    const handleMouseEnter = (
        e: React.MouseEvent,
        domainId: number | undefined,
        skillId: number | undefined,
        score: number,
        level: ProficiencyLevel
    ) => {
        setTooltip({
            x: e.clientX,
            y: e.clientY,
            score: score,
            domainId: domainId,
            skillId: skillId,
            level: level,
        });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    return (
        <div ref={containerRef} className="relative col-span-2 flex w-full max-w-screen justify-center">
            <svg
                width={dimensions.width}
                height={dimensions.height}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            >
                <defs>
                    {domains.map(domain =>
                        domain.skills.map(skill => {
                            const gradientId = `gradient-${domain.name}-${skill.name}`.replace(/\s+/g, '-');
                            return (
                                <radialGradient
                                    key={gradientId}
                                    id={gradientId}
                                    cx="50%"
                                    cy="50%"
                                    r="80%"
                                    fx="50%"
                                    fy="50%"
                                >
                                    <stop offset="0%" stopColor={domain.color} />
                                    <stop offset="100%" stopColor={lightenColor(domain.color, 40)} />
                                </radialGradient>
                            );
                        })
                    )}
                </defs>

                <defs>
                    {domains.map((_, index) => {
                        const totalDomains = domains.length;
                        const domainAngle = (2 * Math.PI) / totalDomains;
                        const labelArcGap = (domainArcGap * Math.PI) / 180;
                        const textRadius = arcOuterRadius + 10;

                        const rawStartAngle = index * domainAngle;
                        const rawEndAngle = rawStartAngle + domainAngle;

                        const startAngle = rawStartAngle + labelArcGap / 2 - Math.PI / 2;
                        const endAngle = rawEndAngle - labelArcGap / 2 - Math.PI / 2;

                        const pathStart = polarRadToCartesian(chartRadius, chartRadius, textRadius, startAngle);
                        const pathEnd = polarRadToCartesian(chartRadius, chartRadius, textRadius, endAngle);
                        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

                        return (
                            <path
                                key={`domain-label-path-${index}`}
                                id={`domain-label-path-${index}`}
                                d={`M ${pathStart.x} ${pathStart.y} A ${textRadius} ${textRadius} 0 ${largeArcFlag} 1 ${pathEnd.x} ${pathEnd.y}`}
                                fill="none"
                            />
                        );
                    })}
                </defs>

                {/* Rings */}
                {[1, 2, 3, 4, 5].map(level => (
                    <circle
                        key={level}
                        cx={chartRadius}
                        cy={chartRadius}
                        r={baseRadius + level * ringStep}
                        fill="#ffffff"
                        stroke="#eeeeee"
                        strokeWidth={1}
                        opacity={0.1}
                    />
                ))}

                {domains.map((_, index) => {
                    const angle = (index * 2 * Math.PI) / domains.length - Math.PI / 2;
                    const outerPoint = polarRadToCartesian(chartRadius, chartRadius, dimensions.width / 2, angle);

                    return (
                        <line
                            key={index}
                            x1={chartRadius}
                            y1={chartRadius}
                            x2={outerPoint.x}
                            y2={outerPoint.y}
                            stroke="#eeeeee"
                            strokeWidth={1}
                            opacity={0.3}
                        />
                    );
                })}

                {/* Domain Arcs */}
                {domains.map((domain, index) => {
                    const totalDomains = domains.length;
                    const domainAngle = 360 / totalDomains;

                    const rawStartAngle = index * domainAngle;
                    const rawEndAngle = rawStartAngle + (domain.score / 100) * domainAngle;

                    // Apply buffer
                    const startAngle = rawStartAngle + domainArcGap;
                    const endAngle = rawEndAngle - domainArcGap;

                    const bgPath = getRingPath(
                        chartRadius,
                        chartRadius,
                        arcInnerRadius,
                        arcOuterRadius,
                        startAngle,
                        rawStartAngle + domainAngle - domainArcGap
                    );
                    const path = getRingPath(
                        chartRadius,
                        chartRadius,
                        arcInnerRadius,
                        arcOuterRadius,
                        startAngle,
                        endAngle
                    );

                    return (
                        <React.Fragment key={domain.name}>
                            <path key={`domain-bg-${domain.name}`} d={bgPath} fill="#999999" opacity={0.85} />
                            <path
                                key={`domain-arc-${domain.name}`}
                                d={path}
                                fill={domain.color}
                                opacity={0.85}
                                style={{
                                    transition: 'all 0.5s ease',
                                }}
                            />
                        </React.Fragment>
                    );
                })}

                {domains.map((domain, index) => (
                    <text key={`label-${domain.name}`} fill="#ffffff" fontSize="11" fontWeight="bold">
                        <textPath
                            className="hidden cursor-default md:block"
                            href={`#domain-label-path-${index}`}
                            startOffset="50%"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            onMouseEnter={e => {
                                const level = getProficiencyLevel(domain.score);
                                setActiveDomainKey(domain.name);
                                handleMouseEnter(e, index, undefined, domain.score, level);
                            }}
                            onMouseLeave={() => {
                                setActiveDomainKey(null);
                                handleMouseLeave();
                            }}
                        >
                            {domain.name}
                        </textPath>
                    </text>
                ))}

                {/* Domain Segments */}
                {domains.map((domain, domainIndex) => {
                    const isActive = activeDomainKey === domain.name;

                    const angle = 360 / domains.length;
                    const startAngle = angle * domainIndex;
                    const endAngle = startAngle + angle;

                    const path = getRingPath(chartRadius, chartRadius, 0, baseRadius, startAngle, endAngle);

                    return (
                        <path
                            key={domain.name}
                            d={path}
                            fill={`${domain.color}`}
                            opacity={isActive ? 1 : 0.8}
                            stroke={isActive ? domain.color : '#45556c'}
                            strokeWidth={isActive ? 2 : 1}
                            className="hover:opacity-80"
                            style={{
                                filter: isActive ? 'drop-shadow(0 0 4px rgba(0,0,0,0.5))' : undefined,
                                cursor: 'pointer',
                                transition: 'all 0.5s ease',
                            }}
                            onMouseEnter={e => {
                                const level = getProficiencyLevel(domain.score);
                                setActiveDomainKey(domain.name);
                                handleMouseEnter(e, domainIndex, undefined, domain.score, level);
                            }}
                            onMouseLeave={() => {
                                setActiveDomainKey(null);
                                handleMouseLeave();
                            }}
                        />
                    );
                })}

                {/* Skill Segments */}
                {domains.map((domain, domainIndex) => (
                    <g key={domain.name} style={{ transition: 'all 0.5s ease-in-out' }}>
                        {domain.skills.map((skill, skillIndex) => {
                            const level = getLevelFromScore(skill.score);
                            const inner = baseRadius;
                            const outer = baseRadius + level * ringStep;
                            const [startAngle, endAngle] = getSkillAngleRange(
                                domainIndex,
                                skillIndex,
                                domains.length,
                                domain.skills.length
                            );

                            const path = getRingPath(chartRadius, chartRadius, inner, outer, startAngle, endAngle);
                            const gradientId = `gradient-${domain.name}-${skill.name}`.replace(/\s+/g, '-');

                            const skillKey = `${domain.name}-${skill.name}`;
                            const isActive = activeSkillKey === skillKey;

                            return (
                                <path
                                    key={skillKey}
                                    d={path}
                                    fill={`url(#${gradientId})`}
                                    opacity={isActive ? 1 : 0.8}
                                    stroke={isActive ? domain.color : '#45556c'}
                                    strokeWidth={isActive ? 2 : 1}
                                    style={{
                                        filter: isActive ? `drop-shadow(0 0 4px ${domain.color})` : undefined,
                                        cursor: 'pointer',
                                        transition: 'all 0.5s ease-in-out',
                                    }}
                                    onMouseEnter={e => {
                                        setActiveSkillKey(skillKey);
                                        handleMouseEnter(
                                            e,
                                            domainIndex,
                                            skillIndex,
                                            skill.score,
                                            proficiencyLevelMap[level]
                                        );
                                    }}
                                    onMouseLeave={() => {
                                        setActiveSkillKey(null);
                                        handleMouseLeave();
                                    }}
                                />
                            );
                        })}
                    </g>
                ))}
            </svg>
            {tooltip && (
                <div
                    className="animate-in slide-in-from-bottom pointer-events-none absolute inset-0 z-10 flex h-fit w-full max-w-[320px] rounded-xl border-2 bg-slate-900 p-4 text-sm shadow-lg backdrop-blur-sm md:max-w-sm"
                    style={{
                        top: tooltip.y - (containerRef.current?.getBoundingClientRect().top || 0) + 10,
                        left: tooltip.x - (containerRef.current?.getBoundingClientRect().left || 0) + 10,
                        borderColor: domains[tooltip.domainId || 0].color,
                    }}
                >
                    {(() => {
                        const domain = domains[tooltip.domainId || 0];

                        if (tooltip.skillId === undefined) {
                            return (
                                <>
                                    <div className="flex flex-col items-start justify-between gap-2">
                                        <h3 className="mb-2 font-semibold">{domain.name}</h3>
                                        <div className="text-slate-300"></div>
                                        <div className="flex items-center gap-3">
                                            <div className="font-bold text-blue-400">{tooltip.score}%</div>
                                            <div
                                                className="rounded-sm border bg-gray-800 px-2 py-1 text-xs font-semibold text-white"
                                                style={{ borderColor: domain.color }}
                                            >
                                                {tooltip.level}
                                            </div>
                                        </div>
                                        {/* TODO: Add domain-level description here */}
                                        <div className="text-xs text-slate-300"></div>
                                    </div>
                                </>
                            );
                        }

                        const skill = domain.skills[tooltip.skillId];

                        return (
                            <>
                                <div className="flex flex-col items-start justify-between gap-2">
                                    <h3 className="mb-2 font-semibold">{skill.name}</h3>
                                    {/* TODO: Add skill description here */}
                                    <div className="text-slate-300"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="font-bold text-blue-400">{tooltip.score}%</div>
                                        <div
                                            className="rounded-sm border bg-gray-800 px-2 py-1 text-xs font-semibold text-white"
                                            style={{ borderColor: domain.color }}
                                        >
                                            {tooltip.level}
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-300">{skill.levels[tooltip.level]}</div>
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};
