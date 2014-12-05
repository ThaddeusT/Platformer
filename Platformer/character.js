
// Helicopter class
//----------------------------------
var Character = function(game, x, y, image) {
	this.game = game;
	this.x = x;
	this.y = y;
	this.velocity = 1;
	this.health = 100;
	this.state = "normal";
	this.weaponState = "rest";
	this.sprite_sheet = image;
	this.walkingx = 0;
	this.walkingy = 0;
	this.walkingcount =0;
};

Character.prototype = {
	x: 0,
	y: 0,
	velocity: 0,
	
	render: function(context) {
	switch(this.state){
		case "normal":
			context.drawImage(this.sprite_sheet, 0, 100, 100, 100,this.x, this.y, 100,100);
		break;
		case "walking":
			if(this.walkingx == 700)
			{
				this.walkingx = 0;
			}
			if(this.walkingcount==5){
				this.walkingx+=100;
				this.walkingcount=0;
			}
			else{
				this.walkingcount++;
			}
			context.drawImage(this.sprite_sheet, this.walkingx, this.walkingy, 100, 100,this.x, this.y, 100,100);
		break;
	}
		
		// // Render helicopter with pitch angle, missiles, and targeted turret
		// context.save();
		// context.translate(this.x, this.y);
		// context.rotate(this.pitch_angle);
		// context.translate(-65, -4);
		// context.save();
		// context.translate(90, 35);
		// context.rotate(this.turret_angle);
		// context.drawImage(this.sprite_sheet, 100, 56, 25, 8, -5, 0, 25, 8);
		// context.restore();
		// context.drawImage(this.sprite_sheet, 0, 0, 131, 52, 0, 0, 131, 52);
		// context.translate(56, 35);
		// for(i = 0; i < this.missiles; i++) {
			// context.translate(2,2);
		  // context.drawImage(this.sprite_sheet, 75, 56, 17, 8, 0, 0, 17, 8);
		// }
		// context.restore();
	},
	
	update: function(elapsedTime, inputState) {
	
		// // Move the helicopter
		this.move(inputState);	
		
		// // Aim the turrent
		// this.aim(inputState);
	},
	
	fireBullet: function(x, y) {
		var bullet = new Bullet(
			this.game,
			this.x + 42*Math.cos(1.0+this.pitch_angle) + 20*Math.cos(this.turret_angle),
			this.y + 42*Math.sin(1.0+this.pitch_angle) + 20*Math.sin(this.turret_angle),
			8*Math.cos(this.turret_angle), 
			8*Math.sin(this.turret_angle)
		);
		this.game.bullets.push(bullet);
	},
	
	fireMissile: function(x, y) {
		if(this.missiles > 0) {
			var missile = new Missile(
				this.game, 
				this.sprite_sheet, 
				this.x, 
				this.y+35, 
				x, 
				y
			);
			this.game.missiles.push(missile);
			this.missiles -= 1;
		}
	},
	
	move: function(inputState) {
		if(inputState.up) {
			this.y -= this.velocity * 2;
		} else if(inputState.down) {
			
			if(this.y+100<HEIGHT){
				if(!Tilemap.tileAt(this.x+50, this.y+100,0).solid){
					this.y += this.velocity * 5;
				}
			}
		}
		if(inputState.left) {
			this.pitch_angle = -Math.PI/10;
			this.x -= this.velocity * 2;
		} else if(inputState.right) {
			this.state="walking";
			console.log(Tilemap.tileAt(this.x+100, this.y+50));
			if(!Tilemap.tileAt(this.x+100, this.y+50).solid){
				this.x += this.velocity;
			}
		} else {
			this.pitch_angle = 0;
			this.state ="normal";
		}
	},
	
	aim: function(inputState) {
		var x, y, angle;
		x = inputState.worldX - this.x + 10;
		y = inputState.worldY - this.y + 35;
		angle = Math.atan2(y, x);
		this.turret_angle = Math.min(Math.PI/2, Math.max(-Math.PI/8, angle));
	},
	
	bounds: function() {
		return {
			top: this.x - 64,
			left: this.y,
			bottom: this.y + 50,
			right: this.x + 67
		};
	}
};