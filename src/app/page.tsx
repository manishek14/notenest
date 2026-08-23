"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Header } from '@/components/layout/header';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { NotesTable } from '@/components/notes/notes-table';
import { SettingsPage } from '@/components/settings/settings-page';
import { useAdminStore } from '@/store/admin-store';
import { useIsMobile } from '@/hooks/use-mobile';

const pages = {
  dashboard: DashboardPage,
  notes: NotesTable,
  settings: SettingsPage,
} as const;

export default function AdminPanel() {
  const { activeTab, sidebarOpen, loadNotes } = useAdminStore();
  const isMobile = useIsMobile();
  const ActivePage = pages[activeTab];

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return (
    <div className="min-h-screen gradient-mesh relative overflow-x-hidden">
      <AdminSidebar />

      <motion.main
        initial={false}
        animate={{ marginRight: isMobile ? 0 : (sidebarOpen ? 260 : 72) }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="min-h-screen flex flex-col"
      >
        <Header />

        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ActivePage />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>

      <div className="fixed top-[-200px] left-[-100px] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/[0.04] rounded-full blur-[120px] md:blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[200px] w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-violet-500/[0.03] rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="fixed top-[50%] left-[50%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-amber-500/[0.02] rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
    </div>
  );
}
