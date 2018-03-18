// Super class of charaters of the game
// will be used to create enemies and play classes
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

class Enemy extends Character {
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.xStart = x;
  };

  comeBack() {
//    console.log(this.x);
    if (this.x>=505) {
      this.x = this.xStart;
    }
  }

  update(dt) {
  super.update(dt);
  this.comeBack();
  }
}

class Player extends Character {
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png'
  }

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
//    console.log(key);
  }
}

let player = new Player(205,373,0)
let allEnemies = [new Enemy(-60,229,10),new Enemy(-120,146,85), new Enemy(0,63,55)];

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
