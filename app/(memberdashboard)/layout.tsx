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
          <Link legacyBehavior href="/memberdashboard/newproject">
            <a
              className={`text-2xl cursor-pointer ${window.location.pathname === '/memberdashboard/newproject' ||
                hoveredDiv === 'newproject'
                  ? 'text-white bg-gray-700'
                  : 'text-black'
              }`}
              onMouseEnter={() => handleHover('newproject')}
              onMouseLeave={handleMouseLeave}
            >
              Create a project
            </a>
          </Link>
          <Link legacyBehavior href="/memberdashboard/myproject">
            <a
              className={`text-2xl cursor-pointer ${
                window.location.pathname === '/memberdashboard/myproject' ||
                hoveredDiv === 'myproject'
                  ? 'text-white bg-gray-700'
                  : 'text-black'
              }`}
              onMouseEnter={() => handleHover('myproject')}
              onMouseLeave={handleMouseLeave}
            >
              My projects
            </a>
          </Link>
          <Link legacyBehavior href="/memberdashboard/feedback">
            <a
              className={`text-2xl cursor-pointer ${
                window.location.pathname === '/memberdashboard/feedback' ||
                hoveredDiv === 'feedback'
                  ? 'text-white bg-gray-700'
                  : 'text-black'
              }`}
              onMouseEnter={() => handleHover('feedback')}
              onMouseLeave={handleMouseLeave}
            >
              Feedbacks
            </a>
          </Link>
        </div>
      </div>
      <div className="w-4/5 h-full">{children}</div>
    </div>
  );
}
