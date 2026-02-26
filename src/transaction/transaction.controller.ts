import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { TransactionService }
  from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService:
      TransactionService,
  ) { }
  @Get()
  findAll(
    @Query('accountId')
    accountId?: string,
  ) {

    return this.transactionService
      .findAll(accountId);

  }
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.transactionService
      .findById(id);

  }
}