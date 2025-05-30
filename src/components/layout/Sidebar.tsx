import { Link, useLocation } from 'react-router-dom';
import { Info, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

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

    return (
        <aside className="flex min-h-screen w-[40px] shrink-0 flex-col justify-start border-r border-slate-800 bg-slate-900 lg:w-[240px]">
            {/* Top Logo & Nav */}
            <div className="my-4 flex flex-col items-center gap-2 py-4">
                <div className="flex size-6 items-center justify-center rounded-full border-2 border-blue-400 lg:size-12">
                    <div className="size-4 rounded-full bg-gradient-to-br from-green-400 to-blue-500 lg:size-6"></div>
                </div>
                <div className="hidden text-sm leading-normal font-bold text-gray-300 lg:block">Digital Competence</div>
            </div>
            <hr className="text-slate-700" />
            <nav className="my-4 flex flex-col gap-2 lg:px-2">
                {navLinks.map(link => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={cn(
                                'nav-link',
                                location.pathname === link.href && 'bg-slate-700 text-white',
                                'justify-center lg:justify-start'
                            )}
                        >
                            <Icon className="size-4" />
                            <span className="hidden lg:inline">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
