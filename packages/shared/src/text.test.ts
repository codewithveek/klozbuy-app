import { describe, expect, it } from 'vitest';
import { normalizeText, searchTerms, slugify } from './text';

describe('normalizeText', () => {
  it('removes Yoruba diacritics and punctuation', () => {
    expect(normalizeText('Ọlá Electronics, Ṣẹ́gun!')).toBe('ola electronics segun');
  });
});

describe('slugify', () => {
  it('makes a URL slug from a listing title', () => {
    expect(slugify('iPhone 13, 128 GB')).toBe('iphone-13-128-gb');
  });

  it('never ends with a dash after truncating', () => {
    expect(slugify('Party jollof and chicken, 10 packs', 12)).toBe('party-jollof');
  });
});

describe('searchTerms', () => {
  it('keeps numbers, drops stop words and duplicates', () => {
    expect(searchTerms('iPhone 13 and the iPhone 13 case')).toEqual(['iphone', '13', 'case']);
  });
});
