/**
 * Created by oren on 4/4/15.
 */

Date.prototype.getDayNum = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((this - onejan) / 86400000);
};

var symmetrical = {};

symmetrical.months = {
    1: {
        name: 'January'
    },
    2: {
        name: 'February'
    },
    3: {
        name: 'March'
    },
    4: {
        name: 'April'
    },
    5: {
        name: 'May'
    },
    6: {
        name: 'June'
    },
    7: {
        name: 'July'
    },
    8: {
        name: 'August'
    },
    9: {
        name: 'September'
    },
    10: {
        name: 'October'
    },
    11: {
        name: 'November'
    },
    12: {
        name: 'December'
    },
    13: {
        name: 'Irvember'
    }
};
symmetrical.getMonthAbbr = function(monthNum) {
    return this.months[monthNum].name.substring(0, 3);
};
symmetrical.defaultMaxMonth = 12;
symmetrical.quarters = 4;
symmetrical.weekLength = 7;
symmetrical.weeksInShortYear = 52;
symmetrical.weeksInLongYear = 53;
symmetrical.daysInQuarter = function () {
    return (this.weeksInShortYear * this.weekLength) / this.quarters;
};
symmetrical.monthsInQuarter = function () {
    return this.defaultMaxMonth / this.quarters;
};
symmetrical.yearShort = function () {
    return this.weeksInShortYear * this.weekLength;
};
symmetrical.yearLong = function () {
    return this.weeksInLongYear * this.weekLength;
};
symmetrical.floor = function (x) {
    return Math.floor(x);
};
symmetrical.ceiling = function (x) {
    return Math.ceil(x);
};
symmetrical.quotient = function (x, y) {
    return this.floor(x / y);
};
symmetrical.modulus = function (x, y) {
    return x - (y * this.quotient(x, y));
};
symmetrical.amod = function (x, y) {
    return y + this.modulus(x, (-1 * y));
};

/**
 * The Symmetry454 and Symmetry010 calendars share the same epoch as the Gregorian calendar, starting on
 * Monday, January 1, 1 AD. This is the same epoch as that of the ISO calendar and the Revised Julian calendar
 * @type {int}
 */
symmetrical.symEpoch = 1;

symmetrical.gregEpoch = 0;

// northward equinox
symmetrical.defaultLeapCycle = {
    years: 293,
    leaps: 52
};
// north solstice
symmetrical.alternateLeapCycle = {
    years: 389,
    leaps: 69
};
symmetrical.defaultMonthRule = {
    short: 28,
    long: 35
};
symmetrical.alternateMonthRule = {
    short: 30,
    long: 31
};
symmetrical.getLeapCoefficient = function (leapCycle) {
    return (leapCycle.years - 1) / 2;
};
/**
 * TEST: 365.24232082
 * TEST: (alt) 365.241645
 * @param leapCycle
 * @returns {number}
 */
symmetrical.getLeapCycleMeanYear = function (leapCycle) {
    var daysPerCycle = (leapCycle.years * this.yearShort()) + (leapCycle.leaps * this.weekLength);
    return (1.00000000 * daysPerCycle) / leapCycle.years;
};
/**
 * The focus of CC3 is on conversion of any date on any calendar to or from a rata die, or fixed day number.
 * Gregorian January 1, 1 AD, the first day of the first millennium, is defined as fixed day number one, a Monday.
 * All other dates are counted by days forward as positive numbers or backward as negative numbers relative to
 * that epoch. The day before the epoch was fixed day number zero. CC3 defines a moment as a fixed day
 * number that has a fractional part representing the portion of the day elapsed since midnight.
 * @param gregDate
 */

/**
 * FixedToWeekdayNum( FixedDate ) = modulus( floor( FixedDate ) – WeekdayAdjust, 7 )
 */
symmetrical.fixedToWeekdayNum = function (fixedDate) {
    return this.modulus(this.floor(fixedDate) - this.weekdayAdjust(fixedDate), this.weekLength);
};

