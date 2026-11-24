import {
    calendarDateFromUtcMidnight,
    calendarDateInTimezone,
    calendarDateToUtcMidnight,
    formatCalendarDateAsNoon
} from './calendarDate';

const date = (year, month, day) => ({year, month, day});

describe('calendarDateInTimezone', () => {
    test.each([
        ['noon UTC (written by the UI)', '2026-03-29T12:00:00+00:00', 'Europe/Berlin'],
        ['noon UTC (written by the UI)', '2026-03-29T12:00:00+00:00', 'America/New_York'],
        ['noon UTC (written by the UI)', '2026-03-29T12:00:00+00:00', 'Pacific/Honolulu'],
        ['noon UTC (written by the UI)', '2026-03-29T12:00:00+00:00', 'Asia/Tokyo'],
        ['noon UTC (written by the UI)', '2026-03-29T12:00:00+00:00', 'UTC'],
        ['midnight UTC (written by previous UI versions)', '2026-03-29T00:00:00+00:00', 'Europe/Berlin'],
        ['midnight UTC (written by previous UI versions)', '2026-03-29T00:00:00+00:00', 'UTC'],
        ['server midnight ("today midnight" default value)', '2026-03-29T00:00:00+01:00', 'Europe/Berlin'],
        ['server midnight ("today midnight" default value)', '2026-03-29T00:00:00-04:00', 'America/New_York'],
        ['server midnight, serialized as UTC', '2026-03-28T23:00:00+00:00', 'Europe/Berlin'],
        ['a time on that day (format changed from date-time to date-only)', '2026-03-29T20:30:00+02:00', 'Europe/Berlin']
    ])('%s: %s in %s', (_, value, serverTimezone) => {
        expect(calendarDateInTimezone(new Date(value), serverTimezone)).toEqual(date(2026, 3, 29));
    });

    test('midnight UTC is the previous day for servers west of UTC (as rendered by the frontend)', () => {
        expect(calendarDateInTimezone(new Date('2026-03-29T00:00:00+00:00'), 'America/New_York')).toEqual(date(2026, 3, 28));
    });

    test('falls back to UTC for a missing timezone', () => {
        expect(calendarDateInTimezone(new Date('2026-03-28T23:00:00+00:00'), undefined)).toEqual(date(2026, 3, 28));
    });

    test('falls back to UTC for an invalid timezone', () => {
        expect(calendarDateInTimezone(new Date('2026-03-28T23:00:00+00:00'), 'Invalid/Timezone')).toEqual(date(2026, 3, 28));
    });
});

describe('calendarDateToUtcMidnight / calendarDateFromUtcMidnight', () => {
    test('converts a calendar date to UTC midnight', () => {
        expect(calendarDateToUtcMidnight(date(2026, 3, 29)).toISOString()).toBe('2026-03-29T00:00:00.000Z');
    });

    test('supports years below 100', () => {
        expect(calendarDateToUtcMidnight(date(42, 1, 2)).toISOString()).toBe('0042-01-02T00:00:00.000Z');
    });

    test('round trips', () => {
        expect(calendarDateFromUtcMidnight(calendarDateToUtcMidnight(date(2026, 2, 28)))).toEqual(date(2026, 2, 28));
    });

    test('ignores the time of day', () => {
        expect(calendarDateFromUtcMidnight(new Date('2026-03-29T23:59:59Z'))).toEqual(date(2026, 3, 29));
    });
});

const ALL_OFFSETS = [
    'Pacific/Pago_Pago', // UTC-11
    'Pacific/Honolulu', // UTC-10
    'America/New_York',
    'America/St_Johns', // UTC-3:30 / UTC-2:30
    'UTC',
    'Europe/Berlin',
    'Asia/Kolkata', // UTC+5:30
    'Asia/Tokyo',
    'Pacific/Auckland', // UTC+12 / UTC+13
    'Pacific/Tongatapu', // UTC+13
    'Pacific/Kiritimati' // UTC+14
];

describe('formatCalendarDateAsNoon', () => {
    test.each([
        [date(2026, 7, 1), 'UTC', '2026-07-01T12:00:00+00:00'],
        [date(2026, 7, 1), undefined, '2026-07-01T12:00:00+00:00'],
        [date(2026, 7, 1), 'Invalid/Timezone', '2026-07-01T12:00:00+00:00'],
        [date(2026, 1, 15), 'Europe/Berlin', '2026-01-15T11:00:00+00:00'],
        [date(2026, 7, 1), 'Europe/Berlin', '2026-07-01T10:00:00+00:00'],
        [date(2026, 3, 29), 'Europe/Berlin', '2026-03-29T10:00:00+00:00'], // DST starts at 02:00 that day
        [date(2026, 7, 1), 'America/New_York', '2026-07-01T16:00:00+00:00'],
        [date(2026, 7, 1), 'Asia/Kolkata', '2026-07-01T06:30:00+00:00'],
        [date(2026, 7, 1), 'Pacific/Auckland', '2026-07-01T00:00:00+00:00'],
        [date(2026, 1, 15), 'Pacific/Auckland', '2026-01-14T23:00:00+00:00'],
        [date(2026, 1, 15), 'Pacific/Kiritimati', '2026-01-14T22:00:00+00:00'],
        [date(42, 1, 2), 'UTC', '0042-01-02T12:00:00+00:00']
    ])('%o in %s is %s', (calendarDate, serverTimezone, expected) => {
        expect(formatCalendarDateAsNoon(calendarDate, serverTimezone)).toBe(expected);
    });

    test.each(ALL_OFFSETS)('is read back as the same calendar date with server timezone %s', serverTimezone => {
        [date(2026, 1, 15), date(2026, 3, 29), date(2026, 7, 1), date(2026, 10, 25), date(2026, 12, 31)].forEach(calendarDate => {
            expect(calendarDateInTimezone(new Date(formatCalendarDateAsNoon(calendarDate, serverTimezone)), serverTimezone)).toEqual(calendarDate);
        });
    });

    test('stays on the same calendar date in timezones up to 12 hours away from the server timezone', () => {
        const value = new Date(formatCalendarDateAsNoon(date(2026, 7, 1), 'Europe/Berlin'));
        ['Pacific/Honolulu', 'America/New_York', 'UTC', 'Asia/Tokyo', 'Pacific/Auckland'].forEach(timeZone => {
            expect(calendarDateInTimezone(value, timeZone)).toEqual(date(2026, 7, 1));
        });
    });
});
