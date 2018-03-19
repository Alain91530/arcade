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
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.xStart = x;
  };

  // Update position of the enemies
  // Move the enemy and then check for collision.
  update(dt=100) {
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
    this.sprite = 'images/char-boy.png'
  }

// The player doesn't move by itself so its update method do nothing.
  update(dt) {};

// Method to handle the moves of player
  handleInput(key) {
    switch (key) {
      case 'up': {
        (this.y-83>-15) ? this.y -= 83 : false;
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
for( let i=0; i<allEnemies.length; i++) {
let  enemyChecked =allEnemies[i];
  if (player.x<enemyChecked.x+enemyChecked.width
    && player.x+player.width>enemyChecked.x
    && player.y<enemyChecked.y+enemyChecked.height
    && player.y+player.height>enemyChecked.y) {
      player.x = 205;
      player.y = 373;
  };

};
}

// Function generating an positive integer n with 0 <= min <= n <= max
function random(min,max){
  return min+Math.floor(Math.random()*(max+2-(min+1)));
}

// Array used to pick random lanes for enemies at beginning of game.
const yEnemiesPositions = [63,146,229];

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

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
