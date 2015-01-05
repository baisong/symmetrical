$( document ).ready(function() {
    $('#s454-gregorian').timepicker();
    $('#s454-gregorian').change(function(){
      $('#s454-symmetry454').val((new Date($(this).val())).toSymmetry454String());
    });
});
