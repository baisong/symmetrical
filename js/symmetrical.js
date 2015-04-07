/**
 * @TODO
 *
 * 1. Add high-level convert() function
 * 2. Verify tests using convert() (see symmetrical-test.js)
 */

Date.prototype.getDayNum = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((this - onejan) / 86400000);
};

var symmetrical = {};

symmetrical.weekdays = {
    1: {name: 'Monday'},
    2: {name: 'Tueday'},
    3: {name: 'Wednesday'},
    4: {name: 'Thursday'},
    5: {name: 'Friday'},
    6: {name: 'Saturday'},
    7: {name: 'Sunday'}
};
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
symmetrical.getWeekdayAbbr = function(weekdayNum) {
    return this.weekdays[weekdayNum].name.substring(0, 3);
};
symmetrical.getMonthAbbr = function(monthNum) {
    return this.months[monthNum].name.substring(0, 3);
};
symmetrical.getOrdinalSuffix = function(number) {
    if (number > 3 && number < 21) return 'th';
    switch (number % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};
symmetrical.defaultMaxMonth = 12;
symmetrical.alternateMaxMonth = 13;
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
    var gregYear = gregDate.getFullYear();
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
 *
 */
symmetrical.gregToDateObj = function(gregDate) {
    var date = new Date(gregDate.year, 0);
    return new Date(date.setDate(gregDate.dayOfYear));
};

/**
 *
 */
symmetrical.fixedToGreg = function (fixedDate) {
    var epochYear = this.gregYearLength(this.gregEpoch);
    if (fixedDate >= epochYear) {
        var gregDate = this.fixedToGregPositive(fixedDate);
    }
    else {
        var gregDate = this.fixedToGregNegative(fixedDate);
    }

    return this.gregToDateObj(gregDate);
};

symmetrical.symToGreg = function (symDate, leapCycle, monthRule) {
    var leapCycle = leapCycle || this.defaultLeapCycle;
    var monthRule = monthRule || this.defaultMonthRule;
    var fixedDate = this.symToFixed(symDate.year, symDate.monthOfYear, symDate.dayOfMonth, leapCycle, monthRule);
    return this.fixedToGreg(fixedDate);
};

symmetrical.gregToSym = function (gregDate, leapCycle, monthRule, maxMonth) {
    var leapCycle = leapCycle || this.defaultLeapCycle;
    var monthRule = monthRule || this.defaultMonthRule;
    var maxMonth = maxMonth || this.defaultMaxMonth;
    var fixedDate = this.gregToFixed(gregDate);
    return this.fixedToSymFull(fixedDate, leapCycle, monthRule, maxMonth);
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
    return shortTotal + (this.weekLength * leapTotal);
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
symmetrical.symToFixed = function (symYear, symMonth, symDay, leapCycle, monthRule) {
    var monthRule = monthRule || this.defaultMonthRule;
    var newYearDay = this.symNewYearDay(symYear, leapCycle);
    var dayOfYear = this.symDayOfYear(symMonth, symDay, monthRule);
    return newYearDay + dayOfYear - 1;
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
    return symYear;
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
    symDate.monthShort = this.getMonthAbbr(symDate.monthOfYear);
    symDate.monthLong = this.months[symDate.monthOfYear].name;
    symDate.dayOfMonth = symDate.dayOfYear - this.symDaysBeforeMonth(symDate.monthOfYear, monthRule);
    symDate.dayOfMonthSuffix = this.getOrdinalSuffix(symDate.dayOfMonth);
    symDate.weekOfMonth = this.ceiling(symDate.dayOfMonth / this.weekLength);
    symDate.weekOfMonthSuffix = this.getOrdinalSuffix(symDate.weekOfMonth);
    symDate.dayOfWeek = this.modulus(symDate.dayOfYear, 7) + 1;
    symDate.dayOfWeekShort = this.getWeekdayAbbr(symDate.dayOfWeek);
    symDate.dayOfWeekLong = this.weekdays[symDate.dayOfWeek].name;
    symDate.micro = this.formatSym(symDate, 'micro');
    symDate.short = this.formatSym(symDate, 'short');
    symDate.standard = this.formatSym(symDate, 'standard');
    symDate.medium = this.formatSym(symDate, 'medium');
    symDate.long = this.formatSym(symDate, 'long');
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

/**
 * Returns either a Date object, a symDate object, or false for invalid input.
 *
 * @TODO parse other formats.
 */
symmetrical.cleanSource = function(source) {
    if (this.isDateObj(source)) {
        return source;
    }
    if (this.isSymDate(source)) {
        return source;
    }
    return false;
};
symmetrical.isDateObj = function(dateObj) {
    return dateObj instanceof Date;
    //return (typeof dateObj.getDate == 'function' && typeof dateObj.getDay == 'function' && dateObj.getFullYear == 'function' && typeof dateObj.getMonth == 'function');
};
symmetrical.isSymDate = function(symDate) {
    return (typeof symDate.year != 'undefined' && symDate.dayOfYear != 'undefined');
};
symmetrical.convertDateObjectToSymDate = function(dateObj, altMonthRule, altLeapCycle, altMaxMonth) {
    var altMonthRule = altMonthRule || false;
    var altLeapCycle = altLeapCycle || false;
    var altMaxMonth = altMaxMonth || false;
    var monthRule = this.defaultMonthRule;
    var leapCycle = this.defaultLeapCycle;
    var maxMonth = this.defaultMaxMonth;
    if (altMonthRule) {
        monthRule = this.alternateMonthRule;
    }
    if (altLeapCycle) {
        leapCycle = this.alternateLeapCycle;
    }
    if (altMaxMonth) {
        maxMonth = this.alternateMaxMonth;
    }
    return this.gregToSym(dateObj, leapCycle, monthRule, maxMonth);
};

symmetrical.convertSymDateToDateObject = function(symDate, altMonthRule, altLeapCycle) {
    var altMonthRule = altMonthRule || false;
    var altLeapCycle = altLeapCycle || false;
    var monthRule = this.defaultMonthRule;
    var leapCycle = this.defaultLeapCycle;
    if (altMonthRule) {
        monthRule = this.alternateMonthRule;
    }
    if (altLeapCycle) {
        leapCycle = this.alternateLeapCycle;
    }
    return this.symToGreg(symDate, leapCycle, monthRule);
};

/**
 * Symmetrical formats (Ambiguous formatting)
 * Micro    12/35
 * Short    12/35/1999
 * Standard Dec 35, 1999
 * Medium   Sun, Dec 35, 1999
 * Long     Sunday, December 35th 1999
 */
symmetrical.formatSymAmbiguous = function(symDate, format) {
    formatted = false;
    switch (format) {
        case 'micro':
            formatted = [symDate.monthOfYear, symDate.dayOfMonth].join('/');
            break;
        case 'short':
            formatted = [symDate.monthOfYear, symDate.dayOfMonth, symDate.year].join('/');
            break;
        case 'standard':
            formatted = [symDate.monthShort, symDate.dayOfMonth + ',', symDate.year].join(' ');
            break;
        case 'medium':
            formatted = [symDate.dayOfWeekShort + ',', symDate.monthShort, symDate.dayOfMonth + ',', symDate.year].join(' ');
            break;
        case 'long':
            formatted = [symDate.dayOfWeekLong + ',', symDate.monthLong, symDate.dayOfMonth + symDate.dayOfMonthSuffix, symDate.year].join(' ');
            break;
    }

    return formatted;
};

/**
 * Symmetrical (Distinct formatting)
 * Micro    1999/12/5/7
 * Short    1999/12/5/Sun
 * Standard 5/Sun, Dec 1999
 * Medium   5th Sunday, Dec 1999
 * Long     5th Sunday of December 1999
 */
symmetrical.formatSym = function(symDate, format) {
    formatted = false;
    switch (format) {
        case 'micro':
            formatted = [symDate.year, symDate.monthOfYear, symDate.weekOfMonth, symDate.dayOfWeek].join('/');
            break;
        case 'short':
            formatted = [symDate.year, symDate.monthOfYear, symDate.weekOfMonth, symDate.dayOfWeekShort].join('/');
            break;
        case 'standard':
            formatted = [symDate.weekOfMonth + '/' + symDate.dayOfWeekShort + ',', symDate.monthShort, symDate.year].join(' ');
            break;
        case 'medium':
            formatted = [symDate.weekOfMonth + symDate.weekOfMonthSuffix, symDate.dayOfWeekLong + ',', symDate.monthShort, symDate.year].join(' ');
            break;
        case 'long':
            formatted = [symDate.weekOfMonth + symDate.weekOfMonthSuffix, symDate.dayOfWeekLong, 'of', symDate.monthLong, symDate.year].join(' ');
            break;
    }

    return formatted;
};

/**
 * Gregorian date formats
 * Micro    12/31
 * Short    12/31/1999
 * Standard Dec 31, 1999
 * Medium   Sun, Dec 31, 1999
 * Long     Sunday, December 31st 1999
 */
symmetrical.formatGreg = function(dateObj, format) {
    formatted = false;
    var dayOfMonth = dateObj.getDate();
    var dayOfMonthSuffix = this.getOrdinalSuffix(dayOfMonth);
    var dayOfWeek = dateObj.getDay() + 1;
    var year = dateObj.getFullYear();
    var monthOfYear = dateObj.getMonth();
    var monthLong = this.months[monthOfYear].name;
    var monthShort = this.getMonthAbbr(monthOfYear);
    var dayOfWeekLong = this.weekdays[dayOfWeek];
    var dayOfWeekShort = this.getWeekdayAbbr(dayOfWeek);
    switch (format) {
        case 'micro':
            formatted = [monthOfYear, dayOfMonth].join('/');
            break;
        case 'short':
            formatted = [monthOfYear, dayOfMonth, year].join('/');
            break;
        case 'standard':
            formatted = [monthShort, dayOfMonth + ',', year].join(' ');
            break;
        case 'medium':
            formatted = [dayOfWeekShort + ',', monthShort, dayOfMonth + ',', year].join(' ');
            break;
        case 'long':
            formatted = [dayOfWeekLong + ',', monthLong, dayOfMonth + dayOfMonthSuffix + ',', year].join(' ');
            break;
    }

    return formatted;
};


/**
 * Formats
 */
symmetrical.format = function(date, target, format, distinctFormatting) {
    var format = format || 'short';
    if (format != 'micro' && format != 'short' && format != 'standard' && format != 'medium' && format != 'long') {
        return 'Unknown format';
    }
    var formatted = 'Unknown target';
    if (target == 'sym') {
        var distinctFormatting = distinctFormatting || true;
        if (distinctFormatting) {
            formatted = this.formatSym(date, format);
        }
        else {
            formatted = this.formatSymAmbiguous(date, format);
        }
    }
    else if (target == 'greg') {
        formatted = this.formatGreg(date, format);
    }
    return formatted;
};

/**
 * Converts a date object to a symDate object or formatted string, OR converts a symDate to a date object.
 *
 * @param source (mixed)
 *   Accepts a date object for gregorian-to-symmetrical conversions, OR one of the following symmetrical formats:
 *   - object: {year: 1999, dayOfYear: 365} -- The output of symmetrical.convert()
 *   - @TODO string: "Dec 35, 1999" -- The output of symmetrical.formatSymAmbiguous(symDate, 'standard');
 *   - @TODO string: "1999/12/5/1" -- The output of symmetrical.formatSym(symDate, 'micro');
 * @param format (string)
 *   Defaults to 'object'. Use one of 'micro', 'short', 'standard', 'medium', or 'long' for formatted strings.
 *   See symmetrical.format() for format definitions.
 * @param distinctFormatting (bool)
 *   Defaults to true. Only affects formatted (string) output when converting from gregorian to symmetrical. Distinct
 *   formats like "1999/12/5/Sun" are unambiguously not gregorian dates. Use false for date strings like "12/35/1999".
 *   See symmetrical.format() for format definitions.
 * @param altMonthRule (bool)
 *   Defaults to false, or "Symmetry454" month lengths 28 and 35. Use false for "Symmetry010" month lengths 30 and 31.
 * @param altLeapCycle (bool)
 *   Defaults to false. Use true to calculate leap years using the longer cycle that optimizes for north solstice.
 * @param altMaxMonth (bool)
 *   Defaults to false. Use true to treat leap week days as a separate 13th month "Irvember (Irv)"
 */
symmetrical.convert = function(source, format, distinctFormatting, altMonthRule, altLeapCycle, altMaxMonth) {
    var source = this.cleanSource(source);
    if (source === false) {
        return false;
    }
    
    var format = format || 'short';
    var distinctFormatting = distinctFormatting || true;
    var altMonthRule = altMonthRule || false;
    var altLeapCycle = altLeapCycle || false;
    var altMaxMonth = altMaxMonth || false;
    var converted = false;
    var target = false;
    if (this.isDateObj(source)) {
        target = 'sym';
        converted = this.convertDateObjectToSymDate(source, altMonthRule, altLeapCycle, altMaxMonth);
    }
    else if (this.isSymDate(source)) {
        target = 'greg';
        converted = this.convertSymDateToDateObject(source, altMonthRule, altLeapCycle);
    }
    if (converted === false) {
        return -1;
    }
    var formatted = converted;
    if (format != 'object') {
        formatted = this.format(converted, target, format, distinctFormatting);
    }

    return formatted;
};

module.exports = symmetrical;
