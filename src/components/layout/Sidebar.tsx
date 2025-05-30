import { useLocation } from "react-router";
import { Info, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", icon: Play, href: "/" },
  {
    label: "What is Digital Competence?",
    icon: Info,
    href: "/what-is-digital-competence",
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="min-h-screen bg-slate-900 flex flex-col justify-start border-r border-slate-800 w-[40px] lg:w-[240px] shrink-0">
      {/* Top Logo & Nav */}
      <div className="flex flex-col items-center gap-2 py-4 my-4">
        <div className="size-6 lg:size-12 rounded-full border-2 border-blue-400 flex items-center justify-center">
          <div className="size-4 lg:size-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div>
        </div>
        <div className="text-sm text-gray-300 font-bold leading-normal hidden lg:block">
          Digital Competence
        </div>
      </div>
      <hr className="text-slate-700" />
      <nav className="flex flex-col gap-2 my-4 lg:px-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link",
                location.pathname === link.href && "bg-slate-700 text-white",
                "justify-center lg:justify-start"
              )}
            >
              <Icon className="size-4" />
              <span className="hidden lg:inline">{link.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
