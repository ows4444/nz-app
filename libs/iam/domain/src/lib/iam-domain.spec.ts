import { iamDomain } from './iam-domain';

describe('iamDomain', () => {
  it('should work', () => {
    expect(iamDomain()).toEqual('iam-domain');
  });
});
