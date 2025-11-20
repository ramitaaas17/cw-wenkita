// components/layout/Navigation.tsx
'use client';

import type { NavLink } from '@/types';

interface NavigationProps {
  isScrolled: boolean;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

const navLinks: NavLink[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Nosotros', href: '#nosotros' },
];

export default function Navigation({ isScrolled, isMobile = false, onLinkClick }: NavigationProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    if (onLinkClick) {
      onLinkClick();
    }
  };

  const linkClassName = isMobile
    ? 'block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors'
    : `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
        isScrolled
          ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
          : 'text-white hover:bg-white/10'
      }`;

  return (
    <nav className={isMobile ? 'flex flex-col space-y-2' : 'flex space-x-2'}>
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onClick={(e) => handleClick(e, link.href)}
          className={linkClassName}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}