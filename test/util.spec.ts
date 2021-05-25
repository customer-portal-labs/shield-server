import { expect } from 'chai';
import { Request } from 'express';
import { getIP } from '../src/util';
describe('utils', () => {
  const mockRequest = (callback: Function) => ({
    header: callback,
  });

  it('get ip from Akamai', () => {
    const request = mockRequest((name: string) => {
      if (name === 'True-Client-IP') {
        return '192.168.1.1';
      }
    }) as Request;

    const ip = getIP(request);
    expect(ip).eq('192.168.1.1');
  });

  it('get ip from x-real-ip', () => {
    const request = mockRequest((name: string) => {
      if (name === 'x-real-ip') {
        return '192.168.1.2';
      }
    }) as Request;

    const ip = getIP(request);
    expect(ip).eq('192.168.1.2');
  });

  it('get ip from x-forwarded-for', () => {
    const request = mockRequest((name: string) => {
      if (name === 'x-forwarded-for') {
        return '192.168.1.3';
      }
    }) as Request;

    const ip = getIP(request);
    expect(ip).eq('192.168.1.3');
  });

  it('get ip from socket address', () => {
    const request = mockRequest((name: string) => {});
    (request as any).socket = {
      remoteAddress: '192.168.1.255',
    };

    const ip = getIP(request as Request);
    expect(ip).eq('192.168.1.255');
  });

  it('get ip from nothing', () => {
    const request = mockRequest((name: string) => {}) as Request;

    const ip = getIP(request);
    expect(ip).eq('');
  });
});
