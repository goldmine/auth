import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  async createToken(data: { id: number; email: string }) {
    return await jwt.sign(data, process.env.JSON_TOKEN_KEY, {
      expiresIn: 36000,
    });
  }

  async decodeToken(token: string) {
    return await jwt.decode(token);
  }
}
