$(function(){
    $('div.chanlist div').on('click', function(e){
        if($(".menu", this).is(":visible")) {
          $(".menu", this).hide();
        } else {
          $(".menu", this).show();
        }
    });

    // popups
    $(".pop").click(
      function(event) {
        $("#"+$(this).attr("value")).dialog();
      }
    );
});
