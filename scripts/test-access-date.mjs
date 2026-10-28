import assert from 'node:assert/strict';
import { beijingDate } from '../src/access-date.js';
for (const [utc, expected] of [
  ['2026-10-27T15:59:59Z', '20261027'],
  ['2026-10-27T16:00:00Z', '20261028'],
  ['2026-10-28T16:00:00Z', '20261029'],
  ['2026-12-31T16:00:00Z', '20270101'],
  ['2028-02-28T16:00:00Z', '20280229'],
  ['2028-02-29T16:00:00Z', '20280301'],
  ['2027-02-28T16:00:00Z', '20270301'],
]) assert.equal(beijingDate(Date.parse(utc)), expected, utc);
console.log('北京时间、跨日、跨年及闰年检查通过');
