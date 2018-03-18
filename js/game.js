// Super class of charaters of the game
// will be used to create enemies and player classes
class Character {
  constructor(x = 0, y = 0, speed, sprite = 'images/enemy-bug.png') {

      // Position x,y on the screen
      this.x = x;
      this.y = y;
      // Image of the character
      this.sprite = sprite;
      // Moving speed of the character
      this.speed = speed;
  }
  // Update position of the character
  update(dt=0) {
//    checkCollisions();
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computer.
    this.x=this.x+(this.speed*dt);
  };
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

// Method allowing enemies to restart when they have crossed the canvas
  comeBack() {
    if (this.x>=505) {
      this.x = this.xStart;
    }
  }
// Change in Character update method making enemies come back
  update(dt) {
  super.update(dt);
  this.comeBack();
  }
}

// Player sub-class
class Player extends Character {
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png'
  }

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
// Function generating an integer n with min <= n <= max
function random(min,max){
  return min+Math.floor(Math.random()*(max-min+1));
}
const yEnemiesPositions = [63,146,229];
let player = new Player(205,373,0);
let allEnemies = [];
for (let i=0; i<random(5,7); i++) {
  allEnemies.push(new Enemy(-(random(1,150)-1),yEnemiesPositions[random(1,3)-1],random(20,100)));
}
//new Enemy(-60,229,10),new Enemy(-120,146,85), new Enemy(0,63,55)];

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
