import { Request } from 'express';

export interface RequestWithToken extends Request {
  newToken?: string;
}