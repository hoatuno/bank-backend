import { Injectable } from '@nestjs/common';
import { GoogleService } from '../google/google.service';

@Injectable()
export class AccountService {
  spreadsheetId = '16HUyU8CykYrKLjYABnePahJm8T5JRSX06NAoG3F4FWA';

  constructor(private google: GoogleService) {}

  async findAll() {
    return this.google.read(this.spreadsheetId, 'accounts!A2:C');
  }
}
