var Type1Treasure = function(game, x, y, image, type, increment, xImageMax, xcountMax, radius, startingState, value) {
	this.game = game;
	this.type = type;
	this.x = x;
	this.y = y;
	this.state = startingState;
	this.captured = false;
	this.headShot = false;
	this.sprite_sheet = image;
	this.imagex = 0;
	this.increment = increment;
	this.xImageMax = xImageMax;
	this.xcount = 0;
	this.xcountMax = xcountMax
	this.radius = radius;
	this.value = value;
	this.captureCount = 0;
};

Type1Treasure.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {		
		// Render treasure 
		switch(this.state)
		{
			case 'normal':
				if(this.imagex == this.xImageMax)
				{
					this.imagex = 0;
				}
				if(this.xcount==this.xcountMax){
					this.imagex+=this.increment;
					this.xcount=0;
				}
				else{
					this.xcount++;
				}
				context.drawImage(this.sprite_sheet, this.imagex, 0, 100, 100,this.x, this.y, this.radius*2,this.radius*2);
			break;
			case 'captured' :
				context.fillStyle = "lime";
				context.font = "bold 14px Arial";
				context.fillText("+"+this.value, this.x+(this.radius/2),this.y-this.radius-(this.captureCount/6));
				this.captureCount++;
				if(this.captureCount==30)
				{	
					this.state='dead';
				}
			break;
		}
		if(!this.captured)
		{
			
		}
	},
	update: function() {
		
	},	
	collidedWithCharacter: function(){
		this.state='captured';
		this.captured = true;
	}
};