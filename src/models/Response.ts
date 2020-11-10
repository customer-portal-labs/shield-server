import { Response as ExpressResponse } from 'express';

export default interface Response extends ExpressResponse {
  success: <T>(data: T, statusCode?: number, message?: string) => any;
  fail: <T>(error: T, statusCode?: number, message?: string) => any;
  error: <T>(error: T, statusCode?: number, message?: string) => any;
  sentry?: string;
}
