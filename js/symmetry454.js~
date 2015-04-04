
function s454_isLeap(year) {
    return (((52 * year) + 146) % 293) < 52;
}

/**
 * Returns an array of 4 integers, for year, month, week and day.
 */
Date.prototype.toSymmetry454 = function() {
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

    return [parseInt(year), (month + 1), (Math.floor((day - 1) / 7) + 1), ((parseInt(day + 6) % 7) + 1)];
};

/**
 * Returns a string like "October-2 Tuesday 2014".
 */
Date.prototype.toSymmetry454String = function() {
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
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var date = months[month] + '-' + (Math.floor((day - 1) / 7) + 1) + ' ' + weekdays[weekday] + 'day ' + parseInt(year);

    return date;
};

/**
 * Returns a string like "2014-10-2T"-- similar to ISO 8601 date format.
 */
Date.prototype.toSymmetry454Short = function() {
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
    var m = month + 1;
    var weekday = parseInt(day + 6) % 7;
    var weekdays = ["M", "T", "W", "H", "F", "A", "S"];
    //var months = ["JA", "FE", "MC", "AP", "MY", "JN", "JL", "AU", "SE", "OC", "NV", "DE"];
    //var date = parseInt(year) + months[month] + (Math.floor((day - 1) / 7) + 1) + weekdays[weekday];
    var date = parseInt(year) + '-' + ((m < 10) ? '0' : '') + m + '-' + (Math.floor((day - 1) / 7) + 1) + weekdays[weekday];

    return date;
};
