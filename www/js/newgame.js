var IFL = IFL || {};

IFL.NewGame = function(game){
  "use strict";
  this.game = game;
  this.game.state.add("flock", new IFL.NewGame.GameState(this.game));
}

IFL.NewGame.GameState = function(game) {
  "use strict";
  this.game = game;
}

IFL.NewGame.GameState.prototype.preload = function () {
  "use strict";
}

IFL.NewGame.GameState.prototype.create = function() {
  "use strict";
}

IFL.NewGame.GameState.prototype.update = function() {
    "use strict";
}

IFL.NewGame.GameState.prototype.render = function() {
  "use strict";
}








