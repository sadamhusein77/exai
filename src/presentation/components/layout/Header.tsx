// Presentation Layer - Header Component
// Navigation header with CMS and Products links

import { Link, useLocation } from 'react-router-dom';
import { Package, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="font-semibold text-slate-800 dark:text-white">Export Generator</span>
        </div>

        <nav className="flex items-center gap-4">
          <Link to="/">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
            >
              <Package size={18} className="mr-2" />
              Products
            </Button>
          </Link>
          <Link to="/cms">
            <Button
              variant={isActive('/cms') ? 'default' : 'ghost'}
              size="sm"
            >
              CMS
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={onSettingsClick}>
            <Settings size={18} />
          </Button>
        </nav>
      </div>
    </header>
  );
}