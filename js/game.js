/*******************************************************************************

              Classes used for the game

********************************************************************************
   Game class: the class wich will hold the game object and handle all
   modification on this one
*******************************************************************************/
class Game {
  constructor() {
    // Tmer for the game
    this.timer = 0;
    // Difficulty levels (0: easy to 3: difficult)
    this.level = 0;
    // Colors for level display in star menu
    this.levels = ['lightgreen','orange','red'];
    // Current sate of the game
    this.state = 'stopped';
    // Array of objects holding information to be displayed on the popup
    // of the according state
    this.allStates= [{state:'paused',
                      title:'GAME PAUSED',
                      text:'Hit the escape key again to resume'},
                     {state: 'won',
                      title: 'YES! YOU WIN',
                      text: 'Hit space key to play again'},
                     {state: 'lost',
                      title: 'GAME OVER !',
                      text: 'Hit space to start a new game'},
                     {state: 'stopped',
                      title: 'CROSS THE ROAD!',
                      text: 'Hit space to start a new game'}];
    // Array of mages of all possible players character
    this.players = ['images/char-boy.png',
                    'images/char-cat-girl.png',
                    'images/char-pink-girl.png',
                    'images/char-horn-girl.png',
                    'images/char-princess-girl.png'];
    // Current player index sprite used to let him change it
    this.currentSprite = 0 ;
  }
/*******************************************************************************
      Methods of Game class
*******************************************************************************/
/*
  Method to start a new game, initialization of everything in the game
*/
initGame() {
  /*
    Local variables of the method
  */
  const yEnemiesPositions = [63,146,229];  // Used to ease the calculation
  const yGemsPositions = [130,213,299];    // different cause of gem's size
  /*
  Array [0-14] containing gems at their positions on the grid game
    - 0 no gem
    - 1 green gem
    - 2 yellow gem, alwaways here
  The array will be shuffled to obtain random positions for the gems and is
  initialized with yellow gem at gp[0], random number of green gems will be
  pushed later in the method.
  */
  const gemPositions = [2];
  // Number of gems for this game.
  const nbGems = random(4,8);
  // Usec to store x and y position in the canvas.
  let xGem;
  let yGem;
  /*
    Init all objects properties
  */
  this.timer = 0;
  this.state = 'stopped';
  /*
    Release previous instances of enemies and gems to be able to push new
    instances in the array
  */
  allEnemies=[];
  allGems=[];
  // Create an instance of the player with default parameters
  player = new Player(205,395,0, this.players[this.currentSprite]);
  /*
   creates initializes the instances of enemies according to levels:
     - Random number according to level and for each one:
        - Random speed (max speed is level dependant)
        - Random lane
  */
  let maxBug=5;
  switch(this.level) {
    case 2: {
      maxBug = 3;
      for (let i=0; i<maxBug; i++) {
        allEnemies.push(new Enemy(random(501,650),
        yEnemiesPositions[random(0,2)],
        -random(40,120),
        'images/reverse-bug.png'));
      };
    };
    case 1: {
      for (let i=0; i<random(3,maxBug); i++) {
        allEnemies.push(new Enemy(-(random(0,150)),
        yEnemiesPositions[random(0,2)],
        random(80,150)));
      };
    };
    case 0: {
      for (let i=0; i<random(3,maxBug); i++) {
        allEnemies.push(new Enemy(-(random(0,150)),
        yEnemiesPositions[random(0,2)],
        random(20,100)));
      };
    };
  };

  /*
   Instances of gems:
    - One yellow already in gemPositions.
    - random number of green ones to be generated.
  */

// Finish to create gemPositions with the green gems.
  for (let i=1; i<15; i++) {
    (i<nbGems) ? gemPositions.push(1) : gemPositions.push(0);
  };
// Shuffle gemPositions to get random gem's positions
  for (let pos = gemPositions.length-1; pos > 0; pos--){
    // pick a random position on the grid
    let randomPos = Math.floor(Math.random()*(pos+1));
    // swap grid[pos] and grid[randomPos]
    let savedPos = gemPositions[pos];
    gemPositions[pos] = gemPositions[randomPos];
    gemPositions[randomPos] = savedPos;
  };
// Position of gems are created now place them at the right place on grid

  for (let i=1; i<15; i++) {
    yGem = yGemsPositions[Math.floor(i/5)];
    xGem = 24+(i%5)*101;
    switch (gemPositions[i]) {
      case 2 : {
        allGems.push(new Gem(xGem,yGem,0,'orange','images/Gem Orange.png'));
        break;
      }
      case 1 : {
        allGems.push(new Gem(xGem,yGem,0,'green','images/Gem Green.png'));
        break;
      };
    };
  };
  /*
    Reset the score on the screen.
  */
  this.updateScore();
}
/*
  Method to change the state of the game according player's action
*/
  changeState(state) {
    this.state=state
    if (state=='running') {
      for (let enemy of allEnemies) {
        enemy.speed = enemy.speedStart;
      };
    }
    else {
      for (let enemy of allEnemies) {
       enemy.speed = 0;
      };
    };
  }
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
  render() {
    if (this.state!='running') {
      this.displayPopUp();
      (this.state=='stopped') ? this.startMenu() : this.displayEmoji(this.state);
    };
  }
/*
   Method to actualy set the popup displayed by the render() method
*/
  displayPopUp() {
    ctx.fillStyle = 'rgba(0,0,0,0.7';
    ctx.fillRect(20,80,465,475);
    ctx.fillStyle = 'white';
    ctx.font = '35px arial'
    ctx.textAlign ='center';
    let index = 0;
    while (this.state!=this.allStates[index].state) {index++};
    ctx.fillText(this.allStates[index].title,252,180);
    ctx.font = '25px arial';
    ctx.fillText(this.allStates[index].text,252,230);
  }
/*
Method to add an emoji to popup.
*/
  displayEmoji(state) {
    let emoji;
    switch (state) {
      case 'paused' : {
        emoji = 'images/wait.png';
        break;
      };
      case 'won' : {
        emoji = 'images/happy.png';
        break;
      }
      case 'lost' : {
        emoji = 'images/sad.png';
        break;
      }
    };
    ctx.drawImage(Resources.get(emoji), 205, 300);
  }
/*
   Method to add the sarting menu in the popup when game is stopped
*/
  startMenu() {
    ctx.fillText('Hit space to start a new game',252,230);
    ctx.fillText('Esc pause/resume game',252,265);
    ctx.fillText('Use + key to set game difficulty',252,300);
    ctx.fillStyle = this.levels[this.level];
    ctx.arc(250,350,20,0,2*Math.PI);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle='black';
    ctx.fillStyle = 'white';
    ctx.stroke();
    ctx.fillText('Choose player with Enter key',252,430);
    ctx.strokeStyle = 'red';
    ctx.lineJoin = 'round'
    ctx.strokeRect(205,448,96,100);
    ctx.drawImage(Resources.get(player.sprite), 205, 395);
  }
/*
   Method to handle the allowed keys and change the game state or pass the
   stroked key to the Player's move(key) method to have it move. Called by the
   keystroke event listener.
*/
  handleInput(key) {
    switch (key) {
      case "pause": {
        if (this.state=="running") {
          this.changeState("paused");
          break;
        };
        if (this.state=="paused") {
          this.changeState("running")
        };
      break;
      }
      case "start": {
        if (this.state=="stopped") {
          this.changeState('running');
        }
        else {
          if ((this.state=='lost')||(this.state=='won')) {
          this.changeState('stopped');
          this.initGame();
        };
        break;
      };
      }
      case 'player': {
        if (this.state=='stopped') {
          (this.currentSprite<4) ? this.currentSprite++ : this.currentSprite=0;
          player.sprite = this.players[this.currentSprite];
        };
        break;
      }
      case 'level': {
        if (this.state=='stopped') {
          (this.level<2) ? this.level++ : this.level=0;
          this.initGame();
        };
        break;
      }
      // Not a game menu call the Player's method
      default: {
        if (this.state=="running") {player.move(key)};
      }
    }
  };
  /*
    Method updating the score (time, lives and diamond) called by the timer and
    methods changing score like checkCollisions(). It changes part of the DOM
    not managed by engine.js (i.e. the added score id node).
  */
  updateScore() {
    let lives = document.getElementById('lives');
    let stringTime;
  /*
    Update timer, display timer in hh:mm:ss format.
  */
    const hrs = Math.trunc(this.timer/3600);
    const mins = (Math.trunc(this.timer/60)-(hrs*60));
    const secs = (this.timer-((hrs*3600)+(mins*60)));
    (hrs<10) ? stringTime = '0'+hrs+':' : stringTime = hrs+':';
    (mins<10) ? stringTime = stringTime+'0'+mins+':' : stringTime = stringTime+mins+':';
    (secs<10) ? stringTime = stringTime+'0'+secs : stringTime = stringTime+secs;
    document.getElementById('time').textContent = stringTime;
  /*
    Update lives
  */
    while (lives.firstChild) {
      lives.removeChild(lives.firstChild);
    }
    for(let nbLives = 0; nbLives<player.life; nbLives++ ) {
      lives.innerHTML = lives.innerHTML+'<img src="images/Heart.png" height="70" alt="">';
    }
  /*
    Updates gems
  */
    while (gems.firstChild) {
      gems.removeChild(gems.firstChild);
    }
    for(let nbGems = 0; nbGems<player.gems; nbGems++ ) {
      gems.innerHTML = gems.innerHTML+'<img src="images/Gem Green.png" height="50" alt=""><span> </span>';
    }
  };
}


