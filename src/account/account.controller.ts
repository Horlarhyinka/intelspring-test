import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('bank-codes')
  findAll() {
    return this.accountService.getBankCodes();
  }
}
