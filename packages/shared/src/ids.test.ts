import { describe, expect, it } from 'vitest';
import { createId, ID_LENGTH, isId } from './ids';

describe('createId', () => {
  it('makes 16 alphanumeric characters', () => {
    const id = createId();
    expect(id).toHaveLength(ID_LENGTH);
    expect(isId(id)).toBe(true);
  });

  it('does not repeat across many calls', () => {
    const ids = new Set(Array.from({ length: 10_000 }, () => createId()));
    expect(ids.size).toBe(10_000);
  });
});

describe('isId', () => {
  it('rejects the wrong length and characters', () => {
    expect(isId('short')).toBe(false);
    expect(isId('abc-def_ghij-klm')).toBe(false);
  });
});
