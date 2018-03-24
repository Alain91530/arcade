'use strict';

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*******************************************************************************

              Classes used for the game

********************************************************************************
   Game class: the class wich will hold the game object and handle all
   modification on this one
*******************************************************************************/
var Game = function () {
  function Game() {
    _classCallCheck(this, Game);

    // Tmer for the game
    this.timer = 0;
    // Difficulty levels (0: easy to 3: difficult)
    this.level = 0;
    // Colors for level display in star menu
    this.levels = ['lightgreen', 'orange', 'red'];
    // Current sate of the game
    this.state = 'stopped';
    // Array of objects holding information to be displayed on the popup
    // of the according state
    this.allStates = [{ state: 'paused',
      title: 'GAME PAUSED',
      text: 'Hit the escape key again to resume' }, { state: 'won',
      title: 'YES! YOU WIN',
      text: 'Hit space key to play again' }, { state: 'lost',
      title: 'GAME OVER !',
      text: 'Hit space to start a new game' }, { state: 'stopped',
      title: 'CROSS THE ROAD!',
      text: 'Hit space to start a new game' }];
    // Array of mages of all possible players character
    this.players = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-pink-girl.png', 'images/char-horn-girl.png', 'images/char-princess-girl.png'];
    // Current player index sprite used to let him change it
    this.currentSprite = 0;
  }
  /*******************************************************************************
        Methods of Game class
  *******************************************************************************/
  /*
    Method to start a new game, initialization of everything in the game
  */


  Game.prototype.initGame = function initGame() {
    /*
      Local variables of the method
    */
    var yEnemiesPositions = [63, 146, 229]; // Used to ease the calculation
    var yGemsPositions = [130, 213, 299]; // different cause of gem's size
    /*
    Array [0-14] containing gems at their positions on the grid game
      - 0 no gem
      - 1 green gem
      - 2 yellow gem, alwaways here
    The array will be shuffled to obtain random positions for the gems and is
    initialized with yellow gem at gp[0], random number of green gems will be
    pushed later in the method.
    */
    var gemPositions = [2];
    // Number of gems for this game.
    var nbGems = random(4, 8);
    // Usec to store x and y position in the canvas.
    var xGem = void 0;
    var yGem = void 0;
    /*
      Init all objects properties
    */
    this.timer = 0;
    this.state = 'stopped';
    /*
      Release previous instances of enemies and gems to be able to push new
      instances in the array
    */
    allEnemies = [];
    allGems = [];
    // Create an instance of the player with default parameters
    player = new Player(205, 395, 0, this.players[this.currentSprite]);
    /*
     creates initializes the instances of enemies according to levels:
       - Random number according to level and for each one:
          - Random speed (max speed is level dependant)
          - Random lane
    */
    var maxBug = 5;
    switch (this.level) {
      case 2:
        {
          maxBug = 3;
          for (var i = 0; i < maxBug; i++) {
            allEnemies.push(new Enemy(random(501, 650), yEnemiesPositions[random(0, 2)], -random(40, 120), 'images/reverse-bug.png'));
          };
        };
      case 1:
        {
          for (var _i = 0; _i < random(3, maxBug); _i++) {
            allEnemies.push(new Enemy(-random(0, 150), yEnemiesPositions[random(0, 2)], random(80, 150)));
          };
        };
      case 0:
        {
          for (var _i2 = 0; _i2 < random(3, maxBug); _i2++) {
            allEnemies.push(new Enemy(-random(0, 150), yEnemiesPositions[random(0, 2)], random(20, 100)));
          };
        };
    };

    /*
     Instances of gems:
      - One yellow already in gemPositions.
      - random number of green ones to be generated.
    */

    // Finish to create gemPositions with the green gems.
    for (var _i3 = 1; _i3 < 15; _i3++) {
      _i3 < nbGems ? gemPositions.push(1) : gemPositions.push(0);
    };
    // Shuffle gemPositions to get random gem's positions
    for (var pos = gemPositions.length - 1; pos > 0; pos--) {
      // pick a random position on the grid
      var randomPos = Math.floor(Math.random() * (pos + 1));
      // swap grid[pos] and grid[randomPos]
      var savedPos = gemPositions[pos];
      gemPositions[pos] = gemPositions[randomPos];
      gemPositions[randomPos] = savedPos;
    };
    // Position of gems are created now place them at the right place on grid

    for (var _i4 = 1; _i4 < 15; _i4++) {
      yGem = yGemsPositions[Math.floor(_i4 / 5)];
      xGem = 24 + _i4 % 5 * 101;
      switch (gemPositions[_i4]) {
        case 2:
          {
            allGems.push(new Gem(xGem, yGem, 0, 'orange', 'images/Gem Orange.png'));
            break;
          }
        case 1:
          {
            allGems.push(new Gem(xGem, yGem, 0, 'green', 'images/Gem Green.png'));
            break;
          };
      };
    };
    /*
      Reset the score on the screen.
    */
    this.updateScore();
  };
  /*
    Method to change the state of the game according player's action
  */


  Game.prototype.changeState = function changeState(state) {
    this.state = state;
    if (state == 'running') {
      for (var _iterator = allEnemies, _isArray = Array.isArray(_iterator), _i5 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i5 >= _iterator.length) break;
          _ref = _iterator[_i5++];
        } else {
          _i5 = _iterator.next();
          if (_i5.done) break;
          _ref = _i5.value;
        }

        var enemy = _ref;

        enemy.speed = enemy.speedStart;
      };
    } else {
      for (var _iterator2 = allEnemies, _isArray2 = Array.isArray(_iterator2), _i6 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i6 >= _iterator2.length) break;
          _ref2 = _iterator2[_i6++];
        } else {
          _i6 = _iterator2.next();
          if (_i6.done) break;
          _ref2 = _i6.value;
        }

        var _enemy = _ref2;

        _enemy.speed = 0;
      };
    };
  };
  /*
     Methods to render the Game object according to its state. An empty popup is
     prepared and then the different contents of the popup are set according to
     each case:
        - Pause
        - Game won
        - Game lost
        - Game waiting to start with the oportunity to choose player character and
          difficulty.
      Do nothing if game is just running
  */


  Game.prototype.render = function render() {
    if (this.state != 'running') {
      this.displayPopUp();
      this.state == 'stopped' ? this.startMenu() : this.displayEmoji(this.state);
    };
  };
  /*
     Method to actualy set the popup displayed by the render() method
  */


  Game.prototype.displayPopUp = function displayPopUp() {
    ctx.fillStyle = 'rgba(0,0,0,0.7';
    ctx.fillRect(20, 80, 465, 475);
    ctx.fillStyle = 'white';
    ctx.font = '35px arial';
    ctx.textAlign = 'center';
    var index = 0;
    while (this.state != this.allStates[index].state) {
      index++;
    };
    ctx.fillText(this.allStates[index].title, 252, 180);
    ctx.font = '25px arial';
    ctx.fillText(this.allStates[index].text, 252, 230);
  };
  /*
  Method to add an emoji to popup.
  */


  Game.prototype.displayEmoji = function displayEmoji(state) {
    var emoji = void 0;
    switch (state) {
      case 'paused':
        {
          emoji = 'images/wait.png';
          break;
        };
      case 'won':
        {
          emoji = 'images/happy.png';
          break;
        }
      case 'lost':
        {
          emoji = 'images/sad.png';
          break;
        }
    };
    ctx.drawImage(Resources.get(emoji), 205, 300);
  };
  /*
     Method to add the sarting menu in the popup when game is stopped
  */


  Game.prototype.startMenu = function startMenu() {
    ctx.fillText('Hit space to start a new game', 252, 230);
    ctx.fillText('Esc pause/resume game', 252, 265);
    ctx.fillText('Use + key to set game difficulty', 252, 300);
    ctx.fillStyle = this.levels[this.level];
    ctx.arc(250, 350, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    ctx.stroke();
    ctx.fillText('Choose player with Enter key', 252, 430);
    ctx.strokeStyle = 'red';
    ctx.lineJoin = 'round';
    ctx.strokeRect(205, 448, 96, 100);
    ctx.drawImage(Resources.get(player.sprite), 205, 395);
  };
  /*
     Method to handle the allowed keys and change the game state or pass the
     stroked key to the Player's move(key) method to have it move. Called by the
     keystroke event listener.
  */


  Game.prototype.handleInput = function handleInput(key) {
    switch (key) {
      case "pause":
        {
          if (this.state == "running") {
            this.changeState("paused");
            break;
          };
          if (this.state == "paused") {
            this.changeState("running");
          };
          break;
        }
      case "start":
        {
          if (this.state == "stopped") {
            this.changeState('running');
          } else {
            if (this.state == 'lost' || this.state == 'won') {
              this.changeState('stopped');
              this.initGame();
            };
            break;
          };
        }
      case 'player':
        {
          if (this.state == 'stopped') {
            this.currentSprite < 4 ? this.currentSprite++ : this.currentSprite = 0;
            player.sprite = this.players[this.currentSprite];
          };
          break;
        }
      case 'level':
        {
          if (this.state == 'stopped') {
            this.level < 2 ? this.level++ : this.level = 0;
            this.initGame();
          };
          break;
        }
      // Not a game menu call the Player's method
      default:
        {
          if (this.state == "running") {
            player.move(key);
          };
        }
    }
  };

  /*
    Method updating the score (time, lives and diamond) called by the timer and
    methods changing score like checkCollisions(). It changes part of the DOM
    not managed by engine.js (i.e. the added score id node).
  */
  Game.prototype.updateScore = function updateScore() {
    var lives = document.getElementById('lives');
    var stringTime = void 0;
    /*
      Update timer, display timer in hh:mm:ss format.
    */
    var hrs = Math.trunc(this.timer / 3600);
    var mins = Math.trunc(this.timer / 60) - hrs * 60;
    var secs = this.timer - (hrs * 3600 + mins * 60);
    hrs < 10 ? stringTime = '0' + hrs + ':' : stringTime = hrs + ':';
    mins < 10 ? stringTime = stringTime + '0' + mins + ':' : stringTime = stringTime + mins + ':';
    secs < 10 ? stringTime = stringTime + '0' + secs : stringTime = stringTime + secs;
    document.getElementById('time').textContent = stringTime;
    /*
      Update lives
    */
    while (lives.firstChild) {
      lives.removeChild(lives.firstChild);
    }
    for (var nbLives = 0; nbLives < player.life; nbLives++) {
      lives.innerHTML = lives.innerHTML + '<img src="images/Heart.png" height="70" alt="">';
    }
    /*
      Updates gems
    */
    while (gems.firstChild) {
      gems.removeChild(gems.firstChild);
    }
    for (var nbGems = 0; nbGems < player.gems; nbGems++) {
      gems.innerHTML = gems.innerHTML + '<img src="images/Gem Green.png" height="50" alt=""><span> </span>';
    }
  };

  return Game;
}();

