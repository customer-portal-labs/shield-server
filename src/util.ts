import { Request } from 'express';

export const getIP = (req: Request): string => {
  const akamaiIP = req.header('True-Client-IP');
  const realIP = req.header('x-real-ip');
  const forwardedIP = req.header('x-forwarded-for');
  return (
    akamaiIP ||
    realIP ||
    forwardedIP ||
    req.ip ||
    (req.socket && req.socket.remoteAddress) ||
    ''
  );
};