/**
 * WeekdayAdjust = modulus( SymEpoch – 1, 7 )
 */
symmetrical.weekdayAdjust = function (fixedDate) {
    return this.modulus(this.symEpoch - fixedDate, this.weekLength);
};

/**
 * To convert a Gregorian date to a fixed date, which can then be converted to a Symmetry454 or Symmetry010
 * date, it is convenient to calculate how many days have elapsed from the Gregorian epoch to the day before the
 * Gregorian year started, then add in the ordinal day number within the Gregorian year.
 * @param gregDate
 */
symmetrical.gregToFixed = function (gregDate) {
    var gregYear = gregDate.getYear();
    var dayNum = gregDate.getDayNum();
    var days = this.priorElapsedDays(gregYear);
    return days + dayNum;
};

/**
 * Returns the number of calendar days that have elapsed from the Gregorian
 * epoch until the beginning of the New Year Day of the specified Gregorian year number:
 * @param gregYear
 *
 * @FIXME refactor to a functional definition/usage, like:
 *
 * priorElapsedDays = sum(map(getYearLength, getPriorYears(year)));
 *
 */
symmetrical.priorElapsedDays = function (gregYear) {
    var priorYear = gregYear - 1;
    var days = this.gregEpoch + (priorYear * 365);
    days += this.floor(priorYear / 4);
    days -= this.floor(priorYear / 100);
    days += this.floor(priorYear / 400);
    days -= 1;
    return days;
};

symmetrical.gregYearLength = function (gregYear) {
    var length = 365;
    if (this.modulus(gregYear, 4) == 0 && this.modulus(gregYear, 100) != 0) {
        length++;
    }
    else if (this.modulus(gregYear, 400) == 0) {
        length++;
    }
    return length;
};

symmetrical.fixedToGregPositive = function (fixedDate) {
    var gregYear = this.gregEpoch;
    var yearLength = this.gregYearLength(gregYear);
    var dayOfYear = fixedDate;
    while (dayOfYear >= yearLength) {
        dayOfYear -= yearLength;
        gregYear++;
        yearLength = this.gregYearLength(gregYear);
    }

    return {
        year: gregYear,
        dayOfYear: dayOfYear
    };
};

symmetrical.fixedToGregNegative = function (fixedDate) {
    var gregYear = this.gregEpoch;
    var yearLength = this.gregYearLength(gregYear);
    var dayOfYear = fixedDate;
    while (dayOfYear < (this.gregEpoch - yearLength)) {
        dayOfYear += yearLength;
        gregYear--;
        yearLength = this.gregYearLength(gregYear);
    }

    return {
        year: gregYear,
        dayOfYear: yearLength + dayOfYear
    };
};

/**
 * @FIXME needs definition!
 * @param fixedDate
 */
symmetrical.fixedToGreg = function (fixedDate) {
    var epochYear = this.gregYearLength(this.gregEpoch);
    if (fixedDate >= epochYear) {
        var gregDate = this.fixedToGregPositive(fixedDate);
    }
    else {
        var gregDate = this.fixedToGregNegative(fixedDate);
    }

    return gregDate;
};

symmetrical.symToGreg = function (symDate) {
    return this.fixedToGreg(this.symToFixed(symDate));
};

symmetrical.gregToSym = function (gregDate) {
    return this.fixedToSymFull(this.gregToFixed(gregDate));
};

/**
 * isSymLeapYear( SymYear ) = modulus( L ! SymYear + K, C ) < L
 where C is the number of years per cycle = 293 (a prime number), L is the number of leap years per cycle = 52,
 and K = (C-1) / 2 = 146. The K coefficient ensures that leap years are symmetrically arranged, and the modulus
 operation ensures that leap years are as smoothly spread as possible.
 The quantity modulus( L ! SymYear + K, C ) is also known as the accumulator.
 */
symmetrical.isSymLeapYear = function (symYear, leapCycle) {
    var leapCycle = leapCycle || this.defaultLeapCycle;
    var accumulator = this.modulus(L * symYear + this.getLeapCoefficient(leapCycle), leapCycle.years);
    return accumulator < leapCycle.leaps;
};

