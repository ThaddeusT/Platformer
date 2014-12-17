// Bullet class
//----------------------------------
var Bullet = function(game, x, y, radius, image, bulletx, bullety, sourcex, sourcey, increment, xImageMax, facing, characterBullet, angle, damage) {
	this.game = game;
	this.sprite_sheet = image;
	this.x = x;
	this.initialx = x;
	this.y = y;
	this.sx = sourcex;
	this.sy = sourcey;
	this.angle = angle;
	this.facing = facing;
	this.damage = damage;
	this.increment = increment;
	if (characterBullet)
	{
		if(facing == "right")
		{
			this.velocity = .5;
			this.vx = .5;
			this.vy = 0;
		}
		else{
			this.velocity = -.5;
			this.vx = -.5;
			this.vy = 0;
		}
	}
	else 
	{
		this.velocity = 1;
		this.vx = Math.cos(angle) / 3;
		this.vy = Math.sin(angle) / 3;
	}
	this.radius =radius;
	this.bulletx = bulletx;
	this.bullety = bullety;
	this.bulletxInitial = bulletx;
	this.bulletcount=0;
	this.xImageMax = xImageMax;
	this.tile;
	this.collided =false;
};

Bullet.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	xv: 0,
	xy: 0,
	
	render: function(context) {
		if(this.bulletx == this.xImageMax)
		{
			this.bulletx = this.bulletxInitial;
		}
		if(this.bulletcount==5)
		{
			this.bulletx +=this.increment;
			this.bulletcount=0;
		}
		this.bulletcount++;
		context.drawImage(this.sprite_sheet, this.bulletx, this.bullety, this.sx, this.sy, this.x, this.y, (this.radius*2),(this.radius*2));
	},
	update: function(elapsedTime) 
	{
		this.x += elapsedTime * this.vx;
		this.y -= elapsedTime * this.vy;
		var x = (this.x-(this.game.backgroundx*2))-25;
		this.tile = Tilemap.tileAt(x+this.radius, this.y+this.radius);
	}
}