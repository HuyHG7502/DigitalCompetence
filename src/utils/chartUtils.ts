export interface PolarSegment {
    x: number;
    y: number;
}

export function polarToCartesian(cx: number, cy: number, radius: number, angle: number): PolarSegment {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
        x: cx + radius * Math.cos(radians),
        y: cy + radius * Math.sin(radians),
    };
}

export function polarRadToCartesian(cx: number, cy: number, radius: number, angle: number): PolarSegment {
    return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
    };
}

export function getArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [`M ${start.x} ${start.y}`, `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`].join(' ');
}

export function getRingPath(
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
): string {
    const startOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
    const endOuter = polarToCartesian(cx, cy, outerRadius, endAngle);
    const startInner = polarToCartesian(cx, cy, innerRadius, endAngle);
    const endInner = polarToCartesian(cx, cy, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return [
        'M',
        startOuter.x,
        startOuter.y,
        'A',
        outerRadius,
        outerRadius,
        0,
        largeArcFlag,
        1,
        endOuter.x,
        endOuter.y,
        'L',
        startInner.x,
        startInner.y,
        'A',
        innerRadius,
        innerRadius,
        0,
        largeArcFlag,
        0,
        endInner.x,
        endInner.y,
        'Z',
    ].join(' ');
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function getLevelFromScore(score: number): number {
    if (score >= 80) return 5;
    if (score >= 60) return 4;
    if (score >= 40) return 3;
    if (score >= 20) return 2;
    return 1;
}

export function getDomainAngleSpan(domainCount: number): number {
    return 360 / domainCount;
}

export function getSkillAngleRange(
    domainIdx: number,
    skillIdx: number,
    domainCount: number,
    skillCount: number
): [number, number] {
    const domainAngleSpan = getDomainAngleSpan(domainCount);
    const domainStartAngle = domainAngleSpan * (domainIdx + 0.1);
    const anglePerSkill = domainAngleSpan / (skillCount + 1);
    const startAngle = domainStartAngle + anglePerSkill * skillIdx;
    const endAngle = startAngle + anglePerSkill * 0.9;
    return [startAngle, endAngle];
}

export function getGradientId(domainId: string, skillId: string): string {
    return `gradient-${domainId}-${skillId}`.replace(/\s+/g, '-');
}
