// Date-only DateTime values represent a calendar date that is the same for every editor, regardless of the browser timezone.
// They are read in the server timezone, because that is the date the frontend renders.
// They are written as noon in the server timezone, which stays on the same date in any timezone up to 12 hours away,
// and sent in UTC, so that persisted values have a consistent offset.

const FALLBACK_TIMEZONE = 'UTC';

const formatters = {};

const getWallClockFormatter = timeZone => {
    if (!Object.prototype.hasOwnProperty.call(formatters, timeZone)) {
        try {
            formatters[timeZone] = new Intl.DateTimeFormat('en-US', {
                timeZone,
                hourCycle: 'h23',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            });
        } catch (error) {
            formatters[timeZone] = null;
        }
    }
    return formatters[timeZone];
};

const resolveFormatter = timeZone => (timeZone && getWallClockFormatter(timeZone)) || getWallClockFormatter(FALLBACK_TIMEZONE);

const wallClockInTimezone = (date, timeZone) => {
    const parts = {};
    resolveFormatter(timeZone).formatToParts(date).forEach(({type, value}) => {
        parts[type] = parseInt(value, 10);
    });
    return {
        year: parts.year,
        month: parts.month,
        day: parts.day,
        hour: parts.hour === 24 ? 0 : parts.hour,
        minute: parts.minute,
        second: parts.second
    };
};

const utcTimestamp = ({year, month, day, hour = 0, minute = 0, second = 0}) => {
    const date = new Date(Date.UTC(2000, month - 1, day, hour, minute, second));
    // Date.UTC() maps years 0 - 99 to 1900 - 1999
    date.setUTCFullYear(year);
    return date.getTime();
};

// in milliseconds
const timezoneOffset = (date, timeZone) => {
    const instantWithoutMilliseconds = Math.floor(date.getTime() / 1000) * 1000;
    return utcTimestamp(wallClockInTimezone(date, timeZone)) - instantWithoutMilliseconds;
};

const instantInTimezone = (calendarDate, hour, timeZone) => {
    const wallClockAsUtc = utcTimestamp({...calendarDate, hour});
    // The offset at the first guess can differ from the one at the actual instant (DST transition)
    const firstGuess = new Date(wallClockAsUtc - timezoneOffset(new Date(wallClockAsUtc), timeZone));
    return new Date(wallClockAsUtc - timezoneOffset(firstGuess, timeZone));
};

const pad = (number, length = 2) => String(number).padStart(length, '0');

const formatAsUtc = date => `${pad(date.getUTCFullYear(), 4)}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}+00:00`;

export const calendarDateInTimezone = (date, timeZone) => {
    const {year, month, day} = wallClockInTimezone(date, timeZone);
    return {year, month, day};
};

// The date picker works in UTC for date-only values
export const calendarDateToUtcMidnight = calendarDate => new Date(utcTimestamp(calendarDate));

export const calendarDateFromUtcMidnight = date => ({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate()
});

export const formatCalendarDateAsNoon = (calendarDate, timeZone) => formatAsUtc(instantInTimezone(calendarDate, 12, timeZone));
