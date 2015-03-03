var IFL = IFL || {};

IFL.Tween = function(game){
  "use strict";
  this.game = game;
  this.game.state.add("tween", new IFL.Tween.GameState(this.game));
}

IFL.Tween.GameState = function(game) {
  "use strict";
  this.game = game;
}

IFL.Tween.GameState.prototype.preload = function () {
  "use strict";
}

IFL.Tween.GameState.prototype.create = function() {
  "use strict";
  var oTween0, oTween1, rTween0, rTween1,
    y0=-150,y1 = 500, 
    ox=this.game.world.centerX-150,
    rx=this.game.world.centerX+150;





    // Sets background color to white.
    this.game.stage.backgroundColor = '#ffffff';


    var style = { font: "165px DidactGothic", fill: "#ff0044", align: "center" };
    var onset = this.game.add.text(ox, y0, "bl", style);
    onset.anchor.set(1.0,0.5);
    var rime = this.game.add.text(rx, y0, "ank", style);
    rime.anchor.set(0.0,0.5);


    oTween0 = this.game.add.tween(onset).to( { y: y1 }, 2000, Phaser.Easing.Bounce.Out, true);
    rTween0 = this.game.add.tween(rime).to( { y: y1 }, 2000, Phaser.Easing.Bounce.Out);
    oTween1 = this.game.add.tween(onset).to( {x: this.game.world.centerX}, 1000, Phaser.Easing.Bounce.Out);
    rTween1 = this.game.add.tween(rime).to( {x: this.game.world.centerX}, 1000, Phaser.Easing.Bounce.Out);
    oTween0.onComplete.add(function(){rTween0.start();}, this);
    rTween0.onComplete.add(function(){oTween1.start();rTween1.start()},this);

}
/*
IFL.Tween.GameState.prototype.update = function() {
    "use strict";
}

IFL.Tween.GameState.prototype.render = function() {
  "use strict";
}
*/