// Bullet class
//----------------------------------
var Bullet = function(game,x,y,radius, image, facing) {
	this.game = game;
	this.sprite_sheet = image;
	this.x = x;
	this.y = y;
	if(facing == "right")
	{
		this.velocity = .5;
	}
	else{
		this.velocity = -.5;
	}
	this.radius =radius;
	this.bulletx=300;
	this.bulletcount=0;
	this.tile;
	this.collided =false;
};

Bullet.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		if(this.bulletx == 375)
		{
			this.bulletx = 300;
		}
		if(this.bulletcount==5)
		{
			this.bulletx +=25;
			this.bulletcount=0;
		}
		this.bulletcount++;
		context.drawImage(this.sprite_sheet, this.bulletx, 125, 25, 25,this.x, this.y, (this.radius*2),(this.radius*2));
	},
	update: function(elapsedTime) 
	{
		this.x += elapsedTime * this.velocity;
		var x = (this.x-(this.game.backgroundx*2))-25;
		this.tile = Tilemap.tileAt(x+this.radius, this.y+this.radius);
	}
}