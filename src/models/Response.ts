import { Response as ExpressResponse } from 'express';

export default interface Response extends ExpressResponse {
  success: <T>(data: T, statusCode?: number, message?: string) => void;
  fail: <T>(error: T, statusCode?: number, message?: string) => void;
  error: <T>(error: T, statusCode?: number, message?: string) => void;
  sentry?: string;
}
