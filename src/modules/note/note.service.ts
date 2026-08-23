import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class NoteService {
  private readonly logger = new Logger(NoteService.name);

  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
    private readonly smsService: SmsService,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.noteRepository.create(createNoteDto);
    const savedNote = await this.noteRepository.save(note);

    this.sendNotification(savedNote);

    return savedNote;
  }

  findAll(): Promise<Note[]> {
    return this.noteRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.noteRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException(`نوت با شناسه ${id} یافت نشد`);
    }
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);
    Object.assign(note, updateNoteDto);
    return this.noteRepository.save(note);
  }

  async remove(id: number): Promise<void> {
    const note = await this.findOne(id);
    await this.noteRepository.remove(note);
  }

  private async sendNotification(note: Note): Promise<void> {
    try {
      await this.smsService.sendNoteCreatedSms(
        note.mobile,
        note.name,
        note.createdAt, 
      );
      this.logger.log(`✅ SMS sent to ${note.mobile} for note ${note.id}`);
    } catch (error : any) {
      this.logger.error(
        `❌ Failed to send SMS for note ${note.id} to ${note.mobile}: ${error.message}`,
      );
    }
  }
}