// Screen Size
var WIDTH = 800;
var HEIGHT = 500;
var LEVEL_LENGTH = 140000;

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
  this.screenBounds = this.screen.getBoundingClientRect();
  this.screenContext = this.screen.getContext('2d');
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
  
  // Timing variables
  this.elapsedTime = 0.0;
  this.startTime = 0;
  this.lastTime = 0;
  this.gameTime = 0;
  this.fps = 0;
  this.STARTING_FPS = 60;
  this.levels = [];
  this.levels.push(Level1);
  this.level =1;
}
	
Game.prototype = {

	// Update the game world.  See
	// http://gameprogrammingpatterns.com/update-method.html
	update: function(elapsedTime) {
		var self = this;
		game.levels[game.level-1].update();
	},
	
	render: function(elapsedTime) {
		var self = this;
		
		// Clear the screen
		this.backBufferContext.clearRect(0, 0, WIDTH, HEIGHT);
		this.backBufferContext.drawImage(game.levels[game.level-1].background.image, game.levels[game.level-1].background.offset.x, 0);
		game.levels[game.level-1].render(game.backBufferContext);
		
		// Render GUI
		this.gui.render(this.backBufferContext);
		
		// Flip buffers
		this.screenContext.clearRect(0,0,WIDTH,HEIGHT);
		this.screenContext.drawImage(this.backBuffer, 0, 0);
		
	},
	
	keyDown: function(e)
	{
		// Cycle state is set directly 
		switch(e.keyCode){
			case 37: // LEFT
				this.inputState.left = true;
				break;
			case 38: // UP
				this.inputState.up = true;
				break;
			case 39: // RIGHT
				this.inputState.right = true;
				break;
			case 40: // DOWN
				this.inputState.down = true;
				break;
		}
	},
	keyUp: function(e)
	{
		// Cycle state is set directly 
		switch(e.keyCode){
			case 37: // LEFT
				this.inputState.left = false;
				break;
			case 38: // UP
				this.inputState.up = false;
				break;
			case 39: // RIGHT
				this.inputState.right = false;
				break;
			case 40: // DOWN
				this.inputState.down = false;
				break;
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
	
	
	start: function() {
		var self = this;
    
		window.onkeydown = function (e) { self.keyDown(e); };
		window.onkeyup = function (e) { self.keyUp(e); };
		this.screen.onmousemove = function(e) {self.keyDown(e); };
		window.onmousemove = function(e) {self.mouseMove(e)};
		this.screen.oncontextmenu = function (e) {e.preventDefault();};
		this.screen.onmousedown = function(e) {self.mouseClick(e);};
				
		this.startTime = Date.now();
		
		this.gui.message(
		"Welcome to Level "+game.level+" Begin!");
		setTimeout(function() {
            self.gui.message("")
        }, 3000);
		
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