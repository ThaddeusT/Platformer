var Level3Boss = function(game, x, y, image,imageLeft, xImageMax, xWalkingmax, xcount, radius, startingState, health, damage, value) {
	this.game = game;
	this.type =1;
	this.x = x;
	this.y = y;
    this.velocity = 1;
	this.maxHealth = health;
	this.health = health;
	this.state = startingState;
	this.damaged = false;
	this.headShot = false;
	this.sprite_sheet = image;
	this.sprite_sheet_left = imageLeft;
	this.sprite_sheet_explosion = new Image();
	this.sprite_sheet_explosion.src = "explosion.png";
	this.healthBarWidth = radius;
	this.headShotCount=0;
	this.explodex = 0;
	this.explodey = 0;
	this.walkingx = 0;
	this.walkingy = 0;
	this.walkingcount = 0;
	this.walkingLeftX = 700;
	this.walkingLeftY=0;
	this.xImageMax = xImageMax;
	this.xWalkingmax = xWalkingmax+this.x;
	this.startingX = this.x;
	this.xcount = xcount;
	this.radius = radius;
	this.facing = "right";
	this.downCheckCounter = 0;
	this.damage = damage;
	this.pointsCount=0;
	this.value = value;
	this.spriteIter = 0;
	this.spriteIterCount = 5;
};

Level3Boss.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		// Render enemy
		switch(this.state)
		{
		 case 'walking':
			// if(this.facing == 'right')
			// {
				// if(this.walkingx == this.xImageMax)
				// {
					// this.walkingx = 0;
				// }
				// if(this.walkingcount==this.xcount){
					// this.walkingx+=100;
					// this.walkingcount=0;
				// }
				// else{
					// this.walkingcount++;
				// }
				// context.drawImage(this.sprite_sheet.image, this.walkingx, this.walkingy, 100, 100,this.x, this.y, this.radius*2,this.radius*2);
			// }
			// else{
				// if(this.walkingLeftX == 0)
				// {
					// this.walkingLeftX = this.xImageMax;
				// }
				// if(this.walkingcount==5){
					// this.walkingLeftX-=100;
					// this.walkingcount=0;
				// }
				// else{
					// this.walkingcount++;
				// }
				// context.drawImage(this.sprite_sheet_left.image, this.walkingLeftX, this.walkingLeftY, 100, 100,this.x, this.y, this.radius*2,this.radius*2);
			// }
			context.drawImage(this.sprite_sheet.image, 400*this.spriteIter,0,400,400,this.x-125,this.y-125,250,250);
			this.spriteIterCount--;
			if(this.spriteIterCount==0){
				this.spriteIterCount=5;
				this.spriteIter=(this.spriteIter+1)%8;
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
			context.fillText("+"+this.value, this.x+(this.radius/2),this.y-(this.pointsCount/6));
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
			console.log("Boss: "+this.x+","+this.y);
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
		switch(this.state)
		{
			// case "walking":
				// if(this.facing=='right'){
					// if(tileRight === undefined || !tileRight.solid){
						// if(this.x < this.xWalkingmax)
						// {
							// this.x += this.velocity;
						// }
						// else{
							// this.facing = 'left';
							// this.walkingcount = 0;
							// this.walkingLeftX = 700;
							// this.walkingLeftY=0;
						// }
					// }
					// else{
						// this.facing = 'left';
						// this.walkingcount = 0;
						// this.walkingLeftX = 700;
						// this.walkingLeftY=0;
					// }
				// }
				// if(this.facing=='left'){
					// if(tileLeft === undefined || !tileLeft.solid){
						// if(this.x >= this.startingX-this.xWalkingmax)
						// {
							// this.x -= this.velocity;
						// }
						// else{
							// this.facing ='right';
							// this.walkingx = 0;
							// this.walkingy = 0;
							// this.walkingcount = 0;
						// }
					// }
					// else{
						// this.facing ='right';
						// this.walkingx = 0;
						// this.walkingy = 0;
						// this.walkingcount = 0;
					// }
				// }
				// if(tileDownLeft === undefined || !tileDownLeft.solid )
				// {
					// this.facing = 'right';
					// this.walkingx = 0;
					// this.walkingy = 0;
					// this.walkingcount = 0;
				// }
				// if(tileDownRight === undefined || !tileDownRight.solid)
				// {
					// this.facing = 'left';
					// this.walkingcount = 0;
					// this.walkingLeftX = 700;
					// this.walkingLeftY=0;
				// }
			// break;
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
		}
		if(this.health <0)
		{
			this.health =0;
		}
		this.damaged = true;
	}
};