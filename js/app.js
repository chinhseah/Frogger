// Canvas width and height
const canvasWidth = 505;
const canvasHeight = 606;

/**
* @description Represents a game entity which can be players, enemies, etc.
* @constructor
* @param {string} sprite - URL to entity image file
* @param {number} xInitial - Initial x position of entity on canvas
* @param {number} yInitial - Initial y position of entity on canvas
* @param {number} xMax - Maximum x position of entity on canvas
* @param {number} yMax - Maximum y position of entity on canvas
*/
var Entity = function(sprite, xInitial, yInitial) {
    // The image/sprite for our entity, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;
    this.width = 100; // based on image
    this.height = 80; // based on image
    this.xInitial = xInitial;
    this.yInitial = yInitial;
    this.x = xInitial;
    this.y = yInitial;
};

/**
* @description Check if this entity is coollided with other Entity.
* @param {Entity} other - entity to check if collided with
*/
Entity.prototype.collision = function(other) {
    if (this.x < other.x + other.width  &&
      this.x + this.width  > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y) {
        return true;
    }
    return false;
};

/**
* @description Draw the entity on the screen, required method for game.
*/
Entity.prototype.render = function() {
    if (this.x > canvasWidth) {
      this.x = 0;
    }
    if (this.y > canvasHeight){
      this.y = 0;
    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Reset entity on the screen to its initial position.
*/
Entity.prototype.reset = function() {
    this.x = this.xInitial;
    this.y = this.yInitial;
};

/**
* @description Represents a Enemy our player must avoid
* @constructor
* @param {string} sprite - URL to entity image file
* @param {number} xInitial - Initial x position of entity on canvas
* @param {number} yInitial - Initial y position of entity on canvas
* @param {number} speed - Enemy moves across canvas
*/
var Enemy = function(sprite, xInitial, yInitial, speed) {
    Entity.call(this, sprite, xInitial, yInitial);
    // speed of move
    this.speed = speed;
};

Enemy.prototype = Object.create(Entity.prototype);

/**
* @description Update the enemy's position, required method for game
* @param {number} dt - a time delta between ticks
*/
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);
};

Enemy.prototype.constructor = Enemy;

// Now write your own player class
var Player = function(sprite, xInitial, yInitial){
    Entity.call(this, sprite, xInitial, yInitial);
    this.isMoveX = false;
    this.moveDelta = 0;
};

Player.prototype = Object.create(Entity.prototype);

// This class requires an update(), render() and
// a handleInput() method.
Player.prototype.update = function() {
    // Move player depending on which direction
    if (this.moveDelta != 0) {
      if (this.isMoveX){
        let xNew = this.x + this.moveDelta;
        if (xNew >= 0 && xNew <= canvasWidth - this.width)
          this.x = xNew;
      } else {
        let yNew = this.y + this.moveDelta;
        if (yNew >= 0 && yNew <= canvasHeight - (this.height*2))
          this.y = yNew;
      }
    }
    this.moveDelta = 0;
}

Player.prototype.handleInput = function(keyCode){
    if (keyCode == undefined) {
      return;
    }
    this.moveDelta = 10;
    if (keyCode == 'left' || keyCode == 'right'){
      this.isMoveX = true;
      if (keyCode == 'left')
       this.moveDelta *= -1;
    } else { // 'up' or 'down'
      this.isMoveX = false;
      if (keyCode == 'up')
       this.moveDelta *= -1;
    }
}

Player.prototype.constructor = Player;

// Now instantiate your objects.

// Place all enemy objects in an array called allEnemies
// Remember that 1st row is water 'blocks' so offset to 2nd, 3rd &  4th row
// of stone 'blocks'. Each 'block' is 101 x 83
var allEnemies = [new Enemy('images/enemy-bug.png', 0, 60, 20),
                  new Enemy('images/enemy-bug.png', 0, 143, 40),
                  new Enemy('images/enemy-bug.png', 0, 226, 30)];
// Place the player object in a variable called player
var player = new Player('images/char-boy.png', 200, 350);

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
