$(document).ready(function() {
    $('#s454-gregorian').datepicker();
    $('#s454-gregorian').change(function(){
      $('#s454-symmetry454').val((new Date($(this).val())).toSymmetry454String());
    });
    var $calendar = $('#calendar');
    for (var i = 0; i < 4; i++) {
        id = 'q' + (i + 1);
        var classattr = 'quarter'
        $calendar.append('<div id="'+ id + '" class="' + classattr + '">');
        var $quarter = $('#' + id);
        for (var j = 0; j < 3; j++) {
            var monthnum = (i*3) + j;
            id = 'm' + (monthnum + 1);
            classattr = 'month qm' + (j + 1); 
            $quarter.append('<div id="'+ id + '" class="' + classattr + '">');
            var $month = $('#' + id);
            for (var k = 0; k < 5; k++) {
                if (j == 1 || k != 4) {
                    var weeknum = (i*13) + (j*4) + (j == 2 ? 1 : 0) + k;
                    var qweeknum = (j*4) + (j == 2 ? 1 : 0) + k;
                    id = 'w' + (weeknum + 1);
                    classattr = 'week qw' + (qweeknum + 1) + ' mw' + (k + 1); 
                    $month.append('<div id="'+ id + '" class="' + classattr + '">');
                    var $week = $('#' + id);
                    for (var l = 0; l < 7; l++) {
                        var daynum = (((i*13) + (j*4) + (j == 2 ? 1 : 0) + k)*7) + l;
                        var qdaynum = (((j*4) + (j == 2 ? 1 : 0) + k)*7) + l;
                        var mdaynum = k*7 + l;
                        id = 'd' + (daynum + 1);
                        classattr = 'day qd' + (qdaynum + 1) + ' md' + (mdaynum + 1) + ' wd' + (l + 1);
                        $week.append('<div id="'+ id + '" class="' + classattr + '">');
                    }
                }
            }
        }
    }
});
