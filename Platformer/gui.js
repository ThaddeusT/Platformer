// GUI class
//----------------------------------
var GUI = function(game) {
	var self = this;
	
	this.game = game;
	this.oldLives = 0;
	this.oldHealth = 100;
	
	// GUI panels
	this.center = document.getElementById("gui-center");
	this.topLeft = document.getElementById("gui-top-left");
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
	
	// Display message on center of screen
	this.message = function(message) {
		self.center.innerHTML = message;
	},
	
	this.render = function(context) {
		
		// TODO: Render Health
		if(this.oldHealth !== this.game.health) {
			this.healthBar.style.width = Math.max(this.game.health, 0) + "%";
			this.oldHealth = this.game.health;
		}
		
		// TODO: Render Score
		this.topRight.innerHTML = this.game.score;
		
	}
}