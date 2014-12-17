var Type5Enemy = function(game, x, y, image, radius) {
	this.game = game;
	this.type = 5;
	this.x = x;
	this.y = y;
    this.velocity = 1;
	this.sprite_sheet = image;
	this.radius = radius;
	this.visible = true;
	this.tile = Tilemap.tileAt(this.x + 1, this.y);
	this.count = (this.tile.rotation - 1) * 120;
};

Type5Enemy.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
		// Render enemy
		if (this.visible)
		{
			context.drawImage(this.sprite_sheet.image, 0, 50, 50, 50, this.x, this.y, 50, 50);
			if (this.count >= 240) 
			{
				this.visible = false;
				this.count = 0;
				this.tile.solid = false;
			}
		}
		else 
		{
			if (this.count >= 120)
			{
				this.visible = true;
				this.tile.solid = true;
				this.count = 0;
			}
		}
	},
	update: function() {
		this.count++;
	},
	
	collidedWithCharacter: function(){
		
	},
	
	collideWithCharacterBullet: function(radiusOfBullet, pointMultiplier)
	{	

	}
};