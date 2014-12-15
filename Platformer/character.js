
// Character class
//----------------------------------
var Character = function(game, x, y, image, imageLeft, respawnx, respawny, respawnScroll) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.respawnx = respawnx;
	this.respawny = respawny;
	this.respawnScroll = respawnScroll;
	this.velocity = 1;
	this.health = 100;
	this.state = "normal";
	this.takingDamage = false;
	this.damageCount = 0;
	this.fallAmount = 0;
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
	this.hitcealing = false;
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
					this.chargingRadius+=1;
				}
			}
			this.chargingcount++;
			if(this.facing =="right")
			{
				if(this.state=='crouching')
				{
					context.drawImage(this.sprite_sheet, this.chargingx, 125, 25, 25,this.x+77-(this.chargingRadius/5), this.y+68-(this.chargingRadius-5), (this.chargingRadius*2),(this.chargingRadius*2));
				}
				else
				{
					context.drawImage(this.sprite_sheet, this.chargingx, 125, 25, 25,this.x+77-(this.chargingRadius/5), this.y+50-(this.chargingRadius-5), (this.chargingRadius*2),(this.chargingRadius*2));
				}
			}
			else{
				if(this.state == 'crouching')
				{
					context.drawImage(this.sprite_sheet, this.chargingx, 125, 25, 25,this.x+17-(this.chargingRadius*1.5), this.y+68-(this.chargingRadius-5), (this.chargingRadius*2),(this.chargingRadius*2));
				}
				else
				{
					context.drawImage(this.sprite_sheet, this.chargingx, 125, 25, 25,this.x+17-(this.chargingRadius*1.5), this.y+50-(this.chargingRadius-5), (this.chargingRadius*2),(this.chargingRadius*2));
				}
			}
			break;
		}
		// context.beginPath();
		// context.rect(this.x,this.y,100,100);
		// context.stroke();
		// context.beginPath();
		// context.fillStyle = 'green';
		// context.arc(this.x-15, this.y+25,3,0,2*Math.PI);
		// context.fill();
		// context.stroke();
		// context.beginPath();
		// context.fillStyle = 'red';
		// context.arc(this.x-1, this.y+50,3,0,2*Math.PI);
		// context.fill();
		// context.stroke();
		// context.beginPath();
		// context.fillStyle = 'blue';
		// context.arc(this.x+80, this.y+50,3,0,2*Math.PI);
		// context.fill();
		// context.stroke();
		
	},
	
	update: function(elapsedTime, inputState) {
	
		// // Move the character
		if(game.renderCharacter)
		{
			this.move(inputState);
			if(this.y>500)
			{
				game.health = 0;
			}
			if(game.health <=0)
			{
				this.game.lives--;
				if(this.game.lives > 0){
					this.game.health = 100;
					this.health = 100;
					this.game.backgroundx = this.respawnScroll;
					this.x = this.respawnx;
					this.y = this.respawny;
					this.facing = 'right';
				}
				else{
					this.game.gameover =true;
				}
			}
		}
		
		// // Aim the turrent
		// this.aim(inputState);
	},
	
	chargeBullet: function(){
		this.weaponState = "charging"; 
	},
	
	fireBullet: function() {
		this.chargingx=300;
		this.chargingcount=0;
		this.weaponState = "rest";
		if(this.facing =="right")
			{
				if(this.state == 'crouching')
				{
					this.game.characterBullets.push(new Bullet(this.game, this.x+77-(this.chargingRadius/5), this.y+68-(this.chargingRadius-5), this.chargingRadius, this.sprite_sheet, this.facing));
				}
				else{
					this.game.characterBullets.push(new Bullet(this.game, this.x+77-(this.chargingRadius/5), this.y+50-(this.chargingRadius-5), this.chargingRadius, this.sprite_sheet, this.facing));
				}
			}
		else{
			if(this.state == 'crouching')
			{
				this.game.characterBullets.push(new Bullet(this.game, this.x+17-(this.chargingRadius*1.5),this.y+68-(this.chargingRadius-5), this.chargingRadius, this.sprite_sheet, this.facing));
			}
			else
			{
				this.game.characterBullets.push(new Bullet(this.game, this.x+17-(this.chargingRadius*1.5),this.y+50-(this.chargingRadius-5), this.chargingRadius, this.sprite_sheet, this.facing));
			}
		}
		this.chargingRadius =5;
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
		var x = (this.x-(this.game.backgroundx*2));
		var tileUp = Tilemap.tileAt(x+25, this.y-4,0);
		var tileDown = Tilemap.tileAt(x+25, this.y+75,0);
		var tileDownForJump = Tilemap.tileAt(x+20, this.y+75,0);
		var tileDownRight = Tilemap.tileAt(x+50, this.y+75,0);
		var tileLeft =  Tilemap.tileAt(x-15, this.y+25,0);
		var tileFaceLeft = Tilemap.tileAt(x,this.y+5);
		var tileRight = Tilemap.tileAt(x+65, this.y+25,0);
		if(this.state!="jumping")
			{
		if(inputState.up) {
			if(this.state!="jumping"){
				this.hitcealing = false;
			}
			if(this.jumpcount==0)
			{
				this.state="jumping";
			}
		} 
		else if(inputState.down) {
			if(this.state != 'jumping')
			{
				this.state = "crouching";
			}
		}
		else if(inputState.left) {
			this.facing = "left";
			this.state="walkingLeft";
			if(tileFaceLeft === undefined)
			{
			}
			else{
				console.log(tileFaceLeft.solid);
			}
			if(tileLeft === undefined || !tileLeft.solid){
				if((this.x -this.velocity)>100)
				{
					this.x -= this.velocity;
				}
				if(this.game.backgroundx+this.velocity<0)
				{
					this.game.backgroundx +=this.velocity*2;
				}
			}
			if(tileDown === undefined || !tileDown.solid)
			{
				this.y += this.velocity * 10;
			}
		} 
		else if(inputState.right) {
			this.facing = "right";
			this.state="walkingRight";
			if(tileRight === undefined){
				if(this.x +this.velocity <400)
				{
					this.x += this.velocity;
				}
				this.game.backgroundx -=this.velocity*2;
			}
			else{
				if(!tileRight.solid)
				{
					if((this.x +this.velocity) <300)
					{
						this.x += this.velocity;
					}
					this.game.backgroundx -=this.velocity*2;
				}
			}
			if(tileDown === undefined || !tileDown.solid)
			{
				this.y += this.velocity * 10;
			}
			else{
				this.y = Math.floor(this.y/50)*50;
			}
		} 
		else {
			this.state ="normal";
			if(tileDown === undefined || !tileDown.solid)
			{
				this.y += this.velocity * 9;
			}
			else{
				this.y = Math.floor(this.y/50)*50;
			}
		}
		}
		//calculate for jumping
		if(this.state == "jumping")
		{
			this.jumpcount++;
			if(inputState.right) {
				this.facing = "right";
				if(tileRight === undefined || !tileRight.solid){
					if((this.x +this.velocity * 2) <400)
					{
						this.x += this.velocity;
					}
					this.game.backgroundx -=this.velocity*2;
				}
			}
			if(inputState.left)
			{
				this.facing = "left";
				if(tileLeft === undefined || !tileLeft.solid && (this.x-this.velocity * 2)>0){
					if((this.x -this.velocity * 2)>100)
					{
						this.x -= this.velocity;
					}
					
					if(this.game.backgroundx+this.velocity<0)
					{
						this.game.backgroundx +=this.velocity*2;
					}
				}
			}
			if(this.jumpcount<30)
			{
				if(tileUp === undefined || !tileUp.solid)
				{
					if (this.hitcealing === false)
					{
						this.y -= this.velocity * 4;
					}
				}
<<<<<<< HEAD
				else
				{
=======
				else{
					this.jumpcount = 31;
>>>>>>> origin/Adding-Level-2
					this.hitcealing = true;
				}
			}
			if(this.jumpcount >30)
			{
				if((tileDown === undefined || !tileDown.solid) && (tileDownRight === undefined || !tileDownRight.solid))
				{
					if (this.jumpcount < 61) 
					{
						this.y += this.velocity*6;
					}
					else if (this.jumpcount > 61)
					{
						this.y += this.velocity * 9;
					}
				}
				else{
					this.jumpcount = 0;
					this.state = "normal";
					this.y = Math.floor(this.y/50)*50;
				}
			}
		}
		if(this.takingDamage)
		{
			if(this.damageCount == 10)
			{
				this.takingDamage = false;
				this.damageCount = 0;
			}
			else{
				this.damageCount++;
				if(this.facing == 'right')
				{
					if(tileLeft === undefined || !tileLeft.solid)
					{
						this.x -= this.velocity*6;
					}
				}
				else
				{
					if(tileRight === undefined || !tileRight.solid){
						this.x += this.velocity*6;
					}
				}
			}
				
		}
	},
	
	updateHealth: function(amount){
		if((this.health + amount) >-1 && (this.health + amount) <100)
		{
			this.health += amount;
			this.game.health += amount;
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