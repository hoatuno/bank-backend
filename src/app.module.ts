import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleModule } from './google/google.module';
import { AccountService } from './account/account.service';
import { AccountController } from './account/account.controller';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [GoogleModule, TransactionModule],
  controllers: [AppController, AccountController],
  providers: [AppService, AccountService],
})
export class AppModule {}
