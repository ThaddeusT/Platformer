var Type1Enemy = function(game, x, y, image,imageLeft, xmax, xcount,radius, startingState) {
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
	this.sx = sx;
	this.sy = sy;
	this.iw = iw;
	this.ih = ih;
	this.walkingx = 0;
	this.walkingcount = 0;
	this.walkingLeftX = 700;
	this.walkingLeftY=0;
	this.xmax = xmax;
	this.xincrease = xincrease;
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
		 case 'normal':
			if(this.facing == right)
			{
				if(this.walkingx == this.xmax)
				{
					this.walkingx = 0;
				}
				if(this.walkingcount==xcount){
					this.walkingx+=100;
					this.walkingcount=0;
				}
				else{
					this.walkingcount++;
				}
				context.drawImage(this.sprite_sheet, this.walkingx, this.walkingy, 100, 100,this.x, this.y, 100,100);
			}
			else{
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
			}
			break;
		case 'explode':
			context.drawImage(this.sprite_sheet_explosion, this.explodex, this.explodey, 64, 64, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
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
				this.state = 'normal';
			}
			break;
	},
	update: function(elapsedTime, inputState) {
		switch(this.state)
		{
		}
	},
	
	getAngle: function(inputState) {
		if(inputState.x >this.x)
		{
			var angle = Math.atan((inputState.y - this.y) / (inputState.x - this.x));
			if(angle >= -0.19)
			{
				this.turret_angle = angle;
			}
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
			case: "walking":
				if(facing=='right'){
					if(tileRight === undefined || !tileRight.solid){
						this.x += this.velocity;
					}
					else{
						facing = 'left';
					}
				}
				if(facing=='left'){
					if(tileLeft === undefined || !tileLeft.solid){
						this.x -= this.velocity;
					}
					else{
						facing ='right';
					}
				}
			break;
		}		
	}
};