/**
 * Returns the fixed date of Jan 1 of the given symmetrical year.
 * @FIXME both leap cycles wrong
 */
symmetrical.symNewYearDay = function (symYear, leapCycle) {
    var leapCycle = leapCycle || this.defaultLeapCycle;
    var priorYear = symYear - 1;
    var shortTotal = this.symEpoch + (this.yearShort() * priorYear);
    var K = this.getLeapCoefficient(leapCycle);
    var leapTotal = this.floor(((leapCycle.leaps * priorYear) + K) / leapCycle.years);
    return shortTotal + leapTotal;
};

/**
 * @param symMonth
 * @param monthRule
 * @returns {number}
 */
symmetrical.symDaysBeforeMonth = function (symMonth, monthRule) {
    var monthRule = monthRule || this.defaultMonthRule;
    var difference = monthRule.long - monthRule.short;
    return (monthRule.short * (symMonth - 1)) + (difference * this.quotient(symMonth, 3));
};

/**
 * @param symMonth
 * @param symDay
 * @param monthRule
 * @returns {*}
 */
symmetrical.symDayOfYear = function (symMonth, symDay, monthRule) {
    var monthRule = monthRule || this.defaultMonthRule;
    return this.symDaysBeforeMonth(symMonth, monthRule) + symDay;
};

/**
 * Finds the fixed day number for a given sym date.
 *
 * @param symYear
 * @param symMonth
 * @param symDay
 * @param monthRule
 * @returns {number}
 */
symmetrical.symToFixed = function (symYear, symMonth, symDay, monthRule) {
    var monthRule = monthRule || this.defaultMonthRule;
    return this.symNewYearDay(symYear) + this.symDayOfYear(symMonth, symDay, monthRule);
};

/**
 * @param fixedDate
 * @param leapCycle
 */
symmetrical.fixedToSymYear = function (fixedDate, leapCycle) {
    var leapCycle = leapCycle || this.defaultLeapCycle;
    var meanYear = this.getLeapCycleMeanYear(leapCycle);
    var symYear = this.ceiling((fixedDate - this.symEpoch) / meanYear);
    var startOfYear = this.symNewYearDay(symYear);
    if (startOfYear < fixedDate) {
        // SymYear starts before FixedDate and is either correct or needs to be incremented
        if ((fixedDate - startOfYear) >= this.yearShort()) {
            var startOfNextYear = this.symNewYearDay(symYear + 1);
            if (fixedDate >= startOfNextYear) {
                // FixedDate is on or after the start of next year, so next year is the correct year.
                // Increment the estimated year number and return its New Year Day
                symYear++;
            } // otherwise FixedDate is in the leap week of SymYear
        } // otherwise FixedDate is within SymYear
    }
    else if (startOfYear > fixedDate) {
        // Estimated SymYear too far into the future, go back a year and recalculate the New Year Day
        symYear--;
    }
    return symYear - 1;
};

/**
 * Symmetry454 and Symmetry010 calendar arithmetic functions boil down to three main calculations:
 * 1. Find where the calendar year starts: the Symmetry454 = Symmetry010 New Year Day.
 * 2. Optionally determine if the year is a Symmetry454 = Symmetry010 leap year (usually not necessary).
 * 3. Compute the parameters that are set by the calendar structure, which are same for all Symmetry454 and
 * Symmetry010 years: ordinal day number, ordinal week number, quarters, months, weeks, days,
 * weekdays. Some of these parameters are optional, depending on the application requirements.
 */
symmetrical.fixedToSym = function (fixedDate, leapCycle) {
    var leapCycle = leapCycle || this.defaultLeapCycle;
    var symYear = this.fixedToSymYear(fixedDate, leapCycle);
    var startOfYear = this.symNewYearDay(symYear);
    var dayOfYear = fixedDate - startOfYear + 1;
    return {
        year: symYear,
        dayOfYear: dayOfYear
    };
};

