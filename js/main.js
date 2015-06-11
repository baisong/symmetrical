var today = new Date();
var demo = {};
demo.year = today.getFullYear();
demo.last_converted = '';
demo.monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
var $greg = $('#s454-gregorian');
var $s454 = $('#s454-symmetry454');
$(document).ready(function () {
    var $gregInput = $('#s454-gregorian');
    var $symInput = $('#s454-symmetry454');
    var convert = function (e) {
        var dateText = $greg.val();
        if (dateText != demo.last_converted) {
            if (/^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/.test(dateText)) {
                /* var s454 = (new Date(dateText)).toSymmetry454String();
                 var s454o = (new Date(dateText)).toSymmetry454(); */
                sd = symmetrical.convert(new Date(dateText), 'object');
                var year = sd.year;
                var quarter = sd.quarter;
                var month = sd.monthOfQuarter;
                var week = sd.weekOfMonth;
                var day = sd.dayOfWeek;
                $('.yearname').text(year);
                $('.date-selected').removeClass('date-selected');
                var sel = '.quarter:nth-of-type(' + quarter
                    + ') .month:nth-of-type(' + month
                    + ') .week:nth-of-type(' + week
                    + ') .day:nth-of-type(' + day + ')';

                $(sel).addClass('date-selected');
                $s454.val(sd.standard);
                demo.last_converted = dateText;
                console.log(dateText + ' --> ' + sd.micro);
                console.log(sd);
                var $calendar = $('#calendar');
                $calendar.find('.day').each(function () {
                    var $this = $(this);
                    var day = parseInt($this.data('day'));
                    if (day > 0) {
                        var thisSymDate = symmetrical.symToSymFull({year: sd.year, dayOfYear: day});
                        var thisGregDate = symmetrical.convert(thisSymDate, 'datepicker');
                        //var thisGregDateObj = symmetrical.convert(thisSymDate, 'object');
                        var sym = thisSymDate.standard;
                        $this.data('sym', sym);
                        $this.data('greg', thisGregDate);
                    }
                });
            }
        }
    };
    $gregInput.datepicker({
        onSelect: function (d, i) {
            if (d !== i.lastVal) {
                $(this).change();
            }
        }
    });
    $gregInput.change(convert);
    $gregInput.keydown(convert);
    $gregInput.blur(convert);
    var $calendar = $('#calendar');
    $calendar.append('<h1 class="yearname">' + demo.year + '</h1>');
    var todaySym = symmetrical.convert(today);
    var todayFmt = symmetrical.formatGreg(today, 'datepicker');
    for (var i = 0; i < 4; i++) {
        id = 'q' + (i + 1);
        var classattr = 'quarter quarter-' + (i + 1);
        $calendar.append('<div id="' + id + '" class="' + classattr + '">');
        var $quarter = $('#' + id);
        for (var j = 0; j < 3; j++) {
            var monthnum = (i * 3) + j;
            id = 'm' + (monthnum + 1);
            classattr = 'month qm' + (j + 1);
            $quarter.append('<div id="' + id + '" class="' + classattr + '">');
            var $month = $('#' + id);
            $month.append('<h2 class="monthname">' + demo.monthNames[monthnum] + '</h2>');
            for (var k = 0; k < 5; k++) {
                var onLeapWeek = (i == 3 && j == 2 && k == 4);
                if (j == 1 || k < 4 || onLeapWeek) {
                    var weeknum = (i * 13) + (j * 4) + (j == 2 ? 1 : 0) + k;
                    var qweeknum = (j * 4) + (j == 2 ? 1 : 0) + k;
                    var id = 'w' + (weeknum + 1);
                    var classattr = 'week qw' + (qweeknum + 1) + ' mw' + (k + 1);
                    var style = '';
                    if (onLeapWeek) {
                        classattr += ' leapweek';
                        style = 'style="display: none;"';
                        if (todaySym.isLeap) {
                            style = 'style="display: block;"';
                        }
                    }
                    $month.append('<div id="' + id + '" class="' + classattr + '" ' + style + '>');
                    var $week = $('#' + id);
                    for (var l = 0; l < 7; l++) {
                        var daynum = (((i * 13) + (j * 4) + (j == 2 ? 1 : 0) + k) * 7) + l;
                        var qdaynum = (((j * 4) + (j == 2 ? 1 : 0) + k) * 7) + l;
                        var mdaynum = k * 7 + l;
                        id = 'd' + (daynum + 1);
                        classattr = 'day qd' + (qdaynum + 1) + ' md' + (mdaynum + 1) + ' wd' + (l + 1);
                        var dayOfYear = daynum + 1;
                        var sym = '';
                        var greg = '';
                        if (dayOfYear > 0) {
                            var symDate = symmetrical.symToSymFull({year: demo.year, dayOfYear: dayOfYear});
                            var greg = symmetrical.convert(symDate, 'datepicker');
                            var sym = symDate.standard;
                            if (greg == today) {
                                classattr += ' date-selected';
                                $gregInput.val(today);
                            }
                        }
                        $week.append('<div id="' + id + '" data-day="' + dayOfYear + '" data-greg="' + greg + '" data-sym="' + sym + '" class="' + classattr + '">');
                    }
                }
            }
        }
    }
    $('.day').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var gregDate = $this.data('greg');
        var symDate = $this.data('sym');
        $gregInput.val(gregDate);
        $symInput.val(symDate);
        if (!$this.hasClass('date-selected')) {
            $('.date-selected').removeClass('date-selected');
            $this.addClass('date-selected');
        }
        //$gregInput.trigger('change');
    });
    function timeout() {
        setTimeout(function () {
            convert();
            timeout();
        }, 1000);
    }

    timeout();
});
