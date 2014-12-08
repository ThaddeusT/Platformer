
// Character class
//----------------------------------
var Character = function(game, x, y, image, imageLeft) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.velocity = 1;
	this.health = 100;
	this.state = "normal";
	this.weaponState = "rest";
	this.sprite_sheet = image;
	this.sprite_sheet_left = imageLeft;
	this.walkingx = 0;
	this.walkingy = 0;
	this.walkingLeftX=700;
	this.walkingLeftY=0;
	this.walkingcount =0;
	this.facing = "right";
	this.jumpcount=0;
	this.chargingx=300;
	this.chargingcount=0;
	this.chargingRadius=5;
};

Character.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		//Character Rendering
		switch(this.state){
			case "normal":
				if(this.facing =="right")
				{
					context.drawImage(this.sprite_sheet, 0, 100, 100, 100,this.x, this.y, 100,100);
				}
				else{
					context.drawImage(this.sprite_sheet_left, 700, 100, 100, 100,this.x, this.y, 100,100);
				}
				this.walkingLeftX=700;
				this.walkingLeftY=0;
				this.walkingx = 0;
				this.walkingy = 0;
			break;
			case "jumping":
				this.jumpcount++;
				this.walkingLeftX=700;
				this.walkingLeftY=0;
				this.walkingx = 0;
				this.walkingy = 0;
				if(this.facing =="right")
				{
					context.drawImage(this.sprite_sheet, 200, 100, 100, 100,this.x, this.y, 100,100);
				}
				else{
					context.drawImage(this.sprite_sheet_left, 500, 100, 100, 100,this.x, this.y, 100,100);
				}
			break;
			case "crouching":
				if(this.facing =="right")
				{
					context.drawImage(this.sprite_sheet, 100, 100, 100, 100,this.x, this.y, 100,100);
				}
				else{
					context.drawImage(this.sprite_sheet_left, 600, 100, 100, 100,this.x, this.y, 100,100);
				}
			break;
			case "walkingRight":
				if(this.walkingx == 700)
				{
					this.walkingx = 0;
				}
				if(this.walkingcount==5){
					this.walkingx+=100;
					this.walkingcount=0;
				}
				else{
					this.walkingcount++;
				}
				context.drawImage(this.sprite_sheet, this.walkingx, this.walkingy, 100, 100,this.x, this.y, 100,100);
			break;
			case "walkingLeft":
				if(this.walkingLeftX == 0)
				{
					this.walkingLeftX = 700;
				}
				if(this.walkingcount==5){
					this.walkingLeftX-=100;
					this.walkingcount=0;
				}
				else{
					this.walkingcount++;
				}
				context.drawImage(this.sprite_sheet_left, this.walkingLeftX, this.walkingLeftY, 100, 100,this.x, this.y, 100,100);
			break;
		}
	
		//Weapon Rendering
		switch(this.weaponState)
		{
			case "rest":
				break;
			case "charging":
			if(this.chargingx == 375)
			{
				this.chargingx = 300;
			}
			if(this.chargingcount==5)
			{
				this.chargingx +=25;
				this.chargingcount=0;
				if(this.chargingRadius < 25)
				{
					this.chargingRadius+=.5;
				}
			}
			this.chargingcount++;
			if(this.facing =="right")
			{
				context.drawImage(this.sprite_sheet, this.chargingx, 125, 25, 25,this.x+77-(this.chargingRadius/5), this.y+50-(this.chargingRadius-5), (this.chargingRadius*2),(this.chargingRadius*2));
			}
			else{
				context.drawImage(this.sprite_sheet, this.chargingx, 125, 25, 25,this.x+17-(this.chargingRadius*1.5), this.y+50-(this.chargingRadius-5), (this.chargingRadius*2),(this.chargingRadius*2));
			}
			break;
		}
	},
	
	update: function(elapsedTime, inputState) {
	
		// // Move the helicopter
		this.move(inputState);	
		
		// // Aim the turrent
		// this.aim(inputState);
	},
	
	chargeBullet: function(){
		this.weaponState = "charging"; 
	},
	
	fireBullet: function() {
		this.chargingx=300;
		this.chargingcount=0;
		this.chargingRadius=5;
		this.weaponState = "rest";
		// var bullet = new Bullet(
			// this.game,
			// this.x + 42*Math.cos(1.0+this.pitch_angle) + 20*Math.cos(this.turret_angle),
			// this.y + 42*Math.sin(1.0+this.pitch_angle) + 20*Math.sin(this.turret_angle),
			// 8*Math.cos(this.turret_angle), 
			// 8*Math.sin(this.turret_angle)
		// );
		// this.game.bullets.push(bullet);
	},
	
	fireMissile: function(x, y) {
		if(this.missiles > 0) {
			var missile = new Missile(
				this.game, 
				this.sprite_sheet, 
				this.x, 
				this.y+35, 
				x, 
				y
			);
			this.game.missiles.push(missile);
			this.missiles -= 1;
		}
	},
	
	move: function(inputState) {
		var tileUp = Tilemap.tileAt(this.x+50, this.y-100,0);
		var tileDown = Tilemap.tileAt(this.x+50, this.y+75,0);
		var tileLeft =  Tilemap.tileAt(this.x-75, this.y+50,0);
		var tileRight = Tilemap.tileAt(this.x+75, this.y+50,0);
		if(this.state!="jumping")
			{
		if(inputState.up) {
			if(this.state!="jumping"){
				this.jumpcount = 0;
			}
			this.state="jumping";
			console.log(this.state);
		} 
		else if(inputState.down) {
			this.state = "crouching";
		}
		else if(inputState.left) {
			this.facing = "left";
			this.state="walkingLeft";
			if(tileLeft === undefined || !tileLeft.solid){
				if((this.x -this.velocity)>0)
				{
					this.x -= this.velocity;
					if(this.game.backgroundx+this.velocity<0)
					{
						this.game.backgroundx +=this.velocity;
					}
				}
			}
			if(tileDown === undefined)
			{
				this.y += this.velocity * 3;
			}
		} 
		else if(inputState.right) {
			this.facing = "right";
			this.state="walkingRight";
			if(tileRight === undefined){
				this.x += this.velocity;
				this.game.backgroundx -=this.velocity;
			}
			else{
				if(!tileRight.solid)
				{
					this.x += this.velocity;
					this.game.backgroundx -=this.velocity;
				}
			}
			if(tileDown === undefined)
			{
				this.y += this.velocity * 3;
			}
		} 
		else {
			this.state ="normal";
			if(tileDown === undefined)
			{
				this.y += this.velocity * 3;
			}
		}
		}
		//calculate for jumping
		if(this.state == "jumping")
		{
			if(inputState.right) {
				this.facing = "right";
				if(tileRight === undefined || !tileRight.solid){
					this.x += this.velocity * 2;
					this.game.backgroundx -=this.velocity;
				}
			}
			if(inputState.left)
			{
				this.facing = "left";
				if(tileLeft === undefined || !tileLeft.solid && (this.x-this.velocity * 2)>0){
					this.x -= this.velocity * 2;
					if(this.game.backgroundx+this.velocity<0)
					{
						this.game.backgroundx +=this.velocity;
					}
				}
			}
			if(this.jumpcount<30)
			{
				this.y -= this.velocity * 2;
			}
			if(this.jumpcount >30 && this.jumpcount <61)
			{
				if(tileDown === undefined || !tileDown.solid)
				{
					this.y += this.velocity*5;
				}
				else{
					this.jumpcount = 62;
					console.log(this.y);
					console.log("Calculation 100: "+Math.floor(this.y/100)+" Calculation 50: "+Math.floor(this.y/50));
					this.y = Math.floor(this.y/50)*50;
				}
			}
			if(this.jumpcount >61)
			{
				this.state ="normal";
				console.log(this.state);
			}
		}
	},
	
	aim: function(inputState) {
		var x, y, angle;
		x = inputState.worldX - this.x + 10;
		y = inputState.worldY - this.y + 35;
		angle = Math.atan2(y, x);
		this.turret_angle = Math.min(Math.PI/2, Math.max(-Math.PI/8, angle));
	},
	
	bounds: function() {
		return {
			top: this.x - 64,
			left: this.y,
			bottom: this.y + 50,
			right: this.x + 67
		};
	}
};