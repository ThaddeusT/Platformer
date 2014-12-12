// Screen Size
var WIDTH = 800;
var HEIGHT = 500;
var LEVEL_LENGTH = 140000;
var keys = {
    up: false,
    down: false,
	left: false,
	right: false,
	q: false
};

// Fixed time step of 1/60th a second
var TIME_STEP = 1000/60;

// Resources
//----------------------------------

// Game class
//----------------------------------
var Game = function (canvasId) {
  var myself = this;
  
  // Rendering variables
  this.screen = document.getElementById(canvasId);
  // this.backgoundScreen = document.getElementById("game-background");
  this.screenBounds = this.screen.getBoundingClientRect();
  this.screenContext = this.screen.getContext('2d');
  // this.backgroundContext = this.backgoundScreen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = this.screen.width;
  this.backBuffer.height = this.screen.height;
  this.backBufferContext = this.backBuffer.getContext('2d');
  
  // Parallax variables
  this.cameraOffset = 200;
	
  // Input variables	
	this.inputState = {
		up: false,
		down: false,
		left: false,
		right: false,
		viewportX: 0,
		viewportY: 0,
		worldX: 0,
		worldY: 0,
		firing: false
	};
	
  // Game variables
  this.score = 0;
  this.lives = 3;
  this.health = 100;
  this.gui = new GUI(this);
  this.levels = [];
  this.levels.push(LevelH);
  this.levels.push(Level1);
 
  this.level =1;
  this.backgroundx = 0;
  this.backgroundy = 0;
  this.backgroundLoaded =false;
  this.character;
  this.characterInitialx=0;
  this.renderCharacter = false;
  this.characterBullets =[];
  
  // Timing variables
  this.elapsedTime = 0.0;
  this.startTime = 0;
  this.lastTime = 0;
  this.gameTime = 0;
  this.fps = 0;
  this.STARTING_FPS = 60;
  
}
	
