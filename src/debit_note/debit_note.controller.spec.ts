import { Test, TestingModule } from '@nestjs/testing';
import { DebitNoteController } from './debit_note.controller';
import { DebitNoteService } from './debit_note.service';

describe('DebitNoteController', () => {
  let controller: DebitNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebitNoteController],
      providers: [DebitNoteService],
    }).compile();

    controller = module.get<DebitNoteController>(DebitNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
