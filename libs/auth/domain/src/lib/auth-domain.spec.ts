import { authDomain } from './auth-domain';

describe('authDomain', () => {
  it('should work', () => {
    expect(authDomain()).toEqual('auth-domain');
  });
});
