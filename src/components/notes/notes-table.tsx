'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAdminStore } from '@/store/admin-store';
import { formatJalaliShort, formatTime, toPersianDigits } from '@/lib/jalali';
import { NoteFormDialog } from '@/components/notes/note-form-dialog';
import { NoteDetailSheet } from '@/components/notes/note-detail-sheet';
import { toast } from 'sonner';

export function NotesTable() {
  const { notes, isLoading, searchQuery, setEditingNote, setIsEditDialogOpen, setSelectedNote, deleteNote, loadNotes } = useAdminStore();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.name.toLowerCase().includes(q) ||
      n.mobile.includes(q) ||
      n.content.toLowerCase().includes(q)
    );
  });

  const handleCreateNew = () => {
    setEditingNote(null);
    setIsEditDialogOpen(true);
  };

  const handleEdit = (note: (typeof notes)[0]) => {
    setEditingNote(note);
    setIsEditDialogOpen(true);
  };

  const handleView = (note: (typeof notes)[0]) => {
    setSelectedNote(note);
  };

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    setDeleting(true);
    try {
      await deleteNote(deleteTarget);
      toast.success('یادداشت حذف شد');
      await loadNotes();
    } catch {
      toast.error('خطا در حذف یادداشت');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">یادداشت‌ها</h2>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4" />
          یادداشت جدید
        </Button>
      </div>

      {isLoading ? (
        <div className="glass rounded-xl p-12 text-center text-muted-foreground">
          در حال بارگذاری...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
          {searchQuery ? 'نتیجه‌ای یافت نشد' : 'هنوز یادداشتی ایجاد نشده'}
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm truncate max-w-[70%]">{note.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleView(note)}>
                          <Eye className="h-4 w-4 ml-2" />
                          مشاهده
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(note)}>
                          <Pencil className="h-4 w-4 ml-2" />
                          ویرایش
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteTarget(note.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{note.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{note.name}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatJalaliShort(note.createdAt)} {formatTime(note.createdAt)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block glass rounded-xl overflow-hidden">
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">#</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">عنوان</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">نام</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">موبایل</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">تاریخ</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((note, idx) => (
                      <motion.tr
                        key={note.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground">{toPersianDigits(idx + 1)}</td>
                        <td className="px-4 py-3 font-medium max-w-[200px] truncate">{note.title}</td>
                        <td className="px-4 py-3">{note.name}</td>
                        <td className="px-4 py-3 font-mono text-xs" dir="ltr">{note.mobile}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {formatJalaliShort(note.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleView(note)}>
                                <Eye className="h-4 w-4 ml-2" />
                                مشاهده
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(note)}>
                                <Pencil className="h-4 w-4 ml-2" />
                                ویرایش
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setDeleteTarget(note.id)} className="text-destructive">
                                <Trash2 className="h-4 w-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <NoteFormDialog />
      <NoteDetailSheet />

      <AlertDialog open={deleteTarget !== null} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent className="glass-strong border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف یادداشت</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="border-white/10">انصراف</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? 'در حال حذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
