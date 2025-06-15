import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AccountService],
  controllers: [AccountController],
  imports: [HttpModule, ConfigModule],
})
export class AccountModule {}
