var Missile = function(game,x,y,destinationx,destinationy) {
	this.game = game;
	this.sprite_sheet = new Image();
	this.sprite_sheet.src = "helicopter.png";
	this.sprite_sheet_explosion = new Image();
	this.sprite_sheet_explosion.src = "explosion.png";
	this.x = x;
	this.y = y;
	this.initialx = x;
	this.intitialy = y;
	this.destinationx = destinationx;
	this.destinationy = destinationy;
	this.explodex = 0;
	this.explodey = 0;
	this.firex = 60;
	this.state = 'engage';
	this.stateCount = 0;
	this.smokeClouds = [];
	this.remove = false;
	this.velocity = .5;
	this.radius =2;
	this.tile;
	this.collided =false;
};

Missile.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	xv: 0,
	xy: 0,
	
	render: function(context) {
		context.save();
		console.log("Missile State: "+this.state);
		if(this.state != 'explode')
		{
			context.translate(this.x+8.5, this.y+4);
			context.rotate(this.angle);
			context.translate( -this.x+8.5, -this.y+4);
			context.drawImage(this.sprite_sheet, 75, 56, 17, 8, this.x, this.y, 17, 8);
		}
		if(this.state == 'engage')
		{
			if(this.firex == 60)
			{
				context.drawImage(this.sprite_sheet, this.firex, 56, 7, 8, this.x-8, this.y, 17, 8);
				this.firex -=10;	
			}
			else if(this.firex == 50)
			{
				context.drawImage(this.sprite_sheet, this.firex, 56, 10, 8, this.x-11, this.y, 10, 8);
				this.firex -=10;
			}
			else
			{
				context.drawImage(this.sprite_sheet, this.firex, 56, 8, 8, this.x-9, this.y, 8, 8);
				this.firex = 60;
			}
		}
		else if(this.state == 'explode')
		{
			context.drawImage(this.sprite_sheet_explosion, this.explodex, this.explodey, 64, 64, this.x-250, this.y-250, 500, 500);
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
				this.remove = true;
			}
		}
		context.restore();
	},
	update: function(elapsedTime) 
	{
		switch(this.state)
		{
			case 'engage':
				this.stateCount +=1;
				this.x -= 1;
				this.angle = Math.atan((this.destinationy - this.y) / (this.destinationx - this.x));
				this.x += elapsedTime * this.velocity * Math.cos(this.angle);
				this.y += elapsedTime * this.velocity * Math.sin(this.angle);
				var distance = Math.pow((this.destinationx - this.x),2) + Math.pow((this.destinationy-this.y),2);
				if(distance<=100)
				{
					this.state = 'explode';
				}
				break;
			case 'explode':
				this.x -= 1;
				break;
			default:
				this.x -= 1;
				this.x += elapsedTime * this.velocity * Math.cos(this.angle);
				this.y += elapsedTime * this.velocity * Math.sin(this.angle);
				break;
		}
		this.tile = Tilemap.tileAt(x+this.radius, this.y+this.radius);
		if(this.x>750)
		{
			this.state = 'explode';
		}
	}
}