/*******************************************************************************
    Character: super class of items of the game
    will be used to create enemies, gems and player classes
*******************************************************************************/


var Character = function () {
  function Character() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var sprite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'images/enemy-bug.png';

    _classCallCheck(this, Character);

    // Position x,y on the screen
    this.x = x;
    this.y = y;
    //width and Hight of the charater for collision detection
    this.width = 70;
    this.height = 50;
    // Image of the character
    this.sprite = sprite;
    // Moving speed of the character
    this.speed = speed;
  }
  /*******************************************************************************
      Methods of Character class
  *******************************************************************************/
  /*
      Draw character on screen
  */


  Character.prototype.render = function render() {
    ctx.globalAlpha = 1;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  return Character;
}();
/*******************************************************************************
  Enemy sub-class of Character
*******************************************************************************/


var Enemy = function (_Character) {
  _inherits(Enemy, _Character);

  function Enemy(x, y, speed, sprite) {
    _classCallCheck(this, Enemy);

    var _this = _possibleConstructorReturn(this, _Character.call(this, x, y, speed, sprite));

    _this.xStart = x;
    _this.speedStart = speed;
    return _this;
  }

  /*******************************************************************************
      Method added to enemy
  *******************************************************************************/
  /*
     Update position of the enemies
     Move the enemy and then check for collision.
  */
  Enemy.prototype.update = function update(dt) {
    this.speed > 0 && this.x > 505 || this.speed < 0 && this.x < -101 ? this.x = this.xStart : this.x = this.x + this.speed * dt;
  };

  return Enemy;
}(Character);
/*******************************************************************************
  Gem sub-class of Character
*******************************************************************************/


