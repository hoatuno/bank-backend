import { Injectable } from '@nestjs/common';
import { GoogleService } from '../google/google.service';

export type TransactionType =
  | 'deposit'
  | 'withdraw';

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  createdAt: Date;
}

@Injectable()
export class TransactionService {

  private spreadsheetId =
    '16HUyU8CykYrKLjYABnePahJm8T5JRSX06NAoG3F4FWA';

  private range =
    'transactions!A2:E';

  constructor(
    private google: GoogleService,
  ) { }
  /** create transaction */
  async create(
    accountId: string,
    type: TransactionType,
    amount: number,
  ) {
    await this.google.append(
      this.spreadsheetId,
      this.range,
      [[
        crypto.randomUUID(),
        accountId,
        type,
        String(amount),
        new Date().toISOString()
      ]]
    );
  }
  /** convert sheet row -> object */
  private mapRow(
    row: string[],
  ): Transaction {

    return {
      id: row[0],
      accountId: row[1],
      type:
        row[2] as TransactionType,
      amount:
        Number(row[3]),
      createdAt:
        new Date(row[4]),
    };

  }

  /** GET /transactions */
  async findAll(
    accountId?: string,
  ): Promise<Transaction[]> {

    const rows =
      await this.google.read(
        this.spreadsheetId,
        this.range,
      );

    const transactions =
      rows.map(
        row => this.mapRow(row),
      );

    if (accountId)
      return transactions.filter(
        t =>
          t.accountId === accountId,
      );

    return transactions;

  }

  /** GET /transactions/:id */
  async findById(
    id: string,
  ): Promise<Transaction | undefined> {

    const rows =
      await this.google.read(
        this.spreadsheetId,
        this.range,
      );

    const row =
      rows.find(
        r => r[0] === id,
      );

    if (!row)
      return undefined;

    return this.mapRow(row);

  }

}