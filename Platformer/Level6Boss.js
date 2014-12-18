var Level6Boss = function(game, x, y, image,imageLeft,xImageMax, radius, xWalkingmax, xcount, startingState, health, damage, value) {
	this.game = game;
	this.type = 1005;
	this.x = x;
	this.y = y;
	this.velocity = 7;
	this.maxHealth = health;
	this.health = health;
	this.state = startingState;
	this.damaged = false;
	this.headShot = false;
	this.sprite_sheet = image;
	this.sprite_sheet_left = imageLeft;
	this.sprite_sheet_fire = new Image();
	this.sprite_sheet_fire.src = "fireballSpriteSheet25.png";
	this.sprite_sheet_explosion = new Image();
	this.sprite_sheet_explosion.src = "explosion.png";
	this.healthBarWidth = radius;
	this.headShotCount=0;
	this.explodex = 0;
	this.explodey = 0;
	this.radius = radius;
	this.damage = damage;
	this.pointsCount=0;
	this.value = value;
	this.walkingx = 0;
	this.walkingy = 0;
	this.walkingcount = 0;
	this.walkingLeftX = 2800;
	this.walkingLeftY=0;
	this.xImageMax = xImageMax;
	this.xWalkingmax = xWalkingmax;
	this.stepCount = 0;
	this.startingX = this.x;
	this.xcount = xcount;
	this.facing = "left";
	this.fireState = false;
	this.fireCount = 100;
	this.angle = 0;
};

