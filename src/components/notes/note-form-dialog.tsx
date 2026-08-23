'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAdminStore } from '@/store/admin-store';
import { toast } from 'sonner';

type FormData = {
  title: string;
  content: string;
  name: string;
  mobile: string;
};

const emptyForm: FormData = { title: '', content: '', name: '', mobile: '' };

export function NoteFormDialog() {
  const { isEditDialogOpen, setIsEditDialogOpen, editingNote, setEditingNote, createNote, patchNote, loadNotes } = useAdminStore();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = editingNote !== null;

  useEffect(() => {
    if (editingNote) {
      setForm({
        title: editingNote.title,
        content: editingNote.content,
        name: editingNote.name,
        mobile: editingNote.mobile,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingNote, isEditDialogOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.name.trim() || !form.mobile.trim()) {
      toast.error('لطفاً فیلدهای ضروری را پر کنید');
      return;
    }
    setSubmitting(true);
    try {
      if (isEditing && editingNote) {
        await patchNote(editingNote.id, form);
        toast.success('یادداشت بروزرسانی شد');
      } else {
        await createNote(form);
        toast.success('یادداشت ایجاد شد');
      }
      await loadNotes();
      setIsEditDialogOpen(false);
      setEditingNote(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطایی رخ داد');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={(v) => { if (!v) { setIsEditDialogOpen(false); setEditingNote(null); } }}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg glass-strong border-white/10">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'ویرایش یادداشت' : 'یادداشت جدید'}</DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing ? 'فرم ویرایش یادداشت' : 'فرم ایجاد یادداشت'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="عنوان یادداشت"
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">محتوا</Label>
            <Textarea
              id="content"
              rows={4}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="متن یادداشت..."
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="نام شخص"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">موبایل *</Label>
              <Input
                id="mobile"
                dir="ltr"
                value={form.mobile}
                onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                placeholder="09123456789"
                className="bg-white/5 border-white/10 text-left"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setIsEditDialogOpen(false); setEditingNote(null); }}
              className="border-white/10"
            >
              انصراف
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'بروزرسانی' : 'ایجاد'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
