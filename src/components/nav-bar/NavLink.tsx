'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}

export default function NavLink({ href, children, mobile = false, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  const baseClasses = `transition-colors ${
    isActive 
      ? 'text-[#0D69F2] font-medium' 
      : 'text-white hover:text-gray-300'
  }`;
  
  const classes = mobile
    ? `block py-2 ${baseClasses}`
    : baseClasses;
  
  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}