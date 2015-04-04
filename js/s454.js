/**
 * An implementation of the Symmetry454 calendar by Dr. Irv Bromberg, University of Toronto.
 *
 * Learn more at: http://individual.utoronto.ca/kalendis/symmetry.htm
 *
 * Algorithm adapted from https://github.com/mvanbesien/calendars
 */
Date.prototype.s454 = function() {
    // constants
    var year_short = 364;
    var year_long = 371;
    var month_short = 28;
    var month_long = 35;
    var days_up_to_unix_epoch = 719163;
    var full_cycle = 294 * 364;
    var one_day_in_ms = 86400000;
    
    // Determine the year and day number.
    var days_since_unix_epoch = Math.floor(this.getTime() / one_day_in_ms);
    var days_up_to_today = parseInt(days_up_to_unix_epoch + days_since_unix_epoch);
    var cycles_since_epoch = parseInt(days_up_to_today / full_cycle);
    
    var day = days_up_to_today % (full_cycle);
    var daynum = day;
    var year = 1 + (293 * cycles_since_epoch);
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
    
    // Determine the month and date.
    var isLeap = s454_isLeap(year);
    var month = 0;
    loop = true;
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
    var inputs = ['Dec 28 2014', 'Dec 29 2014'];
    var expecteds = ['Dec 28, 2014', 'Jan 1, 2015'];
    var start = 719160;
    var limit = 30;
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

function s454_toGregorian(year, daynum) {
    // constants
    var year_short = 364;
    var year_long = 371;
    var month_short = 28;
    var month_long = 35;
    var days_up_to_unix_epoch = 719163;
    var full_cycle = 294 * 364;
    var one_day_in_ms = 86400000;
    var unix_epoch_year = 1970;
    var unix_epoch_daynum = 4;
    var unix_epoch = 0;
    var date = new Date('1970-01-01T00:00:00.000Z')
    // @TODO while different, add/subtract days.
    // 1. go down to day zero or up to day 364/371
    // 2. down year or up year (check length)
    // 3. adjust day num.
    // someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 
    // Determine the year and day number.
    var days_since_unix_epoch = Math.floor((new Date('1/1/1970').getTime() / one_day_in_ms));
    var days_up_to_today = parseInt(days_up_to_unix_epoch + days_since_unix_epoch);
    var cycles_since_epoch = parseInt(days_up_to_today / full_cycle);
    var day = days_up_to_today % (full_cycle);
    var year = 1 + (293 * cycles_since_epoch);
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
    
    // Determine the month and date.
    var isLeap = s454_isLeap(year);
    var month = 0;
    loop = true;
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

    return date;
}