var Gem = function (_Character2) {
  _inherits(Gem, _Character2);

  function Gem(x, y, speed, color, sprite) {
    _classCallCheck(this, Gem);

    var _this2 = _possibleConstructorReturn(this, _Character2.call(this, x, y, sprite));

    _this2.x = x;
    _this2.y = y;
    _this2.sprite = sprite;
    _this2.color = color;
    return _this2;
  }
  /*******************************************************************************
      Method modified of Character to adust the size of the sprite
  *******************************************************************************/
  /*
    Draw gems on screen with the proper size
  */


  Gem.prototype.render = function render() {
    ctx.globalAlpha = 1;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 60, 60);
  };

  return Gem;
}(Character);
/*******************************************************************************
    Player sub-class of Character
*******************************************************************************/


var Player = function (_Character3) {
  _inherits(Player, _Character3);

  function Player(x, y, speed, sprite) {
    _classCallCheck(this, Player);

    var _this3 = _possibleConstructorReturn(this, _Character3.call(this, x, y, sprite));

    _this3.x = x;
    _this3.y = y;
    _this3.width = 40;
    _this3.life = 3;
    _this3.gems = 0;
    _this3.sprite = sprite; //'images/char-boy.png';
    return _this3;
  }
  /*******************************************************************************
      Methods added to Player or modified from Character
  *******************************************************************************/
  /*
    Modified method to update position of player:
    The player doesn't move by itself so its update method do nothing.Only
    collisions has to be checked. Position will be update by the event handler
  */


  Player.prototype.update = function update(dt) {
    this.checkCollisions();
    this.grabGems();
    game.updateScore();
  };

  /*
    Method to handle the moves of player.
    Called by the Game.handleInput() method on keystroke event
  */
  Player.prototype.move = function move(key) {
    switch (key) {
      case 'up':
        {
          this.y - 83 > -15 ? this.y -= 83 : game.changeState('won');
          break;
        }
      case 'down':
        {
          this.y + 83 <= 400 ? this.y += 83 : false;
          break;
        }
      case 'left':
        {
          this.x - 100 >= 5 ? this.x -= 100 : false;
          break;
        }
      case 'right':
        {
          this.x + 100 <= 405 ? this.x += 100 : false;
          break;
        }
    }
  };
  /*
    Method to grab gems and increase number of players lives
  */


  Player.prototype.grabGems = function grabGems() {
    for (var i = 0; i < allGems.length; i++) {
      var gemChecked = allGems[i];
      if (this.x < gemChecked.x + gemChecked.width && this.x + this.width > gemChecked.x && this.y < gemChecked.y + gemChecked.height - 67 && this.y + this.height > gemChecked.y - 67) {
        allGems[i].color == 'green' ? this.gems++ : this.life++;
        allGems.splice(i, 1);
        if (this.gems == 3) {
          this.life++;this.gems = 0;
        }
      }
    }
  };
  /*
    Method to detect collisions with enemies
  */


  Player.prototype.checkCollisions = function checkCollisions() {
    for (var i = 0; i < allEnemies.length; i++) {
      var enemyChecked = allEnemies[i];
      if (this.x < enemyChecked.x + enemyChecked.width && this.x + this.width > enemyChecked.x && this.y < enemyChecked.y + enemyChecked.height && this.y + this.height > enemyChecked.y) {
        this.x = 205;
        this.y = 395;
        this.life -= 1;
        this.life == 0 ? game.changeState('lost') : false;
      };
    };
  };

  return Player;
}(Character);
/*******************************************************************************

          Generic utility function for the game

*******************************************************************************/
/*
  Function generating a positive integer n with 0 <= min <= n <= max
*/


function random(min, max) {
  return min + Math.floor(Math.random() * (max + 2 - (min + 1)));
}

/*******************************************************************************

          Global variables of the Game

*******************************************************************************/
/*
  Hold and create the instance of the game
*/
var game = new Game();
/*
  Hold the instance of player, will be initialized by Game.initGame() method.
*/
var player = void 0;
/*
  Array which will hold the instances of enemies, will be initialized by
  Game.initGame() method.
*/
var allEnemies = [];
/*
  Array which will hold the instances of gems, will be initialized by
  Game.initGame() method
*/
var allGems = [];
/*******************************************************************************

    Main program:
      - create objects
      - initialize them
      - create interval and event

*******************************************************************************/
// initialize the game object to start a new game
game.initGame();
// Set an interval and it's handler for the game's timer.
window.setInterval(function () {
  game.state == 'running' ? game.timer += 1 : false;
  game.updateScore();
}, 1000);
/*
  This listens for key presses and sends the keys to Game.handleInput() method.
  The method will call Player.move(method) if the game is running to allow
  players move. Modified to allow start menu and pause.
*/
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    13: 'player',
    27: 'pause',
    32: 'start',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    107: 'level'
  };

  game.handleInput(allowedKeys[e.keyCode]);
});
