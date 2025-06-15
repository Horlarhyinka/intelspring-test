import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { DebitNoteService } from './debit_note.service';
import { CreateDebitNoteDto } from './dto/create-debit_note.dto';
import { UpdateDebitNoteDto } from './dto/update-debit_note.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('debit-note')
export class DebitNoteController {
  constructor(private readonly debitNoteService: DebitNoteService) {}

  @Post()
  @FormDataRequest()
  @ApiConsumes('multipart/formdata')
  @ApiOperation({ summary: 'Creates a Debit Note' })
  create(@Body() createDebitNoteDto: CreateDebitNoteDto) {
    return this.debitNoteService.create(createDebitNoteDto);
  }

  @Get()
  findAll() {
    return this.debitNoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debitNoteService.findOne(id);
  }

  @Put(':id')
  @FormDataRequest()
  @ApiConsumes('multipart/formdata')
  @ApiOperation({ summary: 'Updates a Debit Note' })
  update(
    @Param('id') id: string,
    @Body() updateDebitNoteDto: UpdateDebitNoteDto,
  ) {
    return this.debitNoteService.update(id, updateDebitNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debitNoteService.remove(id);
  }
}
