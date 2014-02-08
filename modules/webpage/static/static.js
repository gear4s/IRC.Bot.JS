$(function(){
    $('#add').on('click', function(e){
        if($(".addchan").is(":visible")) {
          $(".addchan").hide();
        } else {
          $(".addchan").show();
        }
    })
    $('.channel').on('click', function(e){
        var l = $(this).text().replace(/\./g, '_').replace(/\#/g, '');
        if($("#" + l).is(":visible")) {
          $("#" + l).hide();
        } else {
          $("#" + l).show();
        }
    })
});
