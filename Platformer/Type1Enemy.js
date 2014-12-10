var Type1Enemy = function(game, x, y, image,imageLeft, xImageMax, xWalkingmax, xcount, radius, startingState) {
	this.game = game;
	this.x = x;
	this.y = y;
    this.velocity = 1;
	this.health = 100;
	this.state = startingState;
	this.sprite_sheet = image;
	this.sprite_sheet_left = imageLeft;
	this.sprite_sheet_explosion = new Image();
	this.sprite_sheet_explosion.src = "explosion.png";
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
};

Type1Enemy.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		// Render enemy
		switch(this.state)
		{
		 case 'walking':
			console.log("Rendering Enemy At: "+ this.x+","+this.y);
			if(this.facing == 'right')
			{
				if(this.walkingx == this.xImageMax)
				{
					this.walkingx = 0;
				}
				if(this.walkingcount==this.xcount){
					this.walkingx+=100;
					this.walkingcount=0;
				}
				else{
					this.walkingcount++;
				}
				context.drawImage(this.sprite_sheet.image, this.walkingx, this.walkingy, 100, 100,this.x+this.game.backgroundx*2, this.y, 100,100);
			}
			else{
				if(this.walkingLeftX == 0)
				{
					this.walkingLeftX = xImageMax;
				}
				if(this.walkingcount==5){
					this.walkingLeftX-=100;
					this.walkingcount=0;
				}
				else{
					this.walkingcount++;
				}
				context.drawImage(this.sprite_sheet_left.image, this.walkingLeftX, this.walkingLeftY, 100, 100,this.x+this.game.backgroundx*2, this.y, 100,100);
			}
			break;
		case 'explode':
			context.drawImage(this.sprite_sheet_explosion, this.explodex, this.explodey, 64, 64, this.x-this.radius+this.game.backgroundx*2, this.y-this.radius, this.radius*2, this.radius*2);
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
			break;
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
		var x = (this.x-(this.game.backgroundx*2));
		var tileUp = Tilemap.tileAt(x+50, this.y-100,0);
		var tileDown = Tilemap.tileAt(x+25, this.y+75,0);
		var tileDownRight = Tilemap.tileAt(x+50, this.y+75,0);
		var tileLeft =  Tilemap.tileAt(x-15, this.y+50,0);
		var tileRight = Tilemap.tileAt(x+65, this.y+50,0);
		switch(this.state)
		{
			case "walking":
				if(this.facing=='right'){
					if(tileRight === undefined || !tileRight.solid){
						if(this.x < this.xWalkingmax)
						{
							this.x += this.velocity;
						}
						else{
							facing = 'left';
							this.walkingcount = 0;
							this.walkingLeftX = 700;
							this.walkingLeftY=0;
						}
					}
					else{
						facing = 'left';
						this.walkingcount = 0;
						this.walkingLeftX = 700;
						this.walkingLeftY=0;
					}
				}
				if(this.facing=='left'){
					if(tileLeft === undefined || !tileLeft.solid){
						if(this.x >= this.startingX)
						{
							this.x -= this.velocity;
						}
						else{
							facing ='right';
							this.walkingx = 0;
							this.walkingy = 0;
							this.walkingcount = 0;
						}
					}
					else{
						facing ='right';
						this.walkingx = 0;
						this.walkingy = 0;
						this.walkingcount = 0;
					}
				}
			break;
		}		
	}
};