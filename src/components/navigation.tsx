'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, CheckSquare, MessageSquare, Briefcase, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activePage?: 'notebook' | 'todo' | 'ai-chat' | 'project' | 'pomodoro';
}

export function Navigation({ activePage }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'AI笔记本',
      icon: Book,
      active: pathname === '/' || activePage === 'notebook'
    },
    {
      href: '/todo',
      label: '待办清单',
      icon: CheckSquare,
      active: pathname === '/todo' || activePage === 'todo'
    },
    {
      href: '/project',
      label: '项目管理',
      icon: Briefcase,
      active: pathname === '/project' || pathname.startsWith('/project/') || activePage === 'project'
    },
    {
      href: '/ai-chat',
      label: 'AI对话',
      icon: MessageSquare,
      active: pathname === '/ai-chat' || activePage === 'ai-chat'
    },
    {
      href: '/pomodoro',
      label: '番茄钟',
      icon: Clock,
      active: pathname === '/pomodoro' || activePage === 'pomodoro'
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">AI个人助手</h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}