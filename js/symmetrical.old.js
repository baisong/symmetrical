var symmetrical = {
  isLeap: function(year) {
    return (((52 * year) + 146) % 293) < 52;
  },
  getYearDay: function(date) {
    var year_short = 364;
    var year_long = 371;
    var days_up_to_unix_epoch = 719163;
    var full_cycle = 294 * 364;
    var one_day_in_ms = 86400000;
    
    // Determine the year and day number.
    var days_since_unix_epoch = Math.floor(date.getTime() / one_day_in_ms);
    var days_up_to_today = parseInt(days_up_to_unix_epoch + days_since_unix_epoch);
    var cycles_since_epoch = parseInt(days_up_to_today / full_cycle);
    var day = days_up_to_today % (full_cycle);
    var daynum = day;
    var year = 1 + (293 * cycles_since_epoch);
    var loop = true;
    while (loop) {
        var nbDaysInCurrentYear = (this.isLeap(year)) ? year_long : year_short;
        if (day > nbDaysInCurrentYear) {
            year++;
            day -= nbDaysInCurrentYear;
        }
        else {
            loop = false;
        }
    }
    return {
      year: year,
      day: day
    };
  },
  
  getMonthDay: function(year, day) {
    var month_short = 28;
    var month_long = 35;
    // Determine the month and date.
    var isLeap = this.isLeap(year);
    var month = 1;
    loop = true;
    while (loop && month < 13) {
      var daysInMonth = ((month % 3) == 2) ? month_long : month_short;
      if ((month == 12) && isLeap) {
        daysInMonth = month_long;
      }
      if (day > daysInMonth) {
        month++;
        day -= daysInMonth;
      } else {
        loop = false;
      }
    }
    
    return {
      month: month,
      day: day
    };
  },
  
  getFromDate: function (date) {
    var date = date || new Date();
    var y = this.getYearDay(date);
    return this.format(y, m);
  },
  getFromYearDay: function (year, day) {
    var y = {year: year, day: day};
    return this.format(y, m);
  },
  /**
   *
   * @param Date date
   */
  format: function(y, m) {
    var m = this.getMonthDay(y.year, y.day);
    var week = Math.floor((y.day - 1) / 7) + 1;
    var weekday = parseInt(y.day + 6) % 7 + 1;
    var monthweek = Math.floor((m.day - 1) / 7) + 1;
    var quarter = Math.floor((m.month - 1) / 3) + 1;
    var quartermonth = ((m.month + 2) % 3) + 1;
    var quarterday = y.day % (7 * 13);
    var quarterweek = Math.floor((quarterday - 1) / 7) + 1;
    
    symmetricalDate = {
      year: y.year,
      quarter: quarter,
      month: m.month,
      week: week,
      weekday: weekday,
      monthweek: monthweek,
      monthday: m.day,
      quartermonth: quartermonth,
      quarterweek: quarterweek,
      quarterday: quarterday,
      day: y.day
      //iso: date.toISOString()
    };
    symmetricalDate.mini = this.formatMini(symmetricalDate);
    symmetricalDate.short = this.formatShort(symmetricalDate);
    symmetricalDate.medium = this.formatMedium(symmetricalDate);
    symmetricalDate.long = this.formatLong(symmetricalDate);
    return symmetricalDate;
  },
  
  toGregorian: function(year, day) {
    return [year, day];
  },
  
  formatMini: function(sd) {
    var weekdays = ["M", "T", "W", "H", "F", "A", "S"];
    var parts = [sd.month, ('' + sd.monthweek + weekdays[(sd.weekday - 1)]), sd.year];
    var date = parts.join('/');
    return date;
  },
  
  formatShort: function(sd) {
    var weekdays = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];
    var date = sd.month + '-' + sd.monthweek + '-'
      + weekdays[sd.weekday - 1] + ', ' + sd.year;
    return date;
  },
  formatMedium: function(sd) {
    var weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = months[sd.month - 1] + '-' + sd.monthweek 
      + ' ' + weekdays[sd.weekday - 1] + ', ' + sd.year;
    return date;
  },
  formatLong: function(sd) {
    var weekdays = ["Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "Sun"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "Septermber", "October", "November", "December"];
    var nth = ['st', 'nd', 'rd', 'th', 'th'];
    var date = months[sd.month - 1] + ' '
      + sd.monthweek + nth[sd.monthweek - 1]
      + ' ' + weekdays[sd.weekday - 1] + 'day, ' + sd.year;
    return date;
  }
}