symmetrical.symMonthOfQuarter = function (symDate, monthRule, maxMonth) {
    var monthRule = monthRule || this.defaultMonthRule;
    var maxMonth = maxMonth || this.defaultMaxMonth;
    var maxMonthOfQuarter = 3;
    if (maxMonth > 12) {
        maxMonthOfQuarter = 4;
    }
    // @FIXME refactor to use either named constants, or more intuitive derivation.
    if (monthRule.short == this.defaultMonthRule.short) {
        var monthOfQuarter = Math.min(maxMonthOfQuarter, this.ceiling((2 / 9) * symDate.weekOfQuarter));
    }
    else if (monthRule.short == this.alternateMonthRule.short) {
        var monthOfQuarter = Math.min(maxMonthOfQuarter, this.ceiling(symDate.dayOfQuarter / 30.5));
    }
    return monthOfQuarter;
};

symmetrical.fixedToSymFull = function (fixedDate, leapCycle, monthRule, maxMonth) {
    var leapCycle = leapCycle || this.defaultLeapCycle;
    var monthRule = monthRule || this.defaultMonthRule;
    var maxMonth = maxMonth || this.defaultMaxMonth;
    var symDate = this.fixedToSym(fixedDate, leapCycle);
    symDate.yearWeek = this.ceiling(symDate.dayOfYear / this.weekLength);
    symDate.quarter = this.ceiling((this.quarters / this.weeksInLongYear) * symDate.yearWeek);
    symDate.dayOfQuarter = symDate.dayOfYear - (this.daysInQuarter() * symDate.quarter) + this.daysInQuarter();
    symDate.weekOfQuarter = this.ceiling(symDate.dayOfQuarter / this.weekLength);
    symDate.monthOfQuarter = this.symMonthOfQuarter(symDate, monthRule, maxMonth);
    symDate.monthOfYear = this.monthsInQuarter() * (symDate.quarter - 1) + symDate.monthOfQuarter;
    symDate.dayOfMonth = symDate.dayOfYear - this.symDaysBeforeMonth(symDate.monthOfYear, monthRule);
    symDate.mediumFormat = [this.getMonthAbbr(symDate.monthOfYear), symDate.dayOfMonth + ',', symDate.year].join(' ');
    symDate.dayOfWeek = this.modulus(symDate.dayOfYear, 7);
    // @TODO ?
    // leapCycle
    // yearOfLeapCycle
    // daysInYear
    // weeksInYear
    // isLeap
    // daysInMonth
    // weeksInMonth
    // weekOfMonth
    return symDate;
};

symmetrical.sum = function(value1, value2) {
    return value1 + value2;
};

/**
 TEST DATA
 @TODO Jest
 */
