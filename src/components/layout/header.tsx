"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/favorites', label: 'Favorites' },
    { href: '/history', label: 'History' },
  ];

  return (
    <header className="py-4 px-6 bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-lg group-hover:scale-110 transition-transform">
            <Film className="text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold font-headline">CineMood AI</h1>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map(link => (
             <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
