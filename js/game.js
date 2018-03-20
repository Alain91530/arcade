class Game {
  constructor() {
    this.level = 1;
    this.run = true;
    this.pause = false;
    this.popUp = false;
  }

  pauseGame() {
    if (this.pause) {
      this.pause = false;
      for (let enemy of allEnemies) {
       enemy.speed = enemy.speedStart;
      };
    }
    else {
      this.pause = true;
      for (let enemy of allEnemies) {
        enemy.speed = 0;
      };
    };
  };
  update() {

  }
  render() {
    if(this.pause) {
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = 'black';
      ctx.fillRect(20,80,465,475);
    }
  }

  endGame(win) {
    (win) ? console.log('you win') : console.log('You lost');
  };

  handleInput(key) {
    if (this.run) {
      (key=='pause') ? this.pauseGame() : player.move(key);
    }
    else {
      player.move(key);
    };
  }
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
    this.sprite = 'images/char-boy.png'
  }

// The player doesn't move by itself so its update method do nothing.
  update(dt) {};

// Method to handle the moves of player
  move(key) {
    switch (key) {
      case 'up': {
        (this.y-83>-15) ? this.y -= 83 : endGame(true);
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
      (player.life==0) ? endGame(false) : false;
    };
  };
}

function endGame(win) {
  (win) ? console.log('you win') : console.log('You lost')
}
// Function to handle the timer
function changeTimer() {
  (!game.pause) ? timer+=1 : false;
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

// Instance of player at a fix position.
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

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'start',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        80: 'pause'
    };

    game.handleInput(allowedKeys[e.keyCode]);
});
