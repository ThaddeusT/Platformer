var Level3Boss = function(game, x, y, image,imageLeft, radius, startingState, health, damage, value) {
	this.game = game;
	this.type = 1000;
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
	this.spriteIter = 0;
	this.spriteIterCount = 5;
	this.moveCount = 75;
	this.toLeft = 550;
	this.onLeft = 0;
	this.direction = 1;
};

Level3Boss.prototype = {
	x: 0,
	y: 0,
	
	render: function(context) {
		// Render enemy
		switch(this.state)
		{
		 case 'walking':
			context.drawImage(this.sprite_sheet.image, 400*this.spriteIter,0,400,400,this.x-145,this.y-160,350,350);
			this.spriteIterCount--;
			if(this.spriteIterCount==0){
				this.spriteIterCount=5;
				this.spriteIter=(this.spriteIter+1)%8;
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
            this.game.levels[game.level-1].Resource.Sfx.headShot.play();
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
		this.moveCount--;
		if(this.moveCount<0){
			this.onLeft+=this.velocity*this.direction;
			this.x-=this.velocity*this.direction;
            //this.game.levels[game.level-1].Resource.Sfx.bossScream.play();
			if(this.onLeft>=this.toLeft){
				this.direction = -1;
				this.x+= (this.onLeft-this.toLeft);
				this.onLeft = this.toLeft;
                //this.game.levels[game.level-1].Resource.Sfx.bossScream.play();
			} 
			else if (this.onLeft<=0){
                this.game.levels[game.level-1].Resource.Sfx.bossScream.play();
				this.direction = 1;
				this.moveCount = 100;
				this.x+=this.onLeft;
				this.onLeft = 0;
            }
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