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
  this.game.load.image('dust', 'assets/dust_puff_0018.png');

}

IFL.Tween.GameState.prototype.create = function() {
  "use strict";
  var oTween0, oTween1, rTween0, rTween1,
    y0=-150,
    ox=this.game.world.centerX-150,
    rx=this.game.world.centerX+150;

    this.WAIT_FOR_ONSET = 0;
    this.WAIT_FOR_RIME = 1;
    this.state = this.WAIT_FOR_ONSET;

    this.y1 = 500;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);


    // Sets background color to white.
    this.game.stage.backgroundColor = '#000000';


    var style = { font: "165px DidactGothic", fill: "#ff0044", align: "center" };
    this.onset = this.game.add.text(ox, y0, "bl", style);
    this.onset.anchor.set(1.0,0.5);
    var rime = this.game.add.text(rx, y0, "ank", style);
    rime.anchor.set(0.0,0.5);


    this.oEmitter = game.add.emitter(ox, this.y1, 100);
    this.oEmitter.makeParticles('dust');
    this.oEmitter.gravity = 200;

    this.rEmitter = game.add.emitter(rx, this.y1, 100);
    //emitter.makeParticles('dust');
    this.rEmitter.gravity = 200;

    oTween0 = this.game.add.tween(this.onset).to( { y: this.y1 }, 2000, Phaser.Easing.Bounce.Out, true);
    rTween0 = this.game.add.tween(rime).to( { y: this.y1 }, 2000, Phaser.Easing.Bounce.Out);
    oTween1 = this.game.add.tween(this.onset).to( {x: this.game.world.centerX}, 1000, Phaser.Easing.Bounce.Out);
    rTween1 = this.game.add.tween(rime).to( {x: this.game.world.centerX}, 1000, Phaser.Easing.Bounce.Out);
    oTween0.onComplete.add(function(){rTween0.start();}, this);
    rTween0.onComplete.add(function(){oTween1.start();rTween1.start()},this);

}

IFL.Tween.GameState.prototype.update = function() {
    "use strict";
    if((this.onset.y >= this.y1-10)&&(this.state == this.WAIT_FOR_ONSET)){
      this.state = this.WAIT_FOR_RIME;
      this.oEmitter.start(true, 2000, null, 10);
    }
}
/*
IFL.Tween.GameState.prototype.render = function() {
  "use strict";
}
*/