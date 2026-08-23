'use client';

import { useEffect, useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAdminStore } from '@/store/admin-store';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const { searchQuery, setSearchQuery, mobileSidebarOpen, setMobileSidebarOpen } = useAdminStore();
  const isMobile = useIsMobile();
  const [greeting, setGreeting] = useState('سلام');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('صبح بخیر');
    else if (hour >= 12 && hour < 17) setGreeting('ظهر بخیر');
    else setGreeting('شب بخیر');
  }, []);

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {isMobile && (
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="rounded-md p-2 hover:bg-white/10 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <h1 className="text-lg font-semibold hidden sm:block">{greeting} 👋</h1>

        <div className="flex-1 max-w-md mr-auto">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 bg-white/5 border-white/10"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
