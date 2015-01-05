/**
 * An implementation of the Symmetry454 calendar by Dr. Irv Bromberg, University of Toronto.
 *
 * Learn more at: http://individual.utoronto.ca/kalendis/symmetry.htm
 *
 * Algorithm adapted from https://github.com/mvanbesien/calendars
 */
Date.prototype.s454 = function(days_since_epoch) {
    // constants
    var day_in_ms = 86400000;
    // # of days since Jan 1, 0 CE and UNIX epoch of Jan 1 1970.
    //var days_since_epoch = 719170;
    days_since_epoch = (typeof days_since_epoch === "undefined") ? 719170 : days_since_epoch;
    var full_cycle = 293 * 365 + 71;

    var refDay = parseInt((this.getTime() / day_in_ms) + days_since_epoch);
    console.log('[1] refDay: ' + refDay);
    var cycles_since_epoch = parseInt(refDay / (full_cycle));
    console.log('[2] # full cycles since 0AD: ' + cycles_since_epoch);
    var day = refDay % (full_cycle);
    console.log('[3] days since last full cycle end: ' + day);
    var year = 293 * cycles_since_epoch;
    console.log('[4] year init: ' + year);
    var loop = true;
    while (loop) {
        year++;
        var nbDaysInCurrentYear = (52 * year + 146) % 293 < 52 ? 371 : 364;
        if (day > nbDaysInCurrentYear)
            day -= nbDaysInCurrentYear;
        else
            loop = false;
    }
    var isLeap = ((52 * year + 166) % 293 < 52);
    console.log('[5] year done: ' + year + ((isLeap) ? ' (leap)' : ' (not leap)'));
    var month = 0;
    loop = true;
    console.log('[6] day  init:')
    while (loop && month < 12) {
        var daysInMonth = ((month % 3) - 2 == 0) ? 35 : 28;
        if (day > daysInMonth) {
            month++;
            day -= daysInMonth;
        } else
            loop = false;
    }
    console.log('[7] day  done: ' + day);
    console.log('[8] mnth done: ' + month);

    var weekday = parseInt(day + 6) % 7;
    var weekdays = ["Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "Sun"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = weekdays[weekday] + 'day, ' + months[month] + ' '  + day + ' ' + parseInt(year);

    return date;
};

function s454_isLeap(year) {
    return ((52 * year + 146) % 293) < 52;
}

function s454_assert(input, out) {
    var actual = (new Date(input)).s454();
    if (actual.indexOf(out)) {
        console.log('PASSED: "' + input + '" => "' + out + '"');
    }
    else {
        console.log('FAILED: "' + input + '" => "' + out + '" ACTUAL: "' + actual + '"');
    }
}

function s454_runtests() {
    var year = 2008;
    for (var i = 0; i < 8; i++) {
        answer = (s454_isLeap(year + i)) ? 'LEAP' : '';
        console.log(year + ': ' + answer);
    }
    
    s454_assert('Dec 28 2014', 'Dec 28 2014');
    s454_assert('Dec 29 2014', 'Jan 1 2015');
}

function s454_test(timestamp, days) {
  return (new Date(timestamp)).s454(days);
}
