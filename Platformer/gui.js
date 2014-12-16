// GUI class
//----------------------------------
var GUI = function(game) {
	var self = this;
	
	this.game = game;
	this.oldLives = 0;
	this.oldHealth = 100;
	this.oldShield = 100;
	
	// GUI panels
	this.center = document.getElementById("gui-center");
	this.topLeft = document.getElementById("gui-top-left");
	this.topLeftBelow = document.getElementById("gui-top-leftBelow");
	this.topCenter = document.getElementById("gui-top-center");
	this.topRight = document.getElementById("gui-top-right");
	this.bottomLeft = document.getElementById("gui-bottom-left");
	this.bottomCenter = document.getElementById("gui-bottom-center");
	this.bottomRight = document.getElementById("gui-bottom-right");
	
	// Health bar elements
	this.healthBar = document.createElement('span');
	this.healthBar.className = "health-bar";
	this.healthBackground = document.createElement('span');
	this.healthBackground.className = "health-background";
	this.healthBackground.appendChild(this.healthBar);
	this.topCenter.appendChild(this.healthBackground);
	
	this.shieldBar = document.createElement('span');
	this.shieldBar.className = "shield-bar";
	this.shieldBackground = document.createElement('span');
	this.shieldBackground.className = "shield-background";
	this.shieldBackground.appendChild(this.shieldBar);
	this.topCenter.appendChild(this.shieldBackground);
	
	// Display message on center of screen
	this.message = function(message) {
		self.center.innerHTML = message;
	},
	
	this.render = function(context) {
		
		if(this.oldHealth !== this.game.health) {
			this.healthBar.style.width = Math.max(this.game.health, 0) + "%";
			this.oldHealth = this.game.health;
		}
		if(this.oldShield !== this.game.character.shieldPower)
		{
			this.shieldBar.style.width = Math.max(this.game.character.shieldPower, 0) + "%";
			this.oldShield = this.game.character.shieldPower;
		}
		
		// TODO: Render Lives
		if(this.oldLives !== this.game.lives) {
			this.topLeft.innerHTML = "";
			for(i = 0; i < this.game.lives; i++) {
				var img = $('<img />',
					 { class: 'life',
					   src: 'life.png',
					   alt:'life'})
					  .appendTo(this.topLeft);
			}
			this.oldLives = this.game.lives;
		}
		this.topLeftBelow.innerHTML ="";
		var img = $('<img />',
					 { class: 'jetPack',
					   src: 'jetpack.png',
					   alt:'jetpack'})
					  .appendTo(this.topLeftBelow);
		// TODO: Render Score
		this.topRight.innerHTML = this.game.score;
		
	}
}