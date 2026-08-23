import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'notes.json');

export interface NoteRow {
  id: number;
  title: string;
  content: string;
  name: string;
  mobile: string;
  createdAt: string;
  updatedAt: string;
}

interface DbData {
  notes: NoteRow[];
  nextId: number;
}

function readDb(): DbData {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as DbData;
  } catch {
    return { notes: [], nextId: 1 };
  }
}

function writeDb(data: DbData): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getAllNotes(): Promise<NoteRow[]> {
  const db = readDb();
  return db.notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getNoteById(id: number): Promise<NoteRow | undefined> {
  const db = readDb();
  return db.notes.find(n => n.id === id);
}

export async function insertNote(data: { title: string; content: string; name: string; mobile: string }): Promise<NoteRow> {
  const db = readDb();
  const now = new Date().toISOString();
  const note: NoteRow = { id: db.nextId, ...data, createdAt: now, updatedAt: now };
  db.notes.push(note);
  db.nextId++;
  writeDb(db);
  return note;
}

export async function updateNoteById(id: number, data: Partial<{ title: string; content: string; name: string; mobile: string }>): Promise<NoteRow | undefined> {
  const db = readDb();
  const idx = db.notes.findIndex(n => n.id === id);
  if (idx === -1) return undefined;
  db.notes[idx] = { ...db.notes[idx], ...data, updatedAt: new Date().toISOString() };
  writeDb(db);
  return db.notes[idx];
}

export async function deleteNoteById(id: number): Promise<boolean> {
  const db = readDb();
  const len = db.notes.length;
  db.notes = db.notes.filter(n => n.id !== id);
  if (db.notes.length === len) return false;
  writeDb(db);
  return true;
}
