"use strict";

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
    this.width = 80; // based on image
    this.height = 60; // based on image
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
* @param {string} sprite - URL to enemy image file
* @param {number} xInitial - Initial x position of enemy on canvas
* @param {number} yInitial - Initial y position of enemy on canvas
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

/**
* @description Player that is moved by up, down, left or right arrow keys
* @constructor
* @param {string} sprite - URL to player image file
* @param {number} xInitial - Initial x position of player on canvas
* @param {number} yInitial - Initial y position of player on canvas
* @param {number} lives - number of lives player has
*/
var Player = function(sprite, xInitial, yInitial, lives){
    Entity.call(this, sprite, xInitial, yInitial);
    this.livesLeft = lives;
    this.score = 0;
    this.isMoveX = false;
    this.moveDelta = 0;
};

Player.prototype = Object.create(Entity.prototype);

/**
* @description Update the player's position, required method for game
*/
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

/**
* @description Handle user's key pressed - up, down, left or right arrow keys
* @param {string} keyPressed is up, down, left or right
*/
Player.prototype.handleInput = function(keyPressed){
    if (keyPressed == undefined) {
      return;
    }
    this.moveDelta = 10;
    if (keyPressed == 'left' || keyPressed == 'right'){
      this.isMoveX = true;
      if (keyPressed == 'left')
       this.moveDelta *= -1;
    } else { // 'up' or 'down'
      this.isMoveX = false;
      if (keyPressed == 'up')
       this.moveDelta *= -1;
    }
}

/**
* @description Update the player's lives life when player collided with enemy
*/
Player.prototype.lostLife = function() {
    if (this.livesLeft > 0){
      this.livesLeft--;
    }
}

/**
* @description Check if player has any lives left, if not, then game over
*/
Player.prototype.lost = function() {
    if (this.livesLeft == 0){
      return true;
    }
    return false;
}

/**
* @description Update the player's score when player has reached top of canvas
*/
Player.prototype.win = function(){
    if (this.y <= 0){
      this.score += 10;
      return true;
    }
    return false;
}

Player.prototype.constructor = Player;

// Now instantiate your objects.

// Place all enemy objects in an array called allEnemies
// 1st row is water 'blocks' so offset to 2nd, 3rd & 4th row of stone 'blocks'.
// Each 'block' is 101 x 83
var allEnemies = [new Enemy('images/enemy-bug.png', 0, 60, 20),
                  new Enemy('images/enemy-bug.png', 0, 143, 40),
                  new Enemy('images/enemy-bug.png', 0, 226, 30)];
// Place the player object in a variable called player
// Position player within grass 'blocks'
var player = new Player('images/char-boy.png', 200, 400, 3);

// Avatar icons that user can choose to represent user
const avatars = {
  'Boy':'images/char-boy.png',
  'Cat Girl':'images/char-cat-girl.png',
  'Horn Girl':'images/char-horn-girl.png',
  'Pink Girl':'images/char-pink-girl.png',
  'Princess':'images/char-princess-girl.png'
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (player)
      player.handleInput(allowedKeys[e.keyCode]);
});

// Event listener for when user clicks on 'X' to close pick user avatar modal
document.getElementsByClassName("close")[0].addEventListener("click", function(event){
  let c = event.target;
  if (!c) return;
  document.getElementsByClassName("user-panel")[0].style.display = "none";
});

// Event listener for when user clicks on an avatar icon
// Set player image to icon selected and close window
document.getElementsByClassName("avatars")[0].addEventListener("click", function(event){
  let c = event.target;
  if (!c) return;
  let a = c;
  if (c.classList.length > 0){ // list not image
    a = c.firstElementChild;
  }
  let imageURL = a.getAttribute('src');
  if (player)
    player.sprite = imageURL;
  document.getElementsByClassName("user-panel")[0].style.display = "none";
});
