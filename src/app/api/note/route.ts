import { NextRequest, NextResponse } from 'next/server';
import { getAllNotes, insertNote } from '@/lib/db';
import { sendNoteSms } from '@/lib/sms';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const notes = await getAllNotes();
    return NextResponse.json(notes);
  } catch (err: any) {
    console.error('DB error:', err.message);
    return NextResponse.json({ message: 'خطا در خواندن داده‌ها' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, name, mobile } = body;
    if (!title || !content || !name || !mobile) {
      return NextResponse.json({ message: 'تمام فیلدها الزامی است' }, { status: 400 });
    }
    const note = await insertNote({ title, content, name, mobile });
    sendNoteSms(note.mobile, note.name, new Date(note.createdAt)).catch(() => {});
    return NextResponse.json(note, { status: 201 });
  } catch (err: any) {
    console.error('Create error:', err.message);
    return NextResponse.json({ message: 'خطا در ایجاد یادداشت' }, { status: 500 });
  }
}
