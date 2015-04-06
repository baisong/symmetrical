/**
 * Created by oren on 4/4/15.
 */

Date.prototype.getDayNum = function() {
    var onejan = new Date(this.getFullYear(),0,1);
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

symmetrical.weekLength = 7;
symmetrical.weeksInShortYear = 52;
symmetrical.weeksInLongYear = 53;
symmetrical.yearShort = function() {
    return this.weeksInShortYear * this.weekLength;
};
symmetrical.yearLong = function() {
    return this.weeksInLongYear * this.weekLength;
};
symmetrical.floor = function(x){
    return Math.floor(x);
};
symmetrical.cieling = function(){
    return Math.cieling(x);
};
symmetrical.quotient = function(x, y){
    return this.floor(x / y);
};
symmetrical.modulus = function(x, y){
    return x - (y * this.quotient(x, y));
};
symmetrical.amod = function(x, y){
    return y + this.modulus(x, (-1 * y));
};

/**
 * The Symmetry454 and Symmetry010 calendars share the same epoch as the Gregorian calendar, starting on
 * Monday, January 1, 1 AD. This is the same epoch as that of the ISO calendar and the Revised Julian calendar
 * @type {int}
 */
symmetrical.symEpoch = 1;

symmetrical.gregEpoch = 0;

symmetrical.defaultLeapCycle = {
    years: 293,
    leaps: 52
};
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
symmetrical.getLeapCoefficient = function (leapCycleYears) {
    return (leapCycleYears - 1) / 2;
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
symmetrical.fixedToWeekdayNum = function(fixedDate) {
    return this.modulus(this.floor(fixedDate) - this.weekdayAdjust(fixedDate), this.weekLength);
};

/**
 * WeekdayAdjust = modulus( SymEpoch – 1, 7 )
 */
symmetrical.weekdayAdjust = function(fixedDate) {
    return this.modulus(this.symEpoch - fixedDate, this.weekLength);
};

/**
 * Symmetry454 and Symmetry010 calendar arithmetic functions boil down to three main calculations:
 * 1. Find where the calendar year starts: the Symmetry454 = Symmetry010 New Year Day.
 * 2. Optionally determine if the year is a Symmetry454 = Symmetry010 leap year (usually not necessary).
 * 3. Compute the parameters that are set by the calendar structure, which are same for all Symmetry454 and
 * Symmetry010 years: ordinal day number, ordinal week number, quarters, months, weeks, days,
 * weekdays. Some of these parameters are optional, depending on the application requirements.
 */
symmetrical.symToFixed = function(symDate) {

};

symmetrical.fixedToSym = function(fixedDate) {

};

/**
 * To convert a Gregorian date to a fixed date, which can then be converted to a Symmetry454 or Symmetry010
 * date, it is convenient to calculate how many days have elapsed from the Gregorian epoch to the day before the
 * Gregorian year started, then add in the ordinal day number within the Gregorian year.
 * @param gregDate
 */
symmetrical.gregToFixed = function(gregDate) {
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
symmetrical.priorElapsedDays = function(gregYear) {
    var priorYear = gregYear - 1;
    var days = this.gregEpoch + (priorYear * 365);
    days += this.floor(priorYear / 4);
    days -= this.floor(priorYear / 100);
    days += this.floor(priorYear / 400);
    days -= 1;
    return days;
};

symmetrical.fixedToGreg = function(fixedDate) {

};

symmetrical.symToGreg = function(symDate) {
    return this.fixedToGreg(this.symToFixed(symDate));
};

symmetrical.gregToSym = function (gregDate) {
    return this.fixedToSym(this.gregToFixed(gregDate));
};


symmetrical.symToGreg1 = function(symDate) {

};

/**
 * isSymLeapYear( SymYear ) = modulus( L ! SymYear + K, C ) < L
 where C is the number of years per cycle = 293 (a prime number), L is the number of leap years per cycle = 52,
 and K = (C-1) / 2 = 146. The K coefficient ensures that leap years are symmetrically arranged, and the modulus
 operation ensures that leap years are as smoothly spread as possible.
 The quantity modulus( L ! SymYear + K, C ) is also known as the accumulator.
 */
symmetrical.isSymLeapYear = function(symYear) {
    /**
     * modulus( L ! SymYear + K, C ) < L
     where C is the number of years per cycle = 293 (a prime number), L is the number of leap years per cycle = 52,
     and K = (C-1) / 2 = 146. The K coefficient ensures that leap years are symmetrically arranged, and the modulus
     operation ensures that leap years are as smoothly spread as possible.
     The quantity modulus( L ! SymYear + K, C ) is also known as the accumulator.
      */
};

/**
 * @TODO SymNewYearDay( )
 *
 * TEST: symNewYearDay(2010) == 733776
 * TEST: symNewYearDay(2010, alternate) == 733769
 */
symmetrical.symNewYearDay = function(symYear, leapCycle) {
    var leapCycle = leapCycle || this.defaultLeapCycle;
    var priorYear = symYear - 1;
    var shortTotal = this.symEpoch + (this.yearShort() * priorYear);
    var K = this.getLeapCoefficient(leapCycle.years);
    var leapTotal = this.floor(((leapCycle.leaps * priorYear) + K) / leapCycle.years);
    return shortTotal + leapTotal;
};

/**
 * TEST: 6 => 154
 * TEST: 6, alt => 152
 * @param symMonth
 * @param monthRule
 * @returns {number}
 */
symmetrical.symDaysBeforeMonth = function(symMonth, monthRule) {
    var monthRule = monthRule || this.defaultMonthRule;
    var difference = monthRule.long - monthRule.short;
    return (monthRule.short * (symMonth - 1)) + (difference * this.quotient(symMonth, 3));
};
