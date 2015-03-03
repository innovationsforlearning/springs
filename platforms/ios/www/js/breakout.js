var IFL = IFL || {};

IFL.Breakout = function(game){
  //this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');
  this.game = game;
  this.game.state.add("breakout", new IFL.Breakout.GameState(this.game));
}

IFL.Breakout.GameState = function(game) {
  this.game = game;
}

IFL.Breakout.GameState.prototype.preload = function () {

    this.game.load.atlas('breakout', 'assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
    //this.game.load.image('starfield', 'assets/misc/starfield.jpg');

    // load filter
    this.game.load.script('filter', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/Plasma.js');


}

IFL.Breakout.GameState.prototype.releaseBall = function () {

    if (this.ballOnPaddle)
    {
        this.ballOnPaddle = false;
        this.ball.body.velocity.y = -300;
        this.ball.body.velocity.x = -75;
        this.ball.animations.play('spin');
        this.introText.visible = false;
    }

}

IFL.Breakout.GameState.prototype.ballLost = function () {

    this.lives--;
    this.livesText.text = 'lives: ' + this.lives;

    if (this.lives === 0)
    {
        this.gameOver();
    }
    else
    {
        this.ballOnPaddle = true;

        this.ball.reset(this.paddle.body.x + 16, this.paddle.y - 16);
        
        this.ball.animations.stop();
    }

}

IFL.Breakout.GameState.prototype.gameOver = function () {

    this.ball.body.velocity.setTo(0, 0);
    
    this.introText.text = 'Game Over!';
    this.introText.visible = true;
    //this.game=null;
    IFL.games.springs.game.state.start('springs');

}

IFL.Breakout.GameState.prototype.ballHitBrick = function(_ball, _brick) {

    _brick.kill();

    this.score += 10;

    this.scoreText.text = 'score: ' + this.score;

    //  Are they any bricks left?
    if (this.bricks.countLiving() == 0)
    {
        //  New level starts
        this.score += 1000;
        this.scoreText.text = 'score: ' + this.score;
        this.introText.text = '- Next Level -';

        //  Let's move the ball back to the paddle
        this.ballOnPaddle = true;
        this.ball.body.velocity.set(0);
        this.ball.x = paddle.x + 16;
        this.ball.y = paddle.y - 16;
        this.ball.animations.stop();

        //  And bring the bricks back from the dead :)
        this.bricks.callAll('revive');
    }

}

 IFL.Breakout.GameState.prototype.ballHitPaddle  = function(_ball, _paddle) {

    var diff = 0;

    if (_ball.x < _paddle.x)
    {
        //  Ball is on the left-hand side of the paddle
        diff = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    }
    else if (_ball.x > _paddle.x)
    {
        //  Ball is on the right-hand side of the paddle
        diff = _ball.x -_paddle.x;
        _ball.body.velocity.x = (10 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }

}
IFL.Breakout.GameState.prototype.create = function() {


    this.ball=null;
    this.paddle=null;
    this.bricks=null;

    this.ballOnPaddle = true;

    this.lives = 3;
    this.score = 0;

    this.scoreText="";
    this.livesText="";
    this.introText="";

    this.s=null;


  // create filter
  this.background = this.game.add.sprite(0, 0);
  this.background.width = 800;
  this.background.height = 600;

  this.filter = this.game.add.filter('Plasma', 800, 600);

  //  You have the following values to play with (defaults shown below):

  // filter.size = 0.03;
  // filter.redShift = 0.5;
  // filter.greenShift = 0.5;
  // filter.blueShift = 0.9;

  this.background.filters = [this.filter];




    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  We check bounds collisions against all walls other than the bottom one
    this.game.physics.arcade.checkCollision.down = false;

    //this.s = this.game.add.tileSprite(0, 0, 800, 600, 'starfield');

    this.bricks = this.game.add.group();
    this.bricks.enableBody = true;
    this.bricks.physicsBodyType = Phaser.Physics.ARCADE;

    var brick;

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 15; x++)
        {
            brick = this.bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }

    this.paddle = this.game.add.sprite(this.game.world.centerX, 500, 'breakout', 'paddle_big.png');
    this.paddle.anchor.setTo(0.5, 0.5);

    this.game.physics.enable(this.paddle, Phaser.Physics.ARCADE);

    this.paddle.body.collideWorldBounds = true;
    this.paddle.body.bounce.set(1);
    this.paddle.body.immovable = true;

    this.ball = this.game.add.sprite(this.game.world.centerX, this.paddle.y - 16, 'breakout', 'ball_1.png');
    this.ball.anchor.set(0.5);
    this.ball.checkWorldBounds = true;

    this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);

    this.ball.body.collideWorldBounds = true;
    this.ball.body.bounce.set(1);

    this.ball.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false);

    this.ball.events.onOutOfBounds.add(this.ballLost, this);

    this.scoreText = this.game.add.text(32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    this.livesText = this.game.add.text(680, 550, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
    this.introText = this.game.add.text(this.game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
    this.introText.anchor.setTo(0.5, 0.5);

    this.game.input.onDown.add(this.releaseBall, this);

}

 IFL.Breakout.GameState.prototype.update = function() {

    //  Fun, but a little sea-sick inducing :) Uncomment if you like!
    // s.tilePosition.x += (game.input.speed.x / 2);

    this.paddle.x = this.game.input.x;

    if (this.paddle.x < 24)
    {
        this.paddle.x = 24;
    }
    else if (this.paddle.x > this.game.width - 24)
    {
        this.paddle.x = this.game.width - 24;
    }

    if (this.ballOnPaddle)
    {
        this.ball.body.x = this.paddle.x;
    }
    else
    {
        this.game.physics.arcade.collide(this.ball, this.paddle, this.ballHitPaddle, null, this);
        this.game.physics.arcade.collide(this.ball, this.bricks, this.ballHitBrick, null, this);
    }

     // update filter
  this.filter.update();

  //  Uncomment for coolness :)
  //this.filter.blueShift -= 0.001;


}

