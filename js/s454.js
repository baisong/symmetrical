/**
 * An implementation of the Symmetry454 calendar by Dr. Irv Bromberg, University of Toronto.
 *
 * Learn more at: http://individual.utoronto.ca/kalendis/symmetry.htm
 *
 * Algorithm adapted from https://github.com/mvanbesien/calendars
 */
Date.prototype.s454 = function(days_since_epoch, debug) {
    // constants
    var day_in_ms = 86400000;
    // # of days since Jan 1, 0 CE and UNIX epoch of Jan 1 1970.
    //var days_since_epoch = 719170;
    debug = !(typeof debug === "undefined");
    days_since_epoch = (typeof days_since_epoch === "undefined") ? 719170 : days_since_epoch;
    var full_cycle = 293 * 365 + 71;

    var refDay = parseInt((this.getTime() / day_in_ms) + days_since_epoch);
    if (debug) console.log('[1] refDay: ' + refDay);
    var cycles_since_epoch = parseInt(refDay / (full_cycle));
    if (debug) console.log('[2] # full cycles since 0AD: ' + cycles_since_epoch);
    var day = refDay % (full_cycle);
    if (debug) console.log('[3] days since last full cycle end: ' + day);
    var year = 293 * cycles_since_epoch;
    if (debug) console.log('[4] year init: ' + year);
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
    if (debug) console.log('[5] year done: ' + year + ((isLeap) ? ' (leap)' : ' (not leap)'));
    var month = 0;
    loop = true;
    if (debug) console.log('[6] day  init:')
    while (loop && month < 12) {
        var daysInMonth = ((month % 3) - 2 == 0) ? 35 : 28;
        if (day > daysInMonth) {
            month++;
            day -= daysInMonth;
        } else
            loop = false;
    }
    if (debug) console.log('[7] day  done: ' + day);
    if (debug) console.log('[8] mnth done: ' + month);

    var weekday = parseInt(day + 6) % 7;
    var weekdays = ["Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "Sun"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = weekdays[weekday] + 'day, ' + months[month] + ' '  + day + ' ' + parseInt(year);

    return date;
};

function s454_isLeap(year) {
    return ((52 * year + 146) % 293) < 52;
}

function s454_assert(input, out, days) {
    var actual = (new Date(input)).s454(days);
    return (actual.indexOf(out) !== -1);
}

function s454_runtests(days) {
    /*
    var year = 2008;
    for (var i = 0; i < 8; i++) {
        answer = (s454_isLeap(year + i)) ? 'LEAP' : '';
        console.log(parseInt(year + i) + ': ' + answer);
    }
    */
    var inputs = ['Dec 28 2014', 'Dec 29 2014'];
    var expecteds = ['Dec 28, 2014', 'Jan 1, 2015'];
    var start = 719170 - 366;
    var limit = 366 * 2;
    var one_passed = false;
    var pass_counts = [0, 0, 0];
    for (var i = 0; i < limit; i++) {
        var passed = 0;
        for (var j = 0; j < 2; j++) {
            //console.log(inputs[j] + ' ?= ' + expecteds[j]);
            if (s454_assert(inputs[j], expecteds[j], start + i)) {
                passed += 1;
            }
        }
        pass_counts[passed]++;
        if (passed == 2) {
            one_passed = true;
            console.log('PASSED: ' + (start + i));
        }
    }
    console.log('Pass counts:');
    console.log(pass_counts);
}

function s454_test(timestamp, days) {
  return (new Date(timestamp)).s454(days);
}