Level6Boss.prototype = {
	x: 0,
	y: 0,
	
	render: function(context) {
		// Render enemy
		switch(this.state)
		{
		 case 'walking':
			if(this.facing == 'right')
			{
				if(this.walkingx == 0)
				{
					this.walkingx = this.xImageMax;
				}
				if(this.walkingcount==this.xcount){
					this.walkingx-=400;
					this.walkingcount=0;
				}
				else{
					this.walkingcount++;
				}
				//context.drawImage(this.sprite_sheet.image, this.walkingx, this.walkingy, 100, 100,this.x+this.game.backgroundx*2, this.y, 100,100);
				//context.drawImage(this.sprite_sheet.image, this.walkingx, this.walkingy, 100, 100,this.x, this.y, this.radius*2,this.radius*2);
				context.drawImage(this.sprite_sheet_left.image, this.walkingx, this.walkingy,400,400,this.x-145,this.y-160,350,350);
			}
			else{
				if(this.walkingLeftX == this.xImageMax)
				{
					this.walkingLeftX = 0;
				}
				if(this.walkingcount==5){
					this.walkingLeftX+=400;
					this.walkingcount=0;
				}
				else{
					this.walkingcount++;
				}
				//context.drawImage(this.sprite_sheet_left.image, this.walkingLeftX, this.walkingLeftY, 100, 100,this.x+this.game.backgroundx*2, this.y, 100,100);
				//context.drawImage(this.sprite_sheet_left.image, this.walkingLeftX, this.walkingLeftY, 100, 100,this.x, this.y, this.radius*2,this.radius*2);
				context.drawImage(this.sprite_sheet.image,this.walkingLeftX, this.walkingLeftY,400,400,this.x-145,this.y-160,350,350);
			}
			break;
		case 'explode':
			context.drawImage(this.sprite_sheet_explosion, this.explodex, this.explodey, 64, 64, this.x-145, this.y-160, this.radius*2, this.radius*2);
			if(this.explodey <320)
			{
				this.explodex += 64;
				if(this.explodex > 320)
				{
					this.explodex = 0;
					this.explodey +=64;
				}
			}
			else
			{
				this.state = 'dead';
			}
			context.fillStyle = "lime";
			context.font = "bold 12px Arial";
			context.fillText("+"+this.value, this.x,this.y-(this.pointsCount/6));
			this.pointsCount++;
			if(this.pointsCount==30)
			{	
				this.state='dead';
			}
			break;
		}
		//console.log(this.fireState);
		if (this.fireState)
		{
			this.angle = this.angle += Math.PI/4
			if ((this.angle % (2 * Math.PI)) == 0)
				{
					this.angle = 0;
				}
			//console.log(this.angle);
			if (this.facing == "right")
			{
				var newBullet = new Bullet(this.game, this.x + this.game.backgroundx*2 + 75, this.y, 25, this.sprite_sheet_fire, 0, 0, 25, 25, 25, 50, "right", false, this.angle, 15);
				//console.log(newBullet);
				this.game.enemyBullets.push(newBullet);
			}
			else 
			{
				var newBullet = new Bullet(this.game, this.x + this.game.backgroundx*2, this.y, 25, this.sprite_sheet_fire, 0, 0, 25, 25, 25, 50, "right", false, this.angle, 15);
				//console.log(newBullet);
				this.game.enemyBullets.push(newBullet);
			}
			this.fireCount = 0;
			this.fireState = false;
		}
		else
		{
			this.fireCount++;
			if (this.fireCount >= 100);
			this.fireState = true;
		}
			
		//Draw hit indicator
		if(this.damaged)
		{
			context.save();
			context.fillStyle = 'rgba(253,8,8,0.1)';
			context.fillRect(this.x-145,this.y-160,this.radius*2,this.radius*2);
			context.restore();
			this.damaged = false;
		}
		//Draw HP Bar
		var healthPercent = (this.health/this.maxHealth)*this.healthBarWidth;
		context.save();
		context.beginPath();
		context.rect(this.x-60, this.y-100, this.radius,5);
		context.fillStyle = 'gray';
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		context.stroke();
		context.beginPath();
		context.rect(this.x-60,this.y-100,healthPercent,5);
		context.fillStyle = 'lime';
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		context.stroke();
		context.restore();
		if(this.headShot)
		{
			context.fillStyle = "purple";
			context.font = "bold 12px Arial";
			context.fillText("Head Shot!", this.x+(this.radius/2),this.y+((this.enemyHead/2)-5)-(this.headShotCount/6));
			this.headShotCount++;
			if(this.headShotCount==30)
			{	
				this.headShot = false;
			}
			
		}
	},
	update: function() {
		if(this.health<=0)
		{
			this.state='explode';
		}
		if(this.state !='explode' && this.state != 'dead'){
			this.move();
			//console.log(this.x,this.y);
		}
	},
	
	move: function() {
		switch(this.state)
		{
			case "walking":
			//console.log(this.facing);
				if(this.facing=='right'){
						if(this.stepCount < this.xWalkingmax)
						{
							this.x += this.velocity;
							this.stepCount++;
						}
						else{
							this.stepCount =0;
							this.facing = 'left';
							this.walkingcount = 0;
							this.walkingLeftX = 2800;
							this.walkingLeftY=0;
						}
				}
				if(this.facing=='left'){
						if(this.stepCount < this.xWalkingmax)
						{
							this.x -= this.velocity;
							this.stepCount++;
						}
						else{
							this.stepCount = 0;
							this.facing ='right';
							this.walkingx = 0;
							this.walkingy = 0;
							this.walkingcount = 0;
						}
				}
			break;
		}		
	},
	
	collidedWithCharacter: function(){
		if(!this.game.character.takingDamage && !this.game.character.shielded)
		{
			this.game.character.updateHealth(-this.damage);
		}
		this.game.character.takingDamage = true;
	},
	
	collideWithCharacterBullet: function(radiusOfBullet, pointMultiplier)
	{	
		if(this.headShot){
			this.health -= 2*radiusOfBullet;
		}
		else{
			this.health -= radiusOfBullet;
			//console.log("Boss Health: "+ this.health);
		}
		if(this.health <0)
		{
			this.health =0;
		}
		this.damaged = true;
	}
};