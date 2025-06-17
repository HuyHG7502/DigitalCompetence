export function lightenColor(hex: string, percent: number): string {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map(x => x + x)
            .join('');
    }
    const num = parseInt(hex, 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;

    r = Math.round(r + (255 - r) * (percent / 100));
    g = Math.round(g + (255 - g) * (percent / 100));
    b = Math.round(b + (255 - b) * (percent / 100));

    const toHex = (x: number) => x.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function interpolateColor(hex1: string, hex2: string, percent: number): string {
    // Remove hash and expand shorthand
    const expand = (hex: string) =>
        hex.length === 3
            ? hex
                  .split('')
                  .map(x => x + x)
                  .join('')
            : hex;
    hex1 = expand(hex1.replace('#', ''));
    hex2 = expand(hex2.replace('#', ''));

    const num1 = parseInt(hex1, 16);
    const num2 = parseInt(hex2, 16);

    const r1 = (num1 >> 16) & 255;
    const g1 = (num1 >> 8) & 255;
    const b1 = num1 & 255;

    const r2 = (num2 >> 16) & 255;
    const g2 = (num2 >> 8) & 255;
    const b2 = num2 & 255;

    const r = Math.round(r1 + (r2 - r1) * (percent / 100));
    const g = Math.round(g1 + (g2 - g1) * (percent / 100));
    const b = Math.round(b1 + (b2 - b1) * (percent / 100));

    const toHex = (x: number) => x.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const domainColors = ['#cc0001', '#fb940b', '#ffff01', '#01cc00', '#03c0c6', '#0000fe', '#762ca7', '#fe98bf'];

export function mapDomainColors<T extends { id: string }>(domains: T[]): (T & { color: string })[] {
    return domains.map((domain, i) => ({
        ...domain,
        color: domainColors[i % domainColors.length],
    }));
}

export function mapDomainGradient(hex: string): string {
    const hex2 = domainColors[domainColors.indexOf(hex) + 1] || domainColors[0];
    return interpolateColor(hex, hex2, 50);
}
