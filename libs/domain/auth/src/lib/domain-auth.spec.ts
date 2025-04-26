import { domainAuth } from './domain-auth';

describe('domainAuth', () => {
  it('should work', () => {
    expect(domainAuth()).toEqual('domain-auth');
  });
});
