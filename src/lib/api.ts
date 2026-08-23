export interface Note {
  id: number;
  title: string;
  content: string;
  name: string;
  mobile: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  name: string;
  mobile: string;
}

export type UpdateNotePayload = Partial<CreateNotePayload>;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export async function fetchNotes(): Promise<Note[]> {
  try {
    const base = BACKEND_URL || '/api';
    const res = await fetch(`${base}/note`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchNoteById(id: number): Promise<Note> {
  const base = BACKEND_URL || '/api';
  const res = await fetch(`${base}/note/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('یادداشت یافت نشد');
  return res.json();
}

export async function createNote(data: CreateNotePayload): Promise<Note> {
  const base = BACKEND_URL || '/api';
  const res = await fetch(`${base}/note`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'خطا در ایجاد یادداشت');
  }
  return res.json();
}

export async function updateNote(id: number, data: UpdateNotePayload): Promise<Note> {
  const base = BACKEND_URL || '/api';
  const res = await fetch(`${base}/note/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'خطا در بروزرسانی یادداشت');
  }
  return res.json();
}

export async function deleteNote(id: number): Promise<void> {
  const base = BACKEND_URL || '/api';
  const res = await fetch(`${base}/note/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('خطا در حذف یادداشت');
}
