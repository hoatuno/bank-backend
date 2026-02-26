import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { GoogleModule } from 'src/google/google.module';
@Module({
  imports: [GoogleModule],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],

})
export class TransactionModule { }