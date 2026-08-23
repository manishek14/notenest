'use client';

import { motion } from 'framer-motion';
import { FileText, Send, CheckCircle, Users } from 'lucide-react';
import { useAdminStore } from '@/store/admin-store';
import { toPersianDigits } from '@/lib/jalali';

const stats = [
  {
    key: 'notesCount',
    label: 'کل یادداشت‌ها',
    icon: FileText,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    key: 'totalSmsSent',
    label: 'پیامک ارسال شده',
    icon: Send,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    key: 'successRate',
    label: 'نرخ موفقیت',
    icon: CheckCircle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    suffix: '%',
  },
  {
    key: 'activeUsers',
    label: 'کاربران فعال',
    icon: Users,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  const { notes, totalSmsSent, successRate } = useAdminStore();

  const values: Record<string, string> = {
    notesCount: toPersianDigits(notes.length),
    totalSmsSent: toPersianDigits(totalSmsSent),
    successRate: toPersianDigits(successRate),
    activeUsers: toPersianDigits(notes.length),
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">داشبورد</h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.key} variants={item}>
              <div className="glass rounded-xl p-6 hover:bg-white/[0.07] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold">
                  {values[stat.key]}
                  {stat.suffix && <span className="text-lg font-normal text-muted-foreground">{stat.suffix}</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