/*******************************************************************************
    Character: super class of items of the game
    will be used to create enemies, gems and player classes
*******************************************************************************/
class Character {
  constructor(x = 0, y = 0, speed = 0, sprite = 'images/enemy-bug.png') {

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
  render() {
      ctx.globalAlpha = 1;
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
}
/*******************************************************************************
  Enemy sub-class of Character
*******************************************************************************/
class Enemy extends Character {
  constructor(x,y,speed,sprite) {
    super(x, y, speed, sprite);
    this.xStart = x;
    this.speedStart = speed;
  };
/*******************************************************************************
    Method added to enemy
*******************************************************************************/
/*
   Update position of the enemies
   Move the enemy and then check for collision.
*/
  update(dt) {
    (((this.speed>0)&&(this.x>505))||((this.speed<0)&&(this.x<-101))) ?
     this.x = this.xStart : this.x=this.x+(this.speed*dt);
  }
}
/*******************************************************************************
  Gem sub-class of Character
*******************************************************************************/
class Gem extends Character {
  constructor(x,y,speed,color,sprite) {
    super(x,y,sprite);
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.color = color;
  }
/*******************************************************************************
    Method modified of Character to adust the size of the sprite
*******************************************************************************/
/*
  Draw gems on screen with the proper size
*/
  render() {
      ctx.globalAlpha = 1;
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y,60,60);
  };
}
/*******************************************************************************
    Player sub-class of Character
*******************************************************************************/
class Player extends Character {
  constructor(x, y,speed,sprite) {
    super(x, y, sprite);
    this.x = x;
    this.y = y;
    this.width = 40;
    this.life = 3;
    this.gems = 0;
    this.sprite = sprite;//'images/char-boy.png';
  }
/*******************************************************************************
    Methods added to Player or modified from Character
*******************************************************************************/
/*
  Modified method to update position of player:
  The player doesn't move by itself so its update method do nothing.Only
  collisions has to be checked. Position will be update by the event handler
*/
  update(dt) {
    this.checkCollisions();
    this.grabGems();
    game.updateScore();
  };
/*
  Method to handle the moves of player.
  Called by the Game.handleInput() method on keystroke event
*/
  move(key) {
    switch (key) {
      case 'up': {
        (this.y-83>-15) ? this.y -= 83 : game.changeState('won');
        break;
      }
      case  'down': {
        (this.y+83<=400) ? this.y += 83 : false;
        break;
      }
      case 'left': {
        (this.x-100>=5) ? this.x -= 100 : false;
        break;
      }
      case 'right': {
        (this.x+100<=405) ? this.x +=100 : false;
        break;
      }
    }
  }
/*
  Method to grab gems and increase number of players lives
*/
  grabGems() {
    for (let i=0; i<allGems.length; i++) {
      let gemChecked = allGems [i];
      if (this.x<gemChecked.x+gemChecked.width
        && this.x+this.width>gemChecked.x
        && this.y<gemChecked.y+gemChecked.height-67
        && this.y+this.height>gemChecked.y-67)
      {
        (allGems[i].color=='green') ? this.gems++ : this.life++;
        allGems.splice(i,1);
        if (this.gems==3) {this.life++;this.gems=0;}
      }
    }
  }
/*
  Method to detect collisions with enemies
*/
  checkCollisions() {
    for (let i=0; i<allEnemies.length; i++) {
      let  enemyChecked = allEnemies[i];
      if (this.x<enemyChecked.x+enemyChecked.width
        && this.x+this.width>enemyChecked.x
        && this.y<enemyChecked.y+enemyChecked.height
        && this.y+this.height>enemyChecked.y)
      {
        this.x = 205;
        this.y = 395;
        this.life -= 1;
        (this.life==0) ? game.changeState('lost'): false;
      };
    };
  }
}
/*******************************************************************************

          Generic utility function for the game

*******************************************************************************/
/*
  Function generating a positive integer n with 0 <= min <= n <= max
*/
function random(min,max){
  return min+Math.floor(Math.random()*(max+2-(min+1)));
}


/*******************************************************************************

          Global variables of the Game

*******************************************************************************/
/*
  Hold and create the instance of the game
*/
let game = new Game;
/*
  Hold the instance of player, will be initialized by Game.initGame() method.
*/
let player;
/*
  Array which will hold the instances of enemies, will be initialized by
  Game.initGame() method.
*/
let allEnemies =[];
/*
  Array which will hold the instances of gems, will be initialized by
  Game.initGame() method
*/
let allGems = [];
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
  (game.state=='running') ? game.timer+=1 : false;
  game.updateScore();},
  1000);
/*
  This listens for key presses and sends the keys to Game.handleInput() method.
  The method will call Player.move(method) if the game is running to allow
  players move. Modified to allow start menu and pause.
*/
document.addEventListener('keyup', function(e) {
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
