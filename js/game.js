// Super class of charaters of the game
// will be used to create enemies and play classes
class Character {
  constructor(x = 0, y = 0, speed, sprite = 'images/enemy-bug.png') {

      // Position x,y on the scree
      this.x = x;
      this.y = y;
      // Image of the enemy
      this.sprite = sprite;
      this.speed = speed;
  }
  // Update position of the character
  update(dt=0) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computer.
    this.x=this.x+(this.speed*dt);
  //    this.y=this.y+dt;
  };
  // Draw character on screen
  render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
}

class Enemy extends Character {
  constructor(x, y, sprite) {
    super(x, y, sprite);
  };

}

class Player extends Character {
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png'
  }

  handleInput(key) {
    console.log(key);
  }
}

let player = new Player(205,400,0)
let allEnemies = [new Enemy(-60,200,10), new Enemy(0,100,15)];

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
