import { describe, expect, it } from 'vitest';
import { isCurrentSearchRequest } from '../src/client/search/dialog';

describe('search request versioning', () => {
  it('accepts only the current request version', () => {
    expect(isCurrentSearchRequest(3, 3)).toBe(true);
    expect(isCurrentSearchRequest(2, 3)).toBe(false);
  });
});
