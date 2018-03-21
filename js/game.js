class Game {
  constructor() {
    this.level = 0;
    this.levels = ['lightgreen','orange','red'];
    this.state = 'stopped';
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
    this.win = false;
    this.players = ['images/char-boy.png',
                    'images/char-cat-girl.png',
                    'images/char-pink-girl.png',
                    'images/char-horn-girl.png',
                    'images/char-princess-girl.png'];
    this.currentSprite = 0 ;
  }

  changeState(state) {
    this.state=state
    switch (this.state) {
      case 'lost':
      case 'won':
      case 'paused':
      case 'stopped': {
        for (let enemy of allEnemies) {
         enemy.speed = 0;
        };
        break;
      }
      case 'running': {
        for (let enemy of allEnemies) {
          enemy.speed = enemy.speedStart;
        };
        break;
      }
    }
  };

/* Methods to render the Game object according to its state. An empty popup is
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
      if (this.state=='stopped') {this.startMenu();};
    };
  }

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

  startMenu() {
    ctx.fillText('Hit space to start a new game',252,230);
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
        if (this.state=="stopped") {this.changeState("running")};
      break;
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
        };
        break;
      }
      // Not a game menu call the Player's method
      default: {
        if (this.state=="running") {player.move(key)};
      }
    }
  };
}

// Super class of charaters of the game
// will be used to create enemies and player classes

class Character {
  constructor(x = 0, y = 0, speed, sprite = 'images/enemy-bug.png') {

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
  // Draw character on screen
  render() {
      ctx.globalAlpha = 1;
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
}

// Enemy sub-class
class Enemy extends Character {
  constructor(x, y,speed, sprite) {
    super(x, y, speed, sprite);
    this.xStart = x;
    this.speedStart = speed;
  };

  // Update position of the enemies
  // Move the enemy and then check for collision.
  update(dt) {
    (this.x>505) ? this.x = this.xStart : this.x=this.x+(this.speed*dt);
    checkCollisions ();
  }
}

// Player sub-class
class Player extends Character {
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.x = x;
    this.y = y;
    this.width = 40;
    this.life = 3;
    this.sprite = 'images/char-boy.png';
  }

// The player doesn't move by itself so its update method do nothing.
  update(dt) {};

// Method to handle the moves of player
  move(key) {
    switch (key) {
      case 'up': {
        (this.y-83>-15) ? this.y -= 83 : game.state ='won';
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
}

// Detections of collision
function checkCollisions() {
  for(let i=0; i<allEnemies.length; i++) {
    let  enemyChecked =allEnemies[i];
    if (player.x<enemyChecked.x+enemyChecked.width
      && player.x+player.width>enemyChecked.x
      && player.y<enemyChecked.y+enemyChecked.height
      && player.y+player.height>enemyChecked.y)
    {
      player.x = 205;
      player.y = 373;
      player.life -= 1;
      updateScore();
      (player.life==0) ? game.state='lost': false;
    };
  };
}

function endGame(win) {
  (win) ? console.log('you win') : console.log('You lost')
}
// Function to handle the timer
function changeTimer() {
  (game.state=='running') ? timer+=1 : false;
  updateScore();
};

// Function updating the score (time, lives and diamond)
function updateScore() {
  let lives = document.getElementById('lives');
//  Update timer
  const hrs = Math.trunc(timer/3600);
  const mins = (Math.trunc(timer/60)-(hrs*60));
  const secs = (timer-((hrs*3600)+(mins*60)));
  (hrs<10) ? stringTime = '0'+hrs+':' : stringTime = hrs+':';
  (mins<10) ? stringTime = stringTime+'0'+mins+':' : stringTime = stringTime+mins+':';
  (secs<10) ? stringTime = stringTime+'0'+secs : stringTime = stringTime+secs;
  document.getElementById('time').textContent = stringTime;
// Update lives
  while (lives.firstChild) {
    lives.removeChild(lives.firstChild);
  }
  for(let nblives = 0; nblives<player.life; nblives++ ) {
    lives.innerHTML = lives.innerHTML+'<img src="images/Heart.png" height="70" alt="">';
  }
}


// Function generating an positive integer n with 0 <= min <= n <= max
function random(min,max){
  return min+Math.floor(Math.random()*(max+2-(min+1)));
}

// Array used to pick random lanes for enemies at beginning of game.
const yEnemiesPositions = [63,146,229];

// Instance of the game
let game = new Game;
let timer = 0;

// Instance of player at a fixed position.
let player = new Player(205,395,0);

/* Instances of enemies
   - Random number and for each:
      - Random speed
      - Random lane
*/
let allEnemies = [];
for (let i=0; i<random(3,5); i++) {
  allEnemies.push(new Enemy(-(random(0,150)),yEnemiesPositions[random(0,2)],random(20,100)));
}
window.setInterval(changeTimer, 1000);

/* This listens for key presses and sends the keys to your
   Game.handleInput() method. The method will call Player.move(method) if the
   game is running to allow players move. Modified to allow start menu and pause.
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
