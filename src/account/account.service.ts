import { Injectable } from '@nestjs/common';
import { GoogleService } from '../google/google.service';
import { TransactionService, TransactionType } from 'src/transaction/transaction.service';

@Injectable()
export class AccountService {
  private spreadsheetId = '16HUyU8CykYrKLjYABnePahJm8T5JRSX06NAoG3F4FWA';
  private range = 'accounts!A2:C';

  constructor(private google: GoogleService, private transactionService: TransactionService) { }


  async findAll() {
    const rows = await this.google.read(this.spreadsheetId, this.range);

    return rows.map(row => ({
      id: row[0],
      name: row[1],
      balance: Number(row[2]),
    }));
  }

  /** đọc toàn bộ rows */
  private async getRows(): Promise<string[][]> {
    return this.google.read(this.spreadsheetId, this.range);
  }

  /** tìm index account */
  private findAccountIndex(rows: string[][], accountId: string): number {
    const index = rows.findIndex(row => row[0] === accountId);
    if (index === -1) {
      throw new Error('Account not found');
    }
    return index;
  }

  /** lấy balance hiện tại */
  private getBalance(rows: string[][], index: number): number {
    return Number(rows[index][2] ?? 0);
  }

  /** lưu rows */
  private async saveRows(rows: string[][]) {
    await this.google.write(this.spreadsheetId, this.range, rows);
  }

  /** update balance dùng chung */
  private async updateBalance(
    accountId: string,
    type: TransactionType,
    delta: number
  ) {
    const rows = await this.getRows();

    const index = this.findAccountIndex(rows, accountId);

    const currentBalance = this.getBalance(rows, index);
    if (currentBalance + delta < 0) {
      throw new Error('Insufficient balance');
    }
    const newBalance = currentBalance + delta;

    rows[index][2] = String(newBalance);

    await this.saveRows(rows);
    this.transactionService.create(
      accountId,
      type,
      delta,
    );

    return {
      accountId,
      balance: newBalance,
    };
  }

  async changeBalance(accountId: string, amount: number, type: TransactionType) {
    const delta = type === 'deposit' ? amount : -amount;

    return this.updateBalance(accountId, type, delta);
  }
}