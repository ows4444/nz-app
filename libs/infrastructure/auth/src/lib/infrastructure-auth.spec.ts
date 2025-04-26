import { infrastructureAuth } from './infrastructure-auth';

describe('infrastructureAuth', () => {
  it('should work', () => {
    expect(infrastructureAuth()).toEqual('infrastructure-auth');
  });
});
