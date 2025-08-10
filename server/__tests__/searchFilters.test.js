
const { parsePrice, buildTextQuery, buildPagination } = require('../utils/searchFilters.js');

// test parsePrice
describe('parsePrice', () => {
  it('returns undefined for empty input', () => {
    expect(parsePrice('')).toBeUndefined();
    expect(parsePrice(null)).toBeUndefined();
  });
  it('parses valid price strings', () => {
    expect(parsePrice('10')).toBe(10);
    expect(parsePrice('5.99')).toBe(5.99);
  });
  it('returns undefined for negative or invalid input', () => {
    expect(parsePrice('-1')).toBeUndefined();
    expect(parsePrice('abc')).toBeUndefined();
  });
});

// tests buildTextQuery
describe('buildTextQuery', () => {
  it('returns empty object for empty or whitespace', () => {
    expect(buildTextQuery('')).toEqual({});
    expect(buildTextQuery('   ')).toEqual({});
  });
  it('returns $text query for text > 2 chars', () => {
    expect(buildTextQuery('apple')).toEqual({ $text: { $search: 'apple' } });
  });
  it('returns $or regex for short text', () => {
    expect(buildTextQuery('ap')).toEqual({
      $or: [
        { itemName: { $regex: 'ap', $options: 'i' } },
        { 'store.name': { $regex: 'ap', $options: 'i' } }
      ]
    });
  });
});

// test buildPagination
describe('buildPagination', () => {
  it('returns default pagination for no input', () => {
    expect(buildPagination()).toEqual({ page: 1, limit: 20, skip: 0 });
  });
  it('limits max items per page to 100', () => {
    expect(buildPagination(1, 200)).toEqual({ page: 1, limit: 100, skip: 0 });
  });
  it('calculates skip correctly', () => {
    expect(buildPagination(3, 10)).toEqual({ page: 3, limit: 10, skip: 20 });
  });
});
