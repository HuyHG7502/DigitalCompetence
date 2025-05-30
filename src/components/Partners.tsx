const partners = [
    { name: 'UEH', src: '/assets/partners/ueh.png' },
    { name: 'ISB', src: '/assets/partners/isb.png' },
    { name: 'Monash', src: '/assets/partners/monash.png' },
    { name: 'Macquarie', src: '/assets/partners/macquarie.webp' },
    { name: 'UTS', src: '/assets/partners/uts.svg' },
    { name: 'Wollongong', src: '/assets/partners/wollongong.png' },
    { name: 'Western Sydney', src: '/assets/partners/wsu.png' },
    { name: 'Deakin', src: '/assets/partners/deakin.png' },
];

export function Partners() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start lg:gap-8">
            {partners.map(partner => (
                <img
                    key={partner.name}
                    src={partner.src}
                    alt={partner.name}
                    className="h-4 stroke-white opacity-70 transition-opacity hover:opacity-100 lg:h-6"
                />
            ))}
        </div>
    );
}
