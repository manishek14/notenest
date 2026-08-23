'use client';

import { FileText, User, Phone, Clock, X, Pencil, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/store/admin-store';
import { formatJalaliShort, formatTime } from '@/lib/jalali';
import { toast } from 'sonner';

export function NoteDetailSheet() {
  const { selectedNote, setSelectedNote, setEditingNote, setIsEditDialogOpen, deleteNote, loadNotes } = useAdminStore();

  if (!selectedNote) return null;

  const handleEdit = () => {
    setEditingNote(selectedNote);
    setIsEditDialogOpen(true);
    setSelectedNote(null);
  };

  const handleDelete = async () => {
    try {
      await deleteNote(selectedNote.id);
      toast.success('یادداشت حذف شد');
      setSelectedNote(null);
      await loadNotes();
    } catch {
      toast.error('خطا در حذف یادداشت');
    }
  };

  return (
    <Sheet open={!!selectedNote} onOpenChange={(v) => { if (!v) setSelectedNote(null); }}>
      <SheetContent side="left" className="glass-strong border-white/10 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>جزئیات یادداشت</SheetTitle>
          <SheetDescription className="sr-only">نمایش جزئیات یادداشت</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              عنوان
            </div>
            <p className="text-sm font-medium">{selectedNote.title}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              محتوا
            </div>
            <p className="text-sm whitespace-pre-wrap bg-white/5 rounded-lg p-3">{selectedNote.content}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                نام
              </div>
              <p className="text-sm font-medium">{selectedNote.name}</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                موبایل
              </div>
              <p className="text-sm font-medium" dir="ltr">{selectedNote.mobile}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                ایجاد
              </div>
              <p className="text-sm">
                {formatJalaliShort(selectedNote.createdAt)} — {formatTime(selectedNote.createdAt)}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                بروزرسانی
              </div>
              <p className="text-sm">
                {formatJalaliShort(selectedNote.updatedAt)} — {formatTime(selectedNote.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={() => setSelectedNote(null)}
            className="flex-1 border-white/10"
          >
            <X className="h-4 w-4" />
            بستن
          </Button>
          <Button variant="outline" onClick={handleEdit} className="flex-1 border-white/10">
            <Pencil className="h-4 w-4" />
            ویرایش
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            حذف
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
