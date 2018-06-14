// Screen Size
var WIDTH = 800;
var HEIGHT = 500;
var LEVEL_LENGTH = 140000;
var keys = {
    up: false,
    down: false,
	left: false,
	right: false,
	q: false,
	e: false,
	w: false
};

var userClicked = false;
var musicOn = true;

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
  this.gameover = false;
  this.gameresetting = false;
  this.score = 0;
  this.lives = 3;
  this.health = 100;
  this.gui = new GUI(this);
  this.levels = [];
  this.levels.push(Level1);
  this.levels.push(Level4);
  this.levels.push(Level5);
  this.levels.push(Level3);
  this.levels.push(Level2);
  this.levels.push(Level6);
  this.level =1;
  this.backgroundx = 0;
  this.backgroundy = 0;
  this.backgroundLoaded =false;
  this.character;
  this.characterInitialx=0;
  this.respawnx = 0;
  this.respawny = 0;
  this.respawnScroll = 0;
  this.renderCharacter = false;
  this.characterBullets =[];
  this.enemyBullets = [];
  this.jetPackPowerCollected = false;
  this.gameStarted = false;
  this.gameInfo = false;
  this.splashScreenCount = 0;
  
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
		if(!this.gameStarted || !this.gameInfo)
		{
			$(".splashScreen").show();
			if(!game.gameover)
			{
				if(!this.gameStarted)
				{
					game.levels[game.level-1].stopLevelMusic();
					if(userClicked && musicOn)
					{
						game.levels[game.level-1].Resource.Music.introMusic.play();
					}
					if(this.splashScreenCount == 10)
					{
						if($(".splashScreen img").attr("src")=="StartScreen0.png")
						{
							$(".splashScreen img").attr("src","StartScreen1.png");
						}
						else
						{
							$(".splashScreen img").attr("src","StartScreen0.png");
						}
						this.splashScreenCount=0;
					}
					else{
						this.splashScreenCount++;
					}
				}
				else{
					$(".splashScreen img").attr("src","instructionScreen.png");
				}
			}
			else{
				$(".splashScreen img").attr("src","creditScreen_WithText.png");
			}
		}
		else{
			$(".splashScreen").hide();
            if(game.levels[game.level-1].Resource.Music.paused && musicOn)
            {
                game.levels[game.level-1].playLevelMusic();
            }
			if(!game.gameover)
			{
				game.levels[game.level-1].update();
				game.character.update(elapsedTime, this.inputState);
				game.characterBullets.forEach(function(bullet)
				{
					bullet.update(elapsedTime);
					//console.log(bullet.x+bullet.radius > game.screen.width || bullet.x-bullet.radius < 0);
					if(bullet.x+bullet.radius > game.screen.width || bullet.x-bullet.radius < 0)
					{
						game.characterBullets.splice($.inArray(bullet, game.characterBullets),1);
					}
					if(bullet.tile){
						if(bullet.tile.solid){
							game.characterBullets.splice($.inArray(bullet, game.characterBullets),1);
						}
					}
					if(bullet.collided)
					{
						game.characterBullets.splice($.inArray(bullet, game.characterBullets),1);
					}
				});
				game.enemyBullets.forEach(function(bullet)
				{
					bullet.update(elapsedTime);
					if(bullet.x+bullet.radius > game.screen.width || bullet.x-bullet.radius < 0)
					{
						game.enemyBullets.splice($.inArray(bullet, game.characterBullets),1);
					}
					//if(bullet.tile){
						//if(bullet.tile.solid){
							//game.characterBullets.splice($.inArray(bullet, game.characterBullets),1);
						//}
					//}
					if(bullet.collided)
					{
						game.enemyBullets.splice($.inArray(bullet, game.characterBullets),1);
					}
				});	
				if(Math.abs(game.character.x-(Tilemap.portals[0].postion.x+game.backgroundx*2))<5 && Math.abs(game.character.y-(Tilemap.portals[0].postion.y))<100)
				{
					this.gui.message("Congratulations You've Beaten Level "+game.level);
					game.levels[game.level-1].stopLevelMusic();
					game.level += 1;
					console.log(game.level);
					//To be overriden by tileFaceLeft.solidtileFaceLeft.solid condition.
					if(game.level > game.levels.length)
					{
						$(".splashScreen").show();
						$(".splashScreen img").attr("src","creditScreen_WithText.png");
						game.jetPackPowerCollected = false;
						game.level = 1;
						if(!game.gameresetting)
						{
							game.levels[game.level-1].stopLevelMusic();
							game.gameresetting = true;
							game.gui.message("Congratulations! You've beaten the game!");
							game.renderCharacter = false;
							this.gameStarted = false;
							this.gameInfo = false;
							setTimeout(function(){ 
								game.level = 1;
								game.lives = 3;
								game.health = 100;
								game.score = 0;
								game.loadLevel();
								game.gameresetting =false;
							}, 2000);
						}
					}
					game.loadLevel();
				}
			}
			else{
				if(!game.gameresetting)
				{
					$(".splashScreen").show();
					$(".splashScreen img").attr("src","creditScreen_WithText.png");
					game.levels[game.level-1].stopLevelMusic();
					game.gameresetting = true;
					game.gui.message("GAME OVER");
					game.renderCharacter = false;
					this.gameStarted = false;
					this.gameInfo = false;
					setTimeout(function(){ 
						game.level = 1;
						game.lives = 3;
						game.health = 100;
						game.score = 0;
						game.loadLevel();
						game.gameresetting =false;
					}, 2000);
                }
			}
		}
	},
	
	render: function(elapsedTime) {
		var self = this;
		// Clear the screen
		this.backBufferContext.clearRect(0, 0, WIDTH, HEIGHT);
		//this.backBufferContext.drawImage(game.levels[game.level-1].background.image,game.backgroundx,game.backgroundy,800,500,0,0,800,500);
		//this.backBufferContext.drawImage(game.levels[game.level-1].background.image, game.backgroundx/2, 0);
		this.backBufferContext.drawImage(game.levels[game.level-1].background.image, 0,0,game.levels[game.level-1].background.size.x,game.levels[game.level-1].background.size.y,game.backgroundx/2, 0, game.levels[game.level-1].background.size.x, 500);
		
		this.backBufferContext.save();
		this.backBufferContext.translate(game.backgroundx*2,0);
		game.levels[game.level-1].render(game.backBufferContext);
		Tilemap.render(this.backBufferContext);
		this.backBufferContext.restore();
		
		
		
		
		//Render Character
		if(game.renderCharacter && !game.gameresetting)
		{
			game.character.render(this.backBufferContext);
		}
		
		//Render Character Bullets
		game.characterBullets.forEach( function(bullet) {
			bullet.render(self.backBufferContext);
		});
		
		//Render Enemy Bullets
		game.enemyBullets.forEach( function(bullet) {
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
		if(e.keyCode == 69)
		{
			keys["e"] = true;
		}
		if(e.keyCode == 87)
		{
			if(game.jetPackPowerCollected)
			{
				keys["w"] = true;
			}
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
			game.character.chargeBullet();
		}
		if(keys["e"])
		{
			game.character.shield();
		}
		if(keys["w"])
		{
			if(game.character.jetPack)
			{
				game.character.disableJetPack();
			}
			else
			{
				game.character.enableJetPack();
			}
		}
		if(e.keyCode ==13)
		{
			if(game.gameover)
			{
				game.gameover = false;
			}
			else
			{
				if(!this.gameStarted)
				{
					this.gameStarted = true;
				}
				else
				{
					if(this.gameStarted)
					{
						this.gameInfo = true;
						game.levels[game.level-1].Resource.Music.introMusic.pause();
						if(musicOn)
						{
							game.levels[game.level-1].playLevelMusic();
						}
					}
				}
			}
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
		else if(!keys["left"] && !keys["up"] && keys["right"] && keys["down"])
		{
			this.inputState.down = true;
			this.inputState.right =true;
		}
		else if(keys["left"] && !keys["up"] && !keys["right"] && keys["down"])
		{
			this.inputState.down = true;
			this.inputState.left =true;
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
		else if(e.keyCode == 69)
		{
			keys["e"] = false;
			game.character.dropShield();
		}
		else if(e.keyCode == 87)
		{
			keys["w"] = false;
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
			q: false,
			e: false,
			j: false
		};
		self.inputState.left = false;
		self.inputState.right = false;
		self.inputState.up = false;
		self.inputState.down = false;
		game.backgroundx = 0;
		game.backgroundy = 0;
		game.backgroundLoaded =false;
		game.levels[game.level-1].load(game.backBufferContext);
		game.characterInitialx=0;
		game.renderCharacter = false;
		game.characterBullets =[];
		game.levels[game.level-1].setGame(game);
		game.health = 100;
		game.character = new Character(game,Tilemap.portals[1].postion.x,Tilemap.portals[1].postion.y-50,game.levels[game.level-1].character.image,game.levels[game.level-1].characterLeft.image,game.levels[game.level-1].jetpack.image, game.levels[game.level-1].jetpackLeft.image);
		game.characterInitialx = game.character.x;
		game.respawnx = Tilemap.portals[1].postion.x;
		game.respawny = Tilemap.portals[1].postion.y-50;
		game.respawnScroll = game.backgroundx;
		game.levels[game.level-1].createEnemies(Tilemap.enemies);
		game.levels[game.level-1].createTreasures(Tilemap.treasures);
		this.gui.message(
		"Welcome to Level "+game.level+" Begin!");
		//Special Level Conditions
		switch(game.level)
		{
			case 1:
				
			break;
			case 2:
			break;
			case 3:
				game.jetPackPowerCollected = true;
				game.character.enableJetPack();
			break;
			case 4:
			break;
			case 5:
				game.lives = 3;
				game.jetPackPowerCollected = false;
				game.character.disableJetPack();
			break;
			case 6:
				game.jetPackPowerCollected = true;
				game.character.enableJetPack();
			break;
		}
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
    if(game.levels[game.level-1].Resource.loading === 0) {
        game.start();
    }
    else {
        setTimeout(waitForLoad, 1000);
    }
};
waitForLoad();

$(document).click(function(){
	userClicked = true;
});

$( "#musicControl" ).click(function() {
	if($("#musicVolumeOnOff").attr("src")=="volume-icon-on.jpg")
	{
		if(!game.gameStarted)
		{
			game.levels[game.level-1].Resource.Music.introMusic.currentTime =0;
			game.levels[game.level-1].Resource.Music.introMusic.pause();
			game.levels[game.level-1].stopLevelMusic();
			musicOn = false;
		}
		else{
			game.levels[game.level-1].stopLevelMusic();
			musicOn = false;
		}		
		$("#musicVolumeOnOff").attr("src","volume-icon-off.png").load(function(){ this.width;});
	}
	else{
		if(!game.gameStarted)
		{
			game.levels[game.level-1].stopLevelMusic();
			game.levels[game.level-1].Resource.Music.introMusic.play();
			musicOn = true;
		}
		else{
			game.levels[game.level-1].Resource.Music.introMusic.pause();
			game.levels[game.level-1].playLevelMusic();
			musicOn = true;
		}		
		$("#musicVolumeOnOff").attr("src","volume-icon-on.jpg");
	}
});
