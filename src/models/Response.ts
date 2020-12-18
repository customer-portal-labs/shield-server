export {};
declare global {
  // eslint-disable-next-line
  namespace Express {
    export interface Response {
      success: <T>(data: T, statusCode?: number, message?: string) => void;
      fail: <T>(error: T, statusCode?: number, message?: string) => void;
      error: <T>(error: T, statusCode?: number, message?: string) => void;
    }
  }
}
