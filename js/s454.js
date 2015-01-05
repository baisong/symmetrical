/**
 * An implementation of the Symmetry454 calendar by Dr. Irv Bromberg, University of Toronto.
 *
 * Learn more at: http://individual.utoronto.ca/kalendis/symmetry.htm
 *
 * Algorithm adapted from https://github.com/mvanbesien/calendars
 */
Date.prototype.s454 = function(days_up_to_unix_epoch, debug) {
    // constants
    var one_day_in_ms = 86400000;
    var oneAD_to_1970 = 719163;
    var year_short = 364;
    var year_long = 371;
    var month_short = 28;
    var month_long = 35;
    var days_since_unix_epoch = Math.floor(this.getTime() / one_day_in_ms);
    // How many days passed between Jan 1, 1 AD and Jan 1, 1970.
    // 719170;//719163;//719162
    debug = !(typeof debug === "undefined");
    days_up_to_unix_epoch = (typeof days_up_to_unix_epoch === "undefined") ? oneAD_to_1970 : days_up_to_unix_epoch;
    var full_cycle = 294 * 364;//293 * 365 + 71;
    if (debug) console.log('[0] the date:' + this.toISOString());
    var days_up_to_today = parseInt(days_up_to_unix_epoch + days_since_unix_epoch);
    if (debug) console.log('[1] Days up to today: ' + days_up_to_today);
    var cycles_since_epoch = parseInt(days_up_to_today / (full_cycle));
    if (debug) console.log('[2] # full cycles since 1AD: ' + cycles_since_epoch);
    var day = days_up_to_today % (full_cycle);
    if (debug) console.log('[3] days since last full cycle end: ' + day);
    var year = (293 * cycles_since_epoch);//293
    if (debug) console.log('[4] year init: ' + year);
    var loop = true;
    while (loop) {
        var nbDaysInCurrentYear = (s454_isLeap(year)) ? year_long : year_short;
        if (day > nbDaysInCurrentYear) {
            year++;
            day -= nbDaysInCurrentYear;
        }
        else {
            loop = false;
        }
    }
    var isLeap = s454_isLeap(year);
    if (debug) console.log('[5] year done: ' + year + ((isLeap) ? ' (leap)' : ''));
    var month = 0;
    loop = true;
    if (debug) console.log('[6] day  init:')
    while (loop && month < 12) {
        var daysInMonth = ((month % 3) - 1 == 0) ? month_long : month_short;
        if ((month == 11) && isLeap) {
            daysInMonth = month_long;
        }
        if (day > daysInMonth) {
            month++;
            day -= daysInMonth;
        } else {
            loop = false;
        }
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
    return (((52 * year) + 146) % 293) < 52;
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
