console.log("BUZZ IN");
//var mySound = new buzz.sound( "/sounds/coin.wav");
var coinSound = new buzz.sound( "./sounds/coin", {
    formats: [ "mp3", "wav","ogg" ]
}).load();

var blipSound = new buzz.sound( "./sounds/blip", {
    formats: [ "mp3", "wav","ogg" ]
}).load();

var hurtSound = new buzz.sound( "./sounds/hurt", {
    formats: [ "mp3", "wav","ogg" ]
}).load();

$('#soundToggle').change(function(event) {
    event.stopPropagation();
    var myswitch = $(this);
    var show     = myswitch[0].selectedIndex == 1 ? true:false;

    if(show) {            
      for(var i in buzz.sounds) {
        buzz.sounds[i].unmute();
        coinSound.play();
      }
    } else {            
      for(var i in buzz.sounds) {
        buzz.sounds[i].mute();
      }
    }
});

//    .fadeIn()
//    .loop()
//    .bind( "timeupdate", function() {
//       var timer = buzz.toTimer( this.getTime() );
//       document.getElementById( "timer" ).innerHTML = timer;
//    });