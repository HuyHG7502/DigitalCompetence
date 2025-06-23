import { ChartPie, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation, useParams } from 'react-router';

interface ReportSidebarProps {
    isOpen: boolean;
    isMobile: boolean;
}

export default function ReportSidebar({ isOpen, isMobile }: ReportSidebarProps) {
    const { assessmentId } = useParams();
    const location = useLocation();

    const navLinks = [
        { label: 'Results', icon: ChartPie, href: `/report/${assessmentId}/result` },
        { label: 'Questions', icon: Info, href: `/report/${assessmentId}/questions` },
    ];

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
                        <span className={cn('truncate', isOpen || !isMobile ? 'inline' : 'hidden')}>{link.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
