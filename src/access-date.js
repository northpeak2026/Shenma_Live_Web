// A fixed UTC offset keeps the date independent of the visitor's time zone.
export function beijingDate(now = Date.now()) {
  return new Date(now + 8 * 60 * 60 * 1000).toISOString().slice(0, 10).replaceAll('-', '');
}
