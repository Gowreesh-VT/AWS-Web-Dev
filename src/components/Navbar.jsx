import { NavLink } from 'react-router-dom';
import { Film, Heart, Clock, Sparkles } from 'lucide-react';

const links = [
    { to: '/', label: 'Discover', icon: Sparkles },
    { to: '/favourites', label: 'Favourites', icon: Heart },
    { to: '/history', label: 'History', icon: Clock },
];

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Film className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold font-[var(--font-heading)] gradient-text">
                            MoodFlix
                        </span>
                    </NavLink>

                    {/* Nav Links */}
                    <div className="flex items-center gap-1">
                        {links.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                        ? 'bg-primary/20 text-primary-light border border-primary/30'
                                        : 'text-text-muted hover:text-text hover:bg-surface-light'
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
