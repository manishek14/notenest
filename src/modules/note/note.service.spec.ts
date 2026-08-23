import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteService } from './note.service';
import { Note } from './entities/note.entity';
import { SmsService } from '../sms/sms.service';

describe('NoteService', () => {
  let service: NoteService;

  const mockNoteRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockSmsService = {
    sendNoteCreatedSms: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        { provide: getRepositoryToken(Note), useValue: mockNoteRepository },
        { provide: SmsService, useValue: mockSmsService },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a note and trigger the confirmation sms', async () => {
    const dto = { title: 'یادداشت', content: 'متن', name: 'علی', mobile: '09123456789' };
    const savedNote = { id: 1, ...dto, createdAt: new Date(), updatedAt: new Date() } as Note;

    mockNoteRepository.create.mockReturnValue(savedNote);
    mockNoteRepository.save.mockResolvedValue(savedNote);

    const result = await service.create(dto as any);

    expect(mockNoteRepository.create).toHaveBeenCalledWith(dto);
    expect(mockNoteRepository.save).toHaveBeenCalledWith(savedNote);
    expect(result).toEqual(savedNote);

    // ارسال پیامک fire-and-forget است، یک tick صبر می‌کنیم تا صف میکروتسک تخلیه شود
    await new Promise(process.nextTick);
    expect(mockSmsService.sendNoteCreatedSms).toHaveBeenCalledWith(
      savedNote.mobile,
      savedNote.name,
      expect.any(String),
    );
  });
});
