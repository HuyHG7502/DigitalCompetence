import { Link, useLocation } from 'react-router-dom';
import { Info, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const navLinks = [
    { label: 'Home', icon: Play, href: '/' },
    {
        label: 'What is Digital Competence?',
        icon: Info,
        href: '/info',
    },
];

export default function Sidebar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) setIsOpen(prev => !prev);
    };

    return (
        <>
            {/* Overlay when Open on mobile */}
            {isMobile && isOpen && (
                <div className="bg-opacity-30 fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            )}

            <aside
                onClick={toggleSidebar}
                className={cn(
                    'z-40 shrink-0 border-r border-slate-800 bg-slate-900 transition-all duration-300',
                    'flex flex-col justify-start',
                    isMobile
                        ? cn('fixed top-0 left-0 h-full', isOpen ? 'w-[240px]' : 'w-[40px]')
                        : 'relative min-h-screen w-[240px]'
                )}
            >
                {/* Top Logo & Label */}
                <div className="my-4 flex flex-col items-center gap-2 py-4">
                    <div className="flex size-6 items-center justify-center rounded-full border-2 border-blue-400 lg:size-12">
                        <div className="size-4 rounded-full bg-gradient-to-br from-green-400 to-blue-500 lg:size-6" />
                    </div>
                    <div className={cn('text-sm font-bold text-gray-300', isOpen || !isMobile ? 'block' : 'hidden')}>
                        Digital Competence
                    </div>
                </div>

                <hr className="text-slate-700" />

                <nav className={cn('my-4 flex flex-col gap-2', isOpen ? 'px-2' : 'px-0')}>
                    {navLinks.map(link => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={cn(
                                    'nav-link flex items-center rounded py-2 text-sm text-slate-300 hover:bg-slate-700',
                                    isActive && 'bg-slate-700 text-white',
                                    isOpen || !isMobile ? 'justify-start gap-2 px-2' : 'justify-center'
                                )}
                            >
                                <Icon className="size-4 shrink-0" />
                                <span className={cn('truncate', isOpen || !isMobile ? 'inline' : 'hidden')}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
