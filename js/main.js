var demo = {};
demo.year = 2015;
demo.last_converted = '';
demo.monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
var $greg = $('#s454-gregorian');
var $s454 = $('#s454-symmetry454');
$(document).ready(function () {
    var convert = function (e) {
        var dateText = $greg.val();
        if (dateText != demo.last_converted) {
            if (/^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/.test(dateText)) {
                /* var s454 = (new Date(dateText)).toSymmetry454String();
                 var s454o = (new Date(dateText)).toSymmetry454(); */
                sd = symmetrical.comvert(new Date(dateText), 'object');
                var year = sd.year;
                var month = sd.monthOfYear;
                var quarter = sd.quarter;
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
                        var greg = symmetrical.convert(sd);
                        var date = symmetrical.convert(sd, 'object');
                        var sym = symmetrical.getGregorian(date);
                        $this.data('sym', sym);
                        $this.data('greg', greg);
                    }
                });
            }
        }
    };
    $('#s454-gregorian').datepicker({
        onSelect: function (d, i) {
            if (d !== i.lastVal) {
                $(this).change();
            }
        }
    });
    $('#s454-gregorian').change(convert);
    $('#s454-gregorian').keydown(convert);
    $('#s454-gregorian').blur(convert);
    var $calendar = $('#calendar');
    $calendar.append('<h1 class="yearname">' + demo.year + '</h1>');
    for (var i = 0; i < 4; i++) {
        id = 'q' + (i + 1);
        var classattr = 'quarter'
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
                if (j == 1 || k != 4) {
                    var weeknum = (i * 13) + (j * 4) + (j == 2 ? 1 : 0) + k;
                    var qweeknum = (j * 4) + (j == 2 ? 1 : 0) + k;
                    id = 'w' + (weeknum + 1);
                    classattr = 'week qw' + (qweeknum + 1) + ' mw' + (k + 1);
                    $month.append('<div id="' + id + '" class="' + classattr + '">');
                    var $week = $('#' + id);
                    for (var l = 0; l < 7; l++) {
                        var daynum = (((i * 13) + (j * 4) + (j == 2 ? 1 : 0) + k) * 7) + l;
                        var qdaynum = (((j * 4) + (j == 2 ? 1 : 0) + k) * 7) + l;
                        var mdaynum = k * 7 + l;
                        id = 'd' + (daynum + 1);
                        classattr = 'day qd' + (qdaynum + 1) + ' md' + (mdaynum + 1) + ' wd' + (l + 1);
                        $week.append('<div id="' + id + '" data-day="' + (daynum + 1) + '" data-gregorian="" class="' + classattr + '">');
                    }
                }
            }
        }
    }
    $('.day').click(function (e) {
        e.preventDefault();
        var dayNum = parseInt($(this).attr('id').substring(1));
        var year = parseInt($('.yearname').text());
    });
    function timeout() {
        setTimeout(function () {
            convert();
            timeout();
        }, 1000);
    }

    timeout();
});