Game.prototype = {

	// Update the game world.  See
	// http://gameprogrammingpatterns.com/update-method.html
	update: function(elapsedTime) {
		var self = this;
		game.levels[game.level-1].update();
		game.character.update(elapsedTime, this.inputState);
		game.characterBullets.forEach(function(bullet)
		{
			bullet.update(elapsedTime);
			if(bullet.x+bullet.radius > game.screen.width)
			{
				game.characterBullets.splice($.inArray(bullet, game.characterBullets),1);
			}
			if(bullet.tile){
				if(bullet.tile.solid){
					game.characterBullets.splice($.inArray(bullet, game.characterBullets),1);
				}
			}
		});		
		//console.log(game.character.x, (Tilemap.portals[0].postion.x+game.backgroundx*2));
		if(Math.abs(game.character.x-(Tilemap.portals[0].postion.x+game.backgroundx*2))<5)
		{
			this.gui.message("Congratulations You've Beaten Level "+game.level);
			game.level +=1;
			game.loadLevel();
		}
	},
	
	render: function(elapsedTime) {
		var self = this;
		// Clear the screen
		this.backBufferContext.clearRect(0, 0, WIDTH, HEIGHT);
		//this.backBufferContext.drawImage(game.levels[game.level-1].background.image,game.backgroundx,game.backgroundy,800,500,0,0,800,500);
		this.backBufferContext.drawImage(game.levels[game.level-1].background.image, game.backgroundx/2, 0);
		
		this.backBufferContext.save();
		this.backBufferContext.translate(game.backgroundx*2,0);
		Tilemap.render(this.backBufferContext);
		this.backBufferContext.restore();
		
		game.levels[game.level-1].render(game.backBufferContext);
		
		
		//Render Character
		if(game.renderCharacter)
		{
			game.character.render(this.backBufferContext);
		}
		
		//Render Character Bullets
		game.characterBullets.forEach( function(bullet) {
			bullet.render(self.backBufferContext);
		});
		
		// Render GUI
		this.gui.render(this.backBufferContext);
		
		// Flip buffers
		this.screenContext.clearRect(0,0,WIDTH,HEIGHT);
		this.screenContext.drawImage(this.backBuffer, 0, 0);
		
	},
	
	keyDown: function(e)
	{
		if(e.keyCode == 81)
		{
			keys["q"] = true;
		}
		if(e.keyCode == 37)
		{
			keys["left"] = true;
		}
		else if(e.keyCode == 38)
		{
			keys["up"] = true;
		}
		else if(e.keyCode == 39)
		{
			keys["right"] = true;
		}
		else if(e.keyCode == 40)
		{
			keys["down"] = true;
		}
		if(keys["q"])
		{
			game.character.
			game.character.chargeBullet();
		}
		if(keys["left"] && !keys["up"] && !keys["right"] && !keys["down"])
		{
			this.inputState.left = true;
		}
		else if(!keys["left"] && !keys["up"] && keys["right"] && !keys["down"])
		{
			this.inputState.right = true;
		}
		else if(!keys["left"] && keys["up"] && !keys["right"] && !keys["down"])
		{
			this.inputState.up = true;
		}
		else if(!keys["left"] && !keys["up"] && !keys["right"] && keys["down"])
		{
			this.inputState.down = true;
		}
		else if(!keys["left"] && keys["up"] && keys["right"] && !keys["down"])
		{
			this.inputState.up = true;
			this.inputState.right = true;
		}
		else if(keys["left"] && keys["up"] && !keys["right"] && !keys["down"])
		{
			this.inputState.up = true;
			this.inputState.left = true;
		}
	},
	keyUp: function(e)
	{
		if(e.keyCode == 37)
		{
			keys["left"] = false;
		}
		else if(e.keyCode == 38)
		{
			keys["up"] = false;
		}
		else if(e.keyCode == 39)
		{
			keys["right"] = false;
		}
		else if(e.keyCode == 40)
		{
			keys["down"] = false;
		}
		else if(e.keyCode == 81)
		{
			keys["q"] = false;
			game.character.fireBullet();
		}
		
		if(!keys["left"])
		{
			this.inputState.left = false;
		}
		if(!keys["right"])
		{
			this.inputState.right = false;
		}
		if(!keys["up"])
		{
			this.inputState.up = false;
		}
		if(!keys["down"])
		{
			this.inputState.down = false;
		}
	},
	
	mouseMove: function(e)
	{
		var rect = this.screen.getBoundingClientRect();
		var basex = e.clientX;
		var basey = e.clientY;
		var canvasx = e.clientX - rect.left;
		var canvasy = e.clientY - rect.top;
		this.inputState.x = 0;
		this.inputState.y = 0;
		if(canvasx >= rect.left && canvasx <= rect.right && canvasy >= rect.top && canvasy <= rect.bottom)
		{
			this.inputState.x = canvasx;
			this.inputState.y = canvasy;
		}
	},
	
	mouseClick: function(e){
		if(!this.transition)
		{
			switch (e.which) {
				case 1: //Left click
					break;
				case 3: //Right click
					break;
			}
		}
	},
	
	
	loadLevel: function(){
		var self = this;	
		keys = {
			up: false,
			down: false,
			left: false,
			right: false,
			q: false
		};
		game.backgroundx = 0;
		game.backgroundy = 0;
		game.backgroundLoaded =false;
		game.characterInitialx=0;
		game.renderCharacter = false;
		game.characterBullets =[];
		game.levels[game.level-1].setGame(game);
		//game.levels[game.level-1].load(game.backBufferContext);
		game.character = new Character(game,Tilemap.portals[1].postion.x,Tilemap.portals[1].postion.y-50,game.levels[game.level-1].character.image,game.levels[game.level-1].characterLeft.image,Tilemap.portals[1].postion.x,Tilemap.portals[1].postion.y-50,game.backgroundx);
		game.characterInitialx = game.character.x;
		game.levels[game.level-1].createEnemies(Tilemap.enemies);
		//console.log(game.levels[game.level-1].enemies);
		
		this.gui.message(
		"Welcome to Level "+game.level+" Begin!");
		setTimeout(function() {
            self.gui.message("")
        }, 3000);
	},
	
	
	start: function() {
		var self = this;
		window.onkeydown = function (e) { self.keyDown(e); };
		window.onkeyup = function (e) { self.keyUp(e); };
		this.screen.onmousemove = function(e) {self.keyDown(e); };
		window.onmousemove = function(e) {self.mouseMove(e)};
		// $('#game').mousedown(function(event) {
			// switch (event.which) {
				// case 1:
					// game.bullets.push(new Bullet(game));
					// console.log("Bullet added");
					// break;
				// case 2:
					// alert('Middle Mouse button pressed.');
					// break;
				// case 3:
					// if(game.heli.missiles >0)
					// {
						// game.missiles.push(new Missile(game));
						// game.heli.missiles -= 1;
					// }
					// return false;
				// default:
					// alert('You have a strange Mouse!');
			// }
		// });
		this.startTime = Date.now();
		game.loadLevel();
		window.requestNextAnimationFrame(
			function(time) {
				self.loop.call(self, time);
			}
		);
	},	
	// The game loop.  See
	// http://gameprogrammingpatterns.com/game-loop.html
	loop: function(time) {
		var self = this;
		// Don't advance the clock if the game is paused		
		if(this.paused) this.lastTime = time;
		
		// Calculate additional elapsed time, keeping any
		// unused time from previous frame
		this.elapsedTime += time - this.lastTime; 
		this.lastTime = time;
		
		// The first timestep (and occasionally later ones) are too large
		// causing our processing to take too long (and run into the next
    // frame).  We can clamp to a max of 4 frames to keep that from 
    // happening		
		this.elapsedTime = Math.min(this.elapsedTime, 4 * TIME_STEP);
		
		// We want a fixed game loop of 1/60th a second, so if necessary run multiple
		// updates during each rendering pass
		// Invariant: We have unprocessed time in excess of TIME_STEP
		while (this.elapsedTime >= TIME_STEP) { 
			self.update(TIME_STEP);
			this.elapsedTime -= TIME_STEP;
			
			// add the TIME_STEP to gameTime
			this.gameTime += TIME_STEP;
		}
		
		// We only want to render once
		self.render(this.elapsedTime);
		
		// Repeat the game loop
		window.requestNextAnimationFrame(
			function(time){
				self.loop.call(self, time);
			}
		);
	}
}

var game = new Game('game');
console.log(game);
function waitForLoad() {
	console.log(game.levels[game.level-1].Resource.loading);
    if(game.levels[game.level-1].Resource.loading === 0) {
		game.levels[game.level-1].load(game.backBufferContext);
        game.start();
    }
    else {
        setTimeout(waitForLoad, 1000);
    }
};
waitForLoad();