symmetrical.testData = [
    {
        "gregorianDate": "Apr 26, –121",
        "rataDie": "–44,444",
        "fixedDay2001": -774929,
        "julianDay": 1676980,
        "weekDay": "Sat",
        "defSym454": "Apr 27, –121",
        "defSym010": "Apr 27, –121",
        "altSym454": "Apr 27, –121",
        "altSym010": "Apr 27, –121"
    },
    {
        "gregorianDate": "Sep 27,–91",
        "rataDie": "–33,333",
        "fixedDay2001": -763818,
        "julianDay": 1688091,
        "weekDay": "Mon",
        "defSym454": "Sep 22, –91",
        "defSym010": "Sep 24, –91",
        "altSym454": "Sep 22, –91",
        "altSym010": "Sep 24, –91"
    },
    {
        "gregorianDate": "Sep 7,122",
        "rataDie": "44444",
        "fixedDay2001": -686041,
        "julianDay": 1765868,
        "weekDay": "Mon",
        "defSym454": "Sep 8, 122",
        "defSym010": "Sep 10, 122",
        "altSym454": "Sep 8, 122",
        "altSym010": "Sep 10, 122"
    },
    {
        "gregorianDate": "Jul 4,1776",
        "rataDie": "648491",
        "fixedDay2001": -81994,
        "julianDay": 2369915,
        "weekDay": "Thu",
        "defSym454": "Jul 4, 1776",
        "defSym010": "Jul 4, 1776",
        "altSym454": "Jul 4, 1776",
        "altSym010": "Jul 4, 1776"
    },
    {
        "gregorianDate": "Jul 1,1867",
        "rataDie": "681724",
        "fixedDay2001": -48761,
        "julianDay": 2403148,
        "weekDay": "Mon",
        "defSym454": "Jul 1, 1867",
        "defSym010": "Jul 1, 1867",
        "altSym454": "Jul 1, 1867",
        "altSym010": "Jul 1, 1867"
    },
    {
        "gregorianDate": "Oct 24,1947",
        "rataDie": "711058",
        "fixedDay2001": -19427,
        "julianDay": 2432482,
        "weekDay": "Fri",
        "defSym454": "Oct 26, 1947",
        "defSym010": "Oct 26, 1947",
        "altSym454": "Oct 26, 1947",
        "altSym010": "Oct 26, 1947"
    },
    {
        "gregorianDate": "Aug 10, 1995",
        "rataDie": "728515",
        "fixedDay2001": -1970,
        "julianDay": 2449939,
        "weekDay": "Thu",
        "defSym454": "Aug 11, 1995",
        "defSym010": "Aug 9, 1995",
        "altSym454": "Aug 11, 1995",
        "altSym010": "Aug 9, 1995"
    },
    {
        "gregorianDate": "Feb 29, 2000",
        "rataDie": "730179",
        "fixedDay2001": -306,
        "julianDay": 2451603,
        "weekDay": "Tue",
        "defSym454": "Feb 30, 2000",
        "defSym010": "Feb 28, 2000",
        "altSym454": "Feb 30, 2000",
        "altSym010": "Feb 28, 2000"
    },
    {
        "gregorianDate": "May 2, 2004",
        "rataDie": "731703",
        "fixedDay2001": 1218,
        "julianDay": 2453127,
        "weekDay": "Sun",
        "defSym454": "May 7, 2004",
        "defSym010": "May 5, 2004",
        "altSym454": "May 7, 2004",
        "altSym010": "May 5, 2004"
    },
    {
        "gregorianDate": "Dec 31, 2004",
        "rataDie": "731946",
        "fixedDay2001": 1461,
        "julianDay": 2453370,
        "weekDay": "Fri",
        "defSym454": "Dec 33, 2004", // Or Irv 5, 2004
        "defSym010": "Dec 35, 2004", // Or Irv 5, 2004
        "altSym454": "Jan 5, 2005",
        "altSym010": "Jan 5, 2005"
    },
    {
        "gregorianDate": "Feb 20, 2020",
        "rataDie": "737475",
        "fixedDay2001": 6990,
        "julianDay": 2458899,
        "weekDay": "Thu",
        "defSym454": "Feb 25, 2020",
        "defSym010": "Feb 23, 2020",
        "altSym454": "Feb 25, 2020",
        "altSym010": "Feb 23, 2020"
    },
    {
        "gregorianDate": "Feb 2, 2222",
        "rataDie": "811236",
        "fixedDay2001": 80751,
        "julianDay": 2532660,
        "weekDay": "Sat",
        "defSym454": "Feb 6, 2222",
        "defSym010": "Feb 4, 2222",
        "altSym454": "Feb 6, 2222",
        "altSym010": "Feb 4, 2222"
    },
    {
        "gregorianDate": "Mar 1, 3333",
        "rataDie": "1217048",
        "fixedDay2001": 486563,
        "julianDay": 2938472,
        "weekDay": "Sun",
        "defSym454": "Feb 35, 3333",
        "defSym010": "Mar 2, 3333",
        "altSym454": "Feb 35, 3333",
        "altSym010": "Mar 2, 3333"
    }
];

module.exports = symmetrical;