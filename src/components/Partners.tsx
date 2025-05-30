const partners = [
    { name: 'UEH', src: 'ueh.png' },
    { name: 'ISB', src: 'isb.png' },
    { name: 'Monash', src: 'monash.png' },
    { name: 'Macquarie', src: 'macquarie.webp' },
    { name: 'UTS', src: 'uts.svg' },
    { name: 'Wollongong', src: 'wollongong.png' },
    { name: 'Western Sydney', src: 'wsu.png' },
    { name: 'Deakin', src: 'deakin.png' },
];

export function Partners() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start lg:gap-8">
            {partners.map(partner => (
                <img
                    key={partner.name}
                    src={`/DigitalCompetence/assets/partners/${partner.src}`}
                    alt={partner.name}
                    className="h-4 stroke-white opacity-70 transition-opacity hover:opacity-100 lg:h-6"
                />
            ))}
        </div>
    );
}
