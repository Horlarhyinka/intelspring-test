import { PartialType } from '@nestjs/mapped-types';
import { CreateDebitNoteDto } from './create-debit_note.dto';

export class UpdateDebitNoteDto extends PartialType(CreateDebitNoteDto) {}
