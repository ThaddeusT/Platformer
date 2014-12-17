var Type3Enemy = function(game, x, y, image,imageLeft, xImageMax, xTravelmax, xcount, radius, startingState, health, damage, value) {
	this.game = game;
	this.type =3;
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
	this.imagex = 0;
	this.imagey = 0;
	this.imagecount = 0;
	this.xImageMax = xImageMax;
	this.xtravelmax = xTravelmax+this.x;
	this.startingX = this.x;
	this.xcount = xcount;
	this.radius = radius;
	this.maxRadius = radius;
	this.facing = "right";
	this.downCheckCounter = 0;
	this.damage = damage;
	this.pointsCount=0;
	this.value = value;
	this.teleportCount = 0;
	this.originalx = x;
	this.originaly = y;
	this.hideHealthBar = false;
};

Type3Enemy.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		// Render enemy
		switch(this.state)
		{
		 case 'normal':
				if(this.imagex == this.xImageMax)
				{
					this.imagex = 0;
				}
				if(this.imagecount==this.xcount){
					this.imagex+=100;
					this.imagecount=0;
				}
				else{
					this.imagecount++;
				}
				context.drawImage(this.sprite_sheet.image, this.imagex, this.imagey, 100, 100,this.x, this.y, this.radius*2,this.radius*2);
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
			console.log(this.value);
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
		if(!this.hideHealthBar)
		{
			var healthPercent = (this.health/this.maxHealth)*this.healthBarWidth;
			context.save();
			context.beginPath();
			context.rect(this.x+(this.radius/2), this.y+30, this.radius,5);
			context.fillStyle = 'gray';
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = 'black';
			context.stroke();
			context.beginPath();
			context.rect(this.x+(this.radius/2),this.y+30,healthPercent,5);
			context.fillStyle = 'lime';
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = 'black';
			context.stroke();
			context.restore();
		}
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
			case "normal":
				if(this.teleportCount==100)
				{
					this.radius = this.maxRadius;
					this.hideHealthBar = false;
					var amount = Math.floor((Math.random() * 100) + 25);
					var direction = Math.floor((Math.random() * 4) + 1);
					switch(direction)
					{
						case 1:
							var tile = Tilemap.tileAt(this.x+this.radius+amount, this.y+this.radius);
							if(tile === undefined || !tile.solid){
								this.x += amount;
							}
						break;
						case 2:
							var tile = Tilemap.tileAt(this.x+this.radius-amount, this.y+this.radius);
							if(tile === undefined || !tile.solid){
								this.x -= amount;
							}
						break;
						case 3:
							var tile = Tilemap.tileAt(this.x+this.radius, this.y+this.radius+amount);
							if((tile === undefined || !tile.solid) && ((this.y+amount)<450)){
								this.y += amount;
							}
						break;
						case 4:
							var tile = Tilemap.tileAt(this.x+this.radius, this.y+this.radius-amount);
							if((tile === undefined || !tile.solid) && ((this.y-amount)>0)){
								this.y -= amount;
							}
						break;
					}
					this.teleportCount=0;
				}
				else{
					this.teleportCount++;
					if(this.teleportCount>50)
					{
						this.radius--;
						this.x++;
						this.y++;
						this.hideHealthBar = true;
					}
				}
				dx = this.x - this.originalx;
				dy = this.y - this.originaly;
				var distance = Math.sqrt(dx*dx + dy*dy);
				if(distance > 300)
				{
					this.x = this.originalx;
					this.y = this.originaly;
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
            this.game.levels[game.level-1].Resource.Sfx.headShot.currentTime = 0;
            this.game.levels[game.level-1].Resource.Sfx.headShot.play();
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