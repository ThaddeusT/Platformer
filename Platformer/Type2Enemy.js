var Type2Enemy = function(game, x, y, image, xImageMax, xcount, radius, startingState, health, damage, value) {
	this.game = game;
	this.type = 2;
	this.x = x;
	this.y = y;
    this.velocity = 1;
	this.maxHealth = health;
	this.health = health;
	this.state = startingState;
	this.damaged = false;
	this.sprite_sheet = image;
	this.sprite_sheet_explosion = new Image();
	this.sprite_sheet_explosion.src = "explosion.png";
	this.healthBarWidth = radius;
	this.explodex = 0;
	this.explodey = 0;
	this.flyingx = 0;
	this.flyingy = 0;
	this.enemyHead = 40;
	this.flyingcount = 0;
	this.pointsCount = 0;
	this.origin = this.y;
	this.flyingState = "up";
	this.walkingLeftY=0;
	this.xImageMax = xImageMax;
	this.deviation = 100;
	this.xcount = xcount;
	this.radius = radius;
	this.facing = "right";
	this.downCheckCounter = 0;
	this.damage = damage;
	this.value = value;
};

Type2Enemy.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		// Render enemy
		switch(this.state)
		{
		 case 'idle':
			if (Math.abs(this.x + this.game.backgroundx * 8) < 900) 
			{
				this.state = "flying";
			}
			break;
		 case 'flying':
			if(this.x + 50 > 0)
			{
				if(this.flyingx == this.xImageMax)
				{
					this.flyingx = 0;
				}
				if(this.flyingcount==this.xcount){
					this.flyingx+=100;
					this.flyingcount=0;
				}
				else{
					this.flyingcount++;
				}
				//context.drawImage(this.sprite_sheet.image, this.walkingx, this.walkingy, 100, 100,this.x+this.game.backgroundx*2, this.y, 100,100);
				context.drawImage(this.sprite_sheet.image, this.flyingx, this.flyingy, 100, 100, this.x, this.y, this.radius*2, this.radius*2);
			}
			else{
				this.x = 800;
				this.y = game.character.y;
				this.origin = this.y;
				//context.drawImage(this.sprite_sheet_left.image, this.walkingLeftX, this.walkingLeftY, 100, 100,this.x+this.game.backgroundx*2, this.y, 100,100);
				context.drawImage(this.sprite_sheet.image, this.flyingx, this.flyingy, 100, 100, this.x, this.y, this.radius*2, this.radius*2);
			}
			break;
		case 'explode':
			context.drawImage(this.sprite_sheet_explosion, this.explodex, this.explodey, 64, 64, this.x, this.y, this.radius*2, this.radius*2);
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
			context.fillText("+"+this.value, this.x+(this.radius/2),(this.y-(this.radius/2)-(this.pointsCount/6)));
			this.pointsCount++;
			if(this.pointsCount==30)
			{	
				this.state='dead';
			}
			break;
		}
		//Draw hit indicator
		if(this.damaged)
		{
			context.save();
			context.fillStyle = 'rgba(253,8,8,0.1)';
			context.fillRect(this.x,this.y+this.enemyHead-10,this.radius*2,this.radius*2);
			context.restore();
			this.damaged = false;
		}
		//Draw HP Bar
		var healthPercent = (this.health/this.maxHealth)*this.healthBarWidth;
		context.save();
		context.beginPath();
		context.rect(this.x+(this.radius/2), this.y+(this.enemyHead/2), this.radius,5);
		context.fillStyle = 'gray';
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		context.stroke();
		context.beginPath();
		context.rect(this.x+(this.radius/2),this.y+(this.enemyHead/2),healthPercent,5);
		context.fillStyle = 'lime';
		context.fill();
		context.lineWidth = 1;
		context.strokeStyle = 'black';
		context.stroke();
		context.restore();

	},
	update: function() {
		if(this.health<=0)
		{
			this.state='explode';
		}
		if(this.state !='explode' && this.state != 'dead'){
			this.move();
		}
	},
	
	move: function() {
		// var x = (this.x+(this.game.backgroundx*2));
		var x = this.x;
		var tileUp = Tilemap.tileAt(x+50, this.y-100,0);
		var tileDown = Tilemap.tileAt(x+25, this.y+75,0); 
		var tileDownLeft = Tilemap.tileAt(x-25, this.y+75,0); 
		var tileDownRight = Tilemap.tileAt(x+50, this.y+75,0);
		var tileLeft =  Tilemap.tileAt(x-15, this.y+50,0);
		var tileRight = Tilemap.tileAt(x+65, this.y+50,0);
		if (this.state === "flying")
		{
			switch(this.flyingState)
			{
				case "up":
					if(this.y - this.origin > -100 ){
						this.y -= this.velocity * 2;
						this.x -= this.velocity;
					}
					else 
					{
						this.flyingState = "down";
					}
				break;
				
				case "down":
					if(this.origin - this.y > -100 ){
						this.y += this.velocity * 2;
						this.x -= this.velocity;
					}
					else
					{
						this.flyingState = "up";
					}	
				break;
			}
		}
	},
	
	collidedWithCharacter: function(){
		if(!this.game.character.takingDamage)
		{
			this.game.character.updateHealth(-this.damage);
		}
		this.game.character.takingDamage= true;
	},
	
	collideWithCharacterBullet: function(damage, pointMultiplier)
	{	
		if(this.headShot){
			this.health -= 2*damage;
			this.health = Math.floor(this.health);
		}
		else{
			this.health -= damage;
			this.health = Math.floor(this.health);
		}
		if(this.health <0)
		{
			this.health =0;
		}
		this.damaged = true;
	}
};