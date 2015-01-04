/**
 * An implementation of the Symmetry454 calendar by Dr. Irv Bromberg, University of Toronto.
 *
 * Learn more at: http://individual.utoronto.ca/kalendis/symmetry.htm
 *
 * Algorithm adapted from https://github.com/mvanbesien/calendars
 */
Date.prototype.s454 = function() {
    // constants
    var day_in_ms = 86400000;
    var days_since_epoch = 719163;

    var referenceDay = (this.getTime() / day_in_ms) + days_since_epoch;
    var trunkedReferenceDay = parseInt(referenceDay);
    var cycle = trunkedReferenceDay / (293 * 365 + 71);
    var day = trunkedReferenceDay % (293 * 365 + 71);
    var year = 293 * cycle;
    var loop = true;
    while (loop) {
        year++;
        var nbDaysInCurrentYear = (52 * year + 166) % 293 < 52 ? 371 : 364;
        if (day > nbDaysInCurrentYear)
            day -= nbDaysInCurrentYear;
        else
            loop = false;
    }

    var month = 0;
    loop = true;
    while (loop && month != 12) {
        var daysInMonth = ((month % 3) - 2 == 0) ? 35 : 28;
        if (day > daysInMonth) {
            month++;
            day -= daysInMonth;
        } else
            loop = false;
    }

    var weekday = parseInt(day) % 7;
    var weekdays = ["Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "Sun"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = weekdays[weekday] + 'day, ' + months[month] + ' '  + day + ' ' + parseInt(year);

    return date;
};

function s454_test(timestamp) {
  return (new Date(timestamp)).s454();
}
