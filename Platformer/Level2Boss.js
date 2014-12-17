var Level2Boss = function(game, x, y, image,imageState2,imageState3, imageState4, xImageMax, xcount, radius, startingState, health, damage,value) {
	this.game = game;
	this.type = 2000;
	this.x = x;
	this.y = y;
    this.velocity = 1;
	this.maxHealth = health;
	this.health = health;
	this.state = startingState;
	this.damaged = false;
	this.sprite_sheet = image;
	this.sprite_sheet2 = imageState2;
	this.sprite_sheet3 = imageState3;
	this.sprite_sheet4 = imageState4;
	this.currentSheet = image;
	this.sprite_sheet_explosion = new Image();
	this.sprite_sheet_explosion.src = "explosion.png";
	this.sprite_sheet_bullet = new Image();
	this.sprite_sheet_bullet.src = this.game.character.image;
	this.healthBarWidth = radius;
	this.explodex = 0;
	this.explodey = 0;
	this.crystalx = 0;
	this.flyingy = 0;
	this.enemyHead = 0;
	this.count = 0;
	this.coolDownCount = 0;
	this.origin = this.y;
	this.flyingState = "up";
	this.walkingLeftY=0;
	this.xImageMax = xImageMax;
	this.deviation = 100;
	this.xcount = xcount;
	this.radius = radius;
	this.vulnerable = false;
	this.downCheckCounter = 0;
	this.pointsCount = 0;
	this.damage = damage;
	this.value = value;
	this.attack = 0;
	this.angle = 1.5*Math.PI;
};

