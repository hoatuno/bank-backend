import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { DepositDto } from './dto/deposit.dto/deposit.dto';

@Controller('accounts')
export class AccountController {

  constructor(
    private accountService: AccountService
  ) { }

  @Get()
  getAll() {
    return this.accountService.findAll();
  }

  @Post(':id/deposit')
  deposit(
    @Param('id') id: string,
    @Body() body: DepositDto,
    // @Query('amount') amount: string,
  ) {

    return this.accountService.changeBalance(
      id,
      Number(body.amount),
      'deposit'
    );

  }
  @Post(':id/withdraw')
  withdraw(
    @Param('id') id: string,
    @Body() body: DepositDto,
  ) {
    return this.accountService.changeBalance(
      id,
      Number(body.amount),
      'withdraw'
    );
  }

}