import { NextRequest, NextResponse } from 'next/server';
import { getNoteById, updateNoteById, deleteNoteById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = await getNoteById(Number(id));
  if (!note) return NextResponse.json({ message: 'یافت نشد' }, { status: 404 });
  return NextResponse.json(note);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const note = await updateNoteById(Number(id), body);
  if (!note) return NextResponse.json({ message: 'یافت نشد' }, { status: 404 });
  return NextResponse.json(note);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await deleteNoteById(Number(id));
  if (!deleted) return NextResponse.json({ message: 'یافت نشد' }, { status: 404 });
  return NextResponse.json({ message: 'حذف موفق' });
}