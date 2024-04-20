"use client";

import { useState } from 'react';
import Link from 'next/link';

import { UserButton } from '@clerk/nextjs';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [hoveredDiv, setHoveredDiv] = useState('');

  const handleHover = (divName: string) => {
    setHoveredDiv(divName);
  };

  const handleMouseLeave = () => {
    setHoveredDiv('');
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/5 h-full bg-gray-200">
        <div className="p-8 flex flex-col gap-4">
          <div>
            <UserButton afterSignOutUrl='/' />
          </div>
          <Link legacyBehavior href="/officerdashboard/approve">
            <a
              className={`text-2xl cursor-pointer ${
                window.location.pathname === '/officerdashboard/approve' ||
                hoveredDiv === 'approve'
                  ? 'text-white bg-gray-700'
                  : 'text-black'
              }`}
              onMouseEnter={() => handleHover('approve')}
              onMouseLeave={handleMouseLeave}
            >
              Approve projects
            </a>
          </Link>
          <Link legacyBehavior href="/officerdashboard/givefeedback">
            <a
              className={`text-2xl cursor-pointer ${
                window.location.pathname === '/officerdashboard/givefeedback' ||
                hoveredDiv === 'givefeedback'
                  ? 'text-white bg-gray-700'
                  : 'text-black'
              }`}
              onMouseEnter={() => handleHover('givefeedback')}
              onMouseLeave={handleMouseLeave}
            >
              Drop feedbacks
            </a>
          </Link>
        </div>
      </div>
      <div className="w-4/5 h-full">{children}</div>
    </div>
  );
}
