
// Character class
//----------------------------------
var Character = function(game, x, y, image, imageLeft, jetpackSprite, jetpackLeftSprite) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.radius = 50;
	this.velocity = 1;
	this.health = 100;
	this.state = "normal";
	this.takingDamage = false;
	this.damageCount = 0;
	this.fallAmount = 0;
	this.weaponState = "rest";
	this.sprite_sheet = image;
	this.sprite_sheet_left = imageLeft;
	this.jetPackSheet = jetpackSprite;
	this.jetPackLeftSheet = jetpackLeftSprite;
	this.walkingx = 0;
	this.walkingy = 0;
	this.walkingLeftX=700;
	this.walkingLeftY=0;
	this.walkingcount =0;
	this.jetpackx = 0;
	this.jetpacky = 0;
	this.jetPackLeftX=700;
	this.jetPackLeftY=0;
	this.jetpackcount = 0;
	this.facing = "right";
	this.jumpcount=0;
	this.hitcealing = false;
	this.chargingx=300;
	this.chargingcount=0;
	this.chargingRadius=5;
	this.shielded = false;
	this.shieldCount = 0;
	this.shieldCooldown = 0;
	this.shieldPower = 100;
	this.jetPack = false;
	this.damaged = false;
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
		if(this.jetPack){
			if(this.facing == 'right')
			{
				if(this.jetpackx == 700)
				{
					this.jetpackx = 0;
				}
				if(this.jetpackcount==5){
					this.jetpackx+=100;
					this.jetpackcount=0;
				}
				else{
					this.jetpackcount++;
				}
				context.drawImage(this.jetPackSheet, this.jetpackx, this.jetpacky, 100, 100,this.x-15,this.y+20, 100,100);
			}
			else{
				if(this.jetPackLeftX == 0)
				{
					this.jetPackLeftX = 700;
				}
				if(this.jetpackcount==5){
					this.jetPackLeftX-=100;
					this.jetpackcount=0;
				}
				else{
					this.jetpackcount++;
				}
				context.drawImage(this.jetPackLeftSheet, this.jetPackLeftX, this.jetPackLeftY, 100, 100,this.x+15,this.y+20, 100,100);
			}
		}
		if(this.shielded){
			context.beginPath();
			context.fillStyle = "rgba(15, 45, 242, 0.5)";
			context.arc(this.x+50, this.y+50,63,0,2*Math.PI);
			context.fill();
			context.lineWidth = 3;
			context.strokeStyle = "rgba(15, 45, 242, 0.6)";
			context.stroke();
		}
		if(this.damaged)
		{
			context.save();
			context.fillStyle = 'rgba(253,8,8,0.1)';
			context.fillRect(this.x,this.y,this.radius*2,this.radius*2);
			context.restore();
			this.damaged = false;
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
				this.state = 'dead';
                this.game.levels[game.level-1].Resource.Sfx.deathSound.play();
				this.game.lives--;
				if(this.game.lives > 0){
					this.game.enemyBullets.length = 0;
					this.takingDamage = false;
					this.game.health = 100;
					this.health = 100;
					this.game.backgroundx = this.game.respawnScroll;
					this.x = this.game.respawnx;
					this.y = this.game.respawny;
					this.facing = 'right';
					this.state='normal';
					this.jumpcount = 0;
					this.jetPack = false;
					this.state = 'normal';
					this.jumpcount = 0;
				}
				else{
					this.game.gameover =true;
					if (typeof(Storage) != "undefined") {
						// Store
						if(localStorage.getItem("HighScore") < this.game.score)
						{
							localStorage.setItem("HighScore", this.game.score);
							// Retrieve
							console.log(localStorage.getItem("HighScore"));
						}
					} 
				}
				keys = {
					up: false,
					down: false,
					left: false,
					right: false,
					q: false,
					e: false,
					j: false
				};
				if(this.game.levels[this.game.level-1].jetPackAllowed === undefined || !this.game.levels[this.game.level-1].jetPackAllowed)
				{
					this.game.jetPackPowerCollected = false;
				}
				else{
					if(this.game.jetPackPowerCollected)
					{
						this.enableJetPack();
					}
				}
			}
			else{
				//console.log("Character: "+this.x+","+this.y);
			}
			if(this.shielded)
			{
				this.shieldPower--;
				if(this.shieldPower==0)
				{
					this.shielded = false;
				}
			}
			else
			{
				if(this.shieldPower<100)
				{
					this.shieldPower++;
				}
			}
		}
		
		// // Aim the turrent
		// this.aim(inputState);
	},
	
	chargeBullet: function(){
		this.weaponState = "charging"; 
        if(this.chargingRadius > 5)
        {
            this.game.levels[game.level-1].Resource.Sfx.chargingFire.play();
        }
	},
	
	fireBullet: function() {
		this.chargingx=300;
		this.chargingcount=0;
        this.game.levels[game.level-1].Resource.Sfx.weaponFire.currentTime = 0;
        this.game.levels[game.level-1].Resource.Sfx.weaponFire.play();
        this.game.levels[game.level-1].Resource.Sfx.chargingFire.pause();
		this.weaponState = "rest";
		if(this.facing =="right")
			{
				if(this.state == 'crouching')
				{
					//game, x, y, radius, image, bulletx, bullety, sourcex, sourcey, increment, xImageMax, facing, characterBullet, angle, damage)
					this.game.characterBullets.push(new Bullet(this.game, this.x+77-(this.chargingRadius/5), this.y+68-(this.chargingRadius-5), this.chargingRadius, this.sprite_sheet, 300, 125, 25, 25, 25, 375, this.facing, true, 0, this.chargingRadius));
				}
				else{
					this.game.characterBullets.push(new Bullet(this.game, this.x+77-(this.chargingRadius/5), this.y+50-(this.chargingRadius-5), this.chargingRadius, this.sprite_sheet, 300, 125, 25, 25,25, 375, this.facing, true, 0, this.chargingRadius));
				}
			}
		else{
			if(this.state == 'crouching')
			{
				this.game.characterBullets.push(new Bullet(this.game, this.x+17-(this.chargingRadius*1.5),this.y+68-(this.chargingRadius-5), this.chargingRadius, this.sprite_sheet, 300, 125, 25, 25,25, 375, this.facing, true, 0, this.chargingRadius));
			}
			else
			{
				this.game.characterBullets.push(new Bullet(this.game, this.x+17-(this.chargingRadius*1.5),this.y+50-(this.chargingRadius-5), this.chargingRadius, this.sprite_sheet, 300, 125, 25, 25,25, 375, this.facing, true, 0, this.chargingRadius));
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
	
	shield: function(){
		if(!this.shielded && this.shieldPower==100)
		{
			this.shielded = true;
            this.game.levels[game.level-1].Resource.Sfx.barrierUp.currentTime =0;
            this.game.levels[game.level-1].Resource.Sfx.barrierUp.play();
		}
	},
	
	dropShield: function(){
		this.shieldCooldown = (100-this.shieldPower);
		this.shielded = false;
        this.game.levels[game.level-1].Resource.Sfx.barrierUp.pause();
        this.game.levels[game.level-1].Resource.Sfx.barrierDown.play();
	},
	
	enableJetPack: function(){
		this.jetPack = true;
        this.game.levels[game.level-1].Resource.Sfx.enableJetPackSound.play();
		this.state = 'normal';
		this.jumpcount = 0;
	},
	
	disableJetPack: function(){
		this.jetPack = false;
        this.game.levels[game.level-1].Resource.Sfx.disableJetPackSound.play();
	},
	
	setRespawnPoint: function(x,y, scroll){
		this.game.respawnx = x;
		this.game.respawny = y;
		this.game.respawnScroll = scroll;
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
		var tileUp = Tilemap.tileAt(x+25, this.y-4,0); //y-30 originally 
		var tileDown = Tilemap.tileAt(x+25, this.y+75,0);
		var tileDownForJump = Tilemap.tileAt(x+20, this.y+75,0);
		var tileDownRight = Tilemap.tileAt(x+50, this.y+75,0);
		var tileLeft =  Tilemap.tileAt(x-15, this.y+25,0);
		var tileFaceLeft = Tilemap.tileAt(x,this.y+5);
		var tileRight = Tilemap.tileAt(x+65, this.y+25,0);
		var jtileRightTop = Tilemap.tileAt(x+65, this.y+10,0);
		var jtileRightBottom = Tilemap.tileAt(x+65, this.y+60,0);
		var jtileLeftTop = Tilemap.tileAt(x-15, this.y+10,0);
		var jtileLeftBottom = Tilemap.tileAt(x-15, this.y+60,0);
		// console.log(this.jetPack);
		// console.log(inputState.up,inputState.down,inputState.right,inputState.left);
		// console.log(this.state);
		if(!this.jetPack)
		{
			if(this.state!="jumping")
				{
			if(inputState.up) {
				if(this.state!="jumping"){
					this.hitcealing = false;
				}
				if(this.jumpcount==0)
				{
					this.state="jumping";
                    this.game.levels[game.level-1].Resource.Sfx.jumpingSound.play();
				}
			} 
			else if(inputState.down) {
				if(this.state != 'jumping' && !(tileDown === undefined || !tileDown.solid))
				{
					this.state = "crouching";
				}
				else{
					this.state = "normal";
					if(tileDown === undefined || !tileDown.solid)
					{
						this.y += this.velocity * 9;
					}
					else{
						this.y = Math.floor(this.y/50)*50;
					}
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
				if((jtileLeftTop === undefined || !jtileLeftTop.solid) && (jtileLeftBottom === undefined || !jtileLeftBottom.solid)){
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
				if((jtileRightTop === undefined || !jtileRightTop.solid) && (jtileRightBottom === undefined || !jtileRightBottom.solid)){
					if(this.x +this.velocity <400)
					{
						this.x += this.velocity;
					}
					this.game.backgroundx -=this.velocity*2;
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
					if((jtileRightTop === undefined || !jtileRightTop.solid) && (jtileRightBottom === undefined || !jtileRightBottom.solid)){
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
					if((jtileLeftTop === undefined || !jtileLeftTop.solid) && (jtileLeftBottom === undefined || !jtileLeftBottom.solid) && ((this.x-this.velocity * 2)>0)){
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
					else{
						this.jumpcount = 31;
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
				//if(this.jumpcount >61)
				//{
					//this.state ="normal";
				//}
			}
		}
		else{
			//console.log(inputState.up,inputState.down,inputState.right,inputState.left);
			//console.log("Tile Top Right: "+(jtileRightTop === undefined || !jtileRightTop.solid));
			//console.log("Tile Bottom Right: "+(jtileRightBottom === undefined || !jtileRightBottom.solid));
			if(inputState.up) {
				if((tileUp === undefined || !tileUp.solid) && this.y>-50)
				{
					this.y -= this.velocity*2;
				}
			}
			if(inputState.down) {
				if((tileDown === undefined || !tileDown.solid) && ((this.y+100)<500))
				{
					this.y += this.velocity * 4;
				}
			}
			if(inputState.right) {
				this.facing = "right";
				if((jtileRightTop === undefined || !jtileRightTop.solid) && (jtileRightBottom === undefined || !jtileRightBottom.solid)){
					if(this.x +this.velocity*2 <400)
					{
						this.x += this.velocity*2;
					}
					this.game.backgroundx -=this.velocity*2;
				}
			}
			if(inputState.left)
			{
				this.facing = "left";
				if((jtileLeftTop === undefined || !jtileLeftTop.solid) && (jtileLeftBottom === undefined || !jtileLeftBottom.solid) && (this.x-this.velocity * 2)>0){
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
					if((jtileLeftTop === undefined || !jtileLeftTop.solid) && (jtileLeftBottom === undefined || !jtileLeftBottom.solid))
					{
						if((this.x -this.velocity * 6)>100)
						{
							this.x -= this.velocity*6;
						}		
						if((this.game.backgroundx+this.velocity*2)<0)
						{
							this.game.backgroundx +=this.velocity*2;
						}
					}
					
				}
				else
				{
					if((jtileRightTop === undefined || !jtileRightTop.solid) && (jtileRightBottom === undefined || !jtileRightBottom.solid)){
						this.x += this.velocity*6;
					}
				}
			}
				
		}
	},
	
	updateHealth: function(amount){
		this.health += amount;
		this.game.health += amount;
		if(this.health<0)
		{
			this.health =0;
			this.game.health =0;
		}
		if(this.health >100)
		{
			this.health = 100;
			this.game.health = 100;
		}
	},
	collideWithEnemyBullet: function(damage) {
		if (this.shielded)
		{}
		else
		{
			this.damaged = true;
			this.updateHealth(-damage);
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