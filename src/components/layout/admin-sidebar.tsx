'use client';

import { LayoutDashboard, FileText, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAdminStore } from '@/store/admin-store';
import { useIsMobile } from '@/hooks/use-mobile';

type Tab = 'dashboard' | 'notes' | 'settings';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'داشبورد', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'notes', label: 'یادداشت‌ها', icon: <FileText className="h-5 w-5" /> },
  { id: 'settings', label: 'تنظیمات', icon: <Settings className="h-5 w-5" /> },
];

function MobileSidebar({ onNavigate }: { onNavigate: () => void }) {
  const { activeTab, setActiveTab } = useAdminStore();

  const handleClick = (id: Tab) => {
    setActiveTab(id);
    onNavigate();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 px-4 border-b border-white/10">
        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <span className="text-primary font-bold text-sm">N</span>
        </div>
        <span className="text-lg font-bold tracking-tight">NoteNest</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleClick(tab.id)}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function DesktopSidebar() {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen } = useAdminStore();

  const handleClick = (id: Tab) => {
    setActiveTab(id);
  };

  return (
    <aside className="fixed right-0 top-0 bottom-0 z-30 glass-strong transition-all duration-300 overflow-hidden"
      style={{ width: sidebarOpen ? 260 : 72 }}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 px-4 border-b border-white/10">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-sm">N</span>
          </div>
          {sidebarOpen && (
            <span className="text-lg font-bold tracking-tight whitespace-nowrap">NoteNest</span>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              } ${!sidebarOpen ? 'justify-center' : ''}`}
              title={sidebarOpen ? undefined : tab.label}
            >
              {tab.icon}
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            {sidebarOpen ? (
              <>
                <PanelLeftClose className="h-5 w-5" />
                <span>بستن منو</span>
              </>
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

export function AdminSidebar() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useAdminStore();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="right" className="w-72 p-0 glass-strong border-white/10">
          <SheetHeader className="sr-only">
            <SheetTitle>منو</SheetTitle>
          </SheetHeader>
          <MobileSidebar onNavigate={() => setMobileSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return <DesktopSidebar />;
}
