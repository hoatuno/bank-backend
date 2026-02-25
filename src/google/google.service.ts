import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import * as path from 'path';

@Injectable()
export class GoogleService {
  private sheets: sheets_v4.Sheets;

  constructor() {
    const auth = new GoogleAuth({
      keyFile: path.join(process.cwd(), 'credentials.json'),

      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({
      version: 'v4',
      auth,
    });
  }

  async read(spreadsheetId: string, range: string): Promise<string[][]> {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return (res.data.values ?? []) as string[][];
  }

  async write(
    spreadsheetId: string,
    range: string,
    values: string[][],
  ): Promise<void> {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',

      requestBody: {
        values,
      },
    });
  }

  async append(
    spreadsheetId: string,
    range: string,
    values: string[][],
  ): Promise<void> {
    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',

      requestBody: {
        values,
      },
    });
  }
}
