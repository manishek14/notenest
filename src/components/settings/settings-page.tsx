'use client';

import { motion } from 'framer-motion';
import { Key, FileText, Info, Copy, Eye, EyeOff, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function SettingsPage() {
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('••••••••••••••••');
  const [templateId, setTemplateId] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText('your-api-key-value');
    toast.success('کپی شد');
  };

  const handleSave = () => {
    toast.success('تنظیمات ذخیره شد');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">تنظیمات</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
      >
        {/* API Key */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-violet-500/10">
              <Key className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold">API Key پیامک</h3>
              <p className="text-xs text-muted-foreground">کلید API سرویس پیامک</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">کلید API</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-white/5 border-white/10 pl-20"
                dir="ltr"
              />
              <div className="absolute left-1 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                >
                  {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Template ID */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-emerald-500/10">
              <FileText className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold">شناسه قالب پیامک</h3>
              <p className="text-xs text-muted-foreground">شناسه قالب ارسال پیامک</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="templateId">شناسه قالب</Label>
            <Input
              id="templateId"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              placeholder="مثال: 12345"
              className="bg-white/5 border-white/10"
              dir="ltr"
            />
          </div>
        </div>

        {/* System Info */}
        <div className="glass rounded-xl p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-amber-500/10">
              <Info className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold">اطلاعات سامانه</h3>
              <p className="text-xs text-muted-foreground">اطلاعات نسخه و وضعیت سامانه</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">نسخه</span>
              <p className="font-medium mt-1">۱.۰.۰</p>
            </div>
            <div>
              <span className="text-muted-foreground">چارچوب</span>
              <p className="font-medium mt-1">Next.js 16</p>
            </div>
            <div>
              <span className="text-muted-foreground">پایگاه داده</span>
              <p className="font-medium mt-1">SQLite</p>
            </div>
            <div>
              <span className="text-muted-foreground">وضعیت</span>
              <p className="font-medium mt-1 text-emerald-400">فعال ✓</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4" />
          ذخیره تنظیمات
        </Button>
      </div>
    </div>
  );
}