Level2Boss.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		// Render enemy
		switch(this.state)
		{
		 case 'idle':
			if(this.crystalx == this.xImageMax)
			{
					this.crystalx = 0;
			}
			if(this.count==this.xcount){
				this.crystalx+=100;
				this.count=0;
			}
			else{
				this.count++;
			}
				
			if (Math.abs(this.x + this.game.backgroundx * 2) < 700) 
			{
				this.vulnerable = true;
				this.attack = Math.floor(Math.random() * 4);
				if (this.attack === 1)
				{
					this.state = "shootingLeft";
				}
				else if (this.attack === 2)
				{
					this.state = "shootingRight";
				}
				else if (this.attack === 3)
				{
					this.state = "lazers";
				}
				this.count = 0;
			}
			context.drawImage(this.sprite_sheet.image, this.crystalx, this.flyingy, 100, 100, this.x, this.y, this.radius*2, this.radius*2);
			break;
		case 'coolDown':
			console.log("Cooling Down: "+(76-this.coolDownCount));
			if(this.crystalx == this.xImageMax)
			{
					this.crystalx = 0;
			}
			if(this.count==this.xcount){
				this.crystalx+=100;
				this.count=0;
			}
			else{
				this.count++;
			}
			if (this.coolDownCount > 75)
			{
				this.attack = Math.floor(Math.random() * 4);
				if (this.attack === 1)
				{
					this.coolDownCount = 0;
					this.state = "shootingLeft";
					this.angle = Math.PI*1.5
				}
				else if (this.attack === 2)
				{
					this.coolDownCount = 0;
					this.state = "shootingRight";
					this.angle = Math.PI*1.5
				}
				else if (this.attack === 3)
				{
					this.count=0;
					this.state = "lazers";
					this.angle = Math.PI*1.5;
				}
				this.coolDownCount = 0;
			}
			else 
			{
				this.coolDownCount++;
			}
			if (Math.abs(this.x + this.game.backgroundx * 2) > 700) 
			{
				this.game.enemyBullets.length = 0;
				this.vulnerable = false;
				this.state = 'idle';
			}
			context.drawImage(this.currentSheet.image, this.crystalx, this.flyingy, 100, 100, this.x, this.y, this.radius*2, this.radius*2);
		break;
		 case 'shootingLeft':
			this.currentSheet = this.sprite_sheet2;
			if(this.crystalx == this.xImageMax)
				{
					this.crystalx = 0;
				}
				if(this.count==this.xcount){
					this.crystalx+=100;
					this.count=0;
				}
				else{
					this.count++;
				}
			if(this.angle > Math.PI)
			{
				var newBullet = new Bullet(this.game, this.x+this.game.backgroundx*2+50,this.y+50, 25, this.sprite_sheet2.image, 0, 0, 100, 100,100, 700, "right", false, this.angle, 15);
				console.log(newBullet);
				this.game.enemyBullets.push(newBullet);
				this.angle -= Math.PI/8;
				//context.drawImage(this.sprite_sheet.image, this.walkingx, this.walkingy, 100, 100,this.x+this.game.backgroundx*2, this.y, 100,100);
				context.drawImage(this.sprite_sheet2.image, this.crystalx, this.flyingy, 100, 100, this.x, this.y, this.radius*2, this.radius*2);
			}
			else{
				//context.drawImage(this.sprite_sheet_left.image, this.walkingLeftX, this.walkingLeftY, 100, 100,this.x+this.game.backgroundx*2, this.y, 100,100);
				context.drawImage(this.sprite_sheet2.image, this.crystalx, this.flyingy, 100, 100, this.x, this.y, this.radius*2, this.radius*2);
				this.state = "coolDown";
				this.angle = 1.5*Math.PI
			}
			break;
			case 'shootingRight':
				this.currentSheet = this.sprite_sheet3;
				if(this.crystalx == this.xImageMax)
				{
					this.crystalx = 0;
				}
				if(this.count==this.xcount){
					this.crystalx+=100;
					this.count=0;
				}
				else{
					this.count++;
				}
			if(this.angle < Math.PI * 2)
			{
				var newBullet = new Bullet(this.game, this.x+this.game.backgroundx*2+50,this.y+50, 25, this.sprite_sheet3.image, 0, 0, 100, 100,100, 700, "right", false, this.angle, 15);
				console.log(newBullet);
				this.game.enemyBullets.push(newBullet);
				this.angle += Math.PI/8;
				//context.drawImage(this.sprite_sheet.image, this.walkingx, this.walkingy, 100, 100,this.x+this.game.backgroundx*2, this.y, 100,100);
				context.drawImage(this.sprite_sheet3.image, this.crystalx, this.flyingy, 100, 100, this.x, this.y, this.radius*2, this.radius*2);
			}
			else{
				//context.drawImage(this.sprite_sheet_left.image, this.walkingLeftX, this.walkingLeftY, 100, 100,this.x+this.game.backgroundx*2, this.y, 100,100);
				context.drawImage(this.sprite_sheet3.image, this.crystalx, this.flyingy, 100, 100, this.x, this.y, this.radius*2, this.radius*2);
				this.state = "coolDown";
			}
			break;
		case 'lazers':
				this.currentSheet = this.sprite_sheet4;
				if(this.crystalx == this.xImageMax)
				{
					this.crystalx = 0;
					//this.coolDownCount = 100;
				}
				console.log(this.count, this.xcount);
				if(this.count==this.xcount){
					this.crystalx+=100;
					this.count=0;
				}
				else{
					this.count++;
				}
				// if(this.crystalx == this.xImageMax)
				// {
					// this.crystalx = 0;
					// this.state = "coolDown";
					// this.count = 0;
				// }
				// if(this.count==5){
					// this.crystalx+=100;
					// this.count=0;
				// }
				// else{
					// this.count++;
				// }
				if (this.coolDownCount >= 30)
				{
					if (this.coolDownCount%10 == 0)
					{
					console.log("Number of Enemy Bullets",+this.game.enemyBullets.length);
						if(this.game.enemyBullets.length <8)
						{
							var newBullet = new Bullet(this.game, this.game.character.x, 0, 25, this.sprite_sheet4.image, 0, 0, 100, 100, 100,700, "right", false, this.angle, 15);
							console.log(newBullet);
							this.game.enemyBullets.push(newBullet);
						}
						else this.coolDownCount = 100;
						if(this.coolDownCount == 100)
						{
							this.state = "coolDown";
							this.coolDownCount = 130;
						}
					}
				}
				this.coolDownCount++;
				context.drawImage(this.sprite_sheet4.image, this.crystalx, this.flyingy, 100, 100, this.x, this.y, this.radius*2, this.radius*2);
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

	},
	
	collidedWithCharacter: function(){
		if(!this.game.character.takingDamage)
		{
			this.game.character.updateHealth(-this.damage);
		}
		this.game.character.takingDamage= true;
	},
	
	collideWithCharacterBullet: function(radiusOfBullet, pointMultiplier)
	{	
		if (this.vulnerable)
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
	}
};

//var EnemyBullet = function (game, x, y, image, angle, damage) {
	//this.game = game;
	//this.x = x;
	//this.y = y;
	//this.sprite_sheet = image;
	//this.angle = angle;
	//this.damage = damage;
	//this.velocity = 3;
	//this.xv = Math.cos(angle) * 3;
	//this.yv = Math.sin(angle) * 3;
//};
//EnemyBullet.prototype = {
	//x: 0,
	//y: 0,
	//velocity: 0,
	
	//render: function(context) {
		//if(this.bulletx == 375)
		//{
			//this.bulletx = 300;
		//}
		//if(this.bulletcount==5)
		//{
			//this.bulletx +=25;
			//this.bulletcount=0;
		//}
		//this.bulletcount++;
		//context.drawImage(this.sprite_sheet, this.bulletx, 125, 25, 25,this.x, this.y, (this.radius*2),(this.radius*2));
	//}, 
	
	//update: function(elapsedTime) 
	//{
		//this.x += elapsedTime * this.xv;
		//this.y += elapsedTime * this.yv;
	//},
	
	//collidedWithCharacter: function(){
		//if(!this.game.character.takingDamage)
		//{
			//this.game.character.updateHealth(-this.damage);
		//}
		//this.game.character.takingDamage= true;
	//},
	
	//collideWithCharacterBullet: function(radiusOfBullet, pointMultiplier)
	//{	

	//}
//};
	