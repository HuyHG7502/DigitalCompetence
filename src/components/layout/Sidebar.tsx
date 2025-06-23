import { Link, useLocation } from 'react-router-dom';
import { Info, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContext, useEffect, useState } from 'react';
import { AssessmentContext } from '@/contexts/assessment/AssessmentContext';
import AssessmentSidebar from './sidebars/AssessmentSidebar';
import ReportSidebar from './sidebars/ReportSidebar';

export default function Sidebar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const ctx = useContext(AssessmentContext);
    const isAssessmentRoute = /^\/assessment\//.test(location.pathname);
    const isReportRoute = /^\/report\//.test(location.pathname);

    const navLinks = [
        { label: 'Home', icon: Play, href: '/' },
        {
            label: 'What is Digital Competence?',
            icon: Info,
            href: '/info',
        },
    ];

    // Detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) setIsOpen(prev => !prev);
    };

    const renderNavigation = () => {
        if (isAssessmentRoute && ctx) {
            return <AssessmentSidebar ctx={ctx} isOpen={isOpen} isMobile={isMobile} />;
        }
        if (isReportRoute) {
            return <ReportSidebar isOpen={isOpen} isMobile={isMobile} />;
        }

        return (
            <nav className={cn('my-4 flex flex-col gap-2', isOpen ? 'px-2' : 'px-1')}>
                {navLinks.map(link => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={cn(
                                'nav-link flex items-center rounded py-2 text-sm',
                                isActive
                                    ? 'bg-sidebar-primary text-white'
                                    : 'bg-sidebar text-sidebar-accent-foreground hover:bg-sidebar-accent',
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
        );
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
                    'bg-sidebar border-sidebar z-40 shrink-0 border-r transition-all duration-300',
                    'flex flex-col justify-start',
                    isMobile
                        ? cn('fixed top-0 left-0 h-full', isOpen ? 'w-[240px]' : 'w-[40px]')
                        : 'relative min-h-screen w-[240px]'
                )}
            >
                {/* Top Logo & Label */}
                <Link to="/" className="my-4 flex cursor-pointer flex-col items-center gap-2 py-4">
                    <div className="border-primary-ring flex size-6 items-center justify-center rounded-full border-2 lg:size-12">
                        <div className="size-4 rounded-full bg-gradient-to-br from-green-400 to-blue-500 lg:size-6" />
                    </div>
                    <div className={cn('text-foreground text-sm font-bold', isOpen || !isMobile ? 'block' : 'hidden')}>
                        Digital Competence
                    </div>
                </Link>

                <hr className="border-border" />

                {/* Navigation Links */}
                {renderNavigation()}
            </aside>
        </>
    );
}
