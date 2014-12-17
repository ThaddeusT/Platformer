var Level2 = (function (){
	this.game;
	var Resource = {
		loading: 8,
		Image: {
		   background: new Image(),
		   character: new Image(),
		   characterLeft: new Image(),
		   jetpack: new Image(),
		   jetpackLeft: new Image(),
		   portal: new Image(),
		   enemyType1: new Image(),
		   enemyType1Left: new Image(),
		   enemyType2: new Image(),
		   enemyType5: new Image()
		},
		Music: {
			
		},
		Sfx: {
			
		}
	}
	Resource.Image.background.onload = onload;
	Resource.Image.character.onload = onload;
	Resource.Image.characterLeft.onload = onload;
	Resource.Image.jetpack.onload = onload;
	Resource.Image.jetpackLeft.onload = onload;
	Resource.Image.portal.onload = onload;
	Resource.Image.enemyType1.onload = onload;
	Resource.Image.enemyType1Left.onload = onload;
	Resource.Image.enemyType2.onload = onload;
	Resource.Image.enemyType5.onload = onload;
	Resource.Image.background.src = "background.png";
	Resource.Image.character.src = "mainCharacterSpriteSheet100.png";
	Resource.Image.characterLeft.src = "mainCharacterSpriteSheet100Left.png";
	Resource.Image.jetpack.src = "jetpackSpriteSheet100.png";
	Resource.Image.jetpackLeft.src = "jetpackSpriteSheet100Left.png";
	Resource.Image.portal.src = "portalSpriteSheet.png";
	Resource.Image.enemyType1.src ="Robot_Blue1_SpriteSheet.png";
	Resource.Image.enemyType1Left.src ="Robot_Blue1_SpriteSheetLeft.png";
	Resource.Image.enemyType2.src = "BatSpriteSheet.png";
	Resource.Image.enemyType5.src = "tilesets/baseTileSet.png";
	
	function onload(){
		Resource.loading -= 1;
	}
	
  var setGame = function(game)
	{
		this.game = game;
	}	  
  var background = {
	image: Resource.Image.background,
    offset: {x: 0, y: 0},
	size: {x:3500,y:480}
  }
  var character = {
	image: Resource.Image.character
  }
  var characterLeft ={
	image: Resource.Image.characterLeft
  }
  var jetpack ={
	image: Resource.Image.jetpack
  }
  var jetpackLeft = {
	image: Resource.Image.jetpackLeft
  }
  var portal ={
	image: Resource.Image.portal,
	portalx: 0,
	portalCount:0,
	portalRadius: 0
  }
  var enemyType1 ={
	image: Resource.Image.enemyType1
  }
  var enemyType1Left = {
	image: Resource.Image.enemyType1Left
  }
  var enemyType2 = {
	image: Resource.Image.enemyType2
  }
  var enemyType5 = {
	image: Resource.Image.enemyType5
  }
  var enemies = []
  
  var setBackground = function(image){
	Resource.Image.background = image;
  }
  
  var load = function(screenCtx)
  {
		var self = this;
	    Tilemap.load(tilemapDataLvl2V4, {
			onload: function() {
			  // Tilemap.render(screenCtx);
			  console.log('Tilemap Loaded');
			  console.log(Tilemap.layers);
			}
		  });
  }
  
  var createEnemies = function(cenemies){
		enemies = [];
		cenemies.forEach( function(enemy) {
			switch(enemy.enemyType)
			{
				case "1":
					var newEnemy = new Type1Enemy(this.game, enemy.position.x, enemy.position.y,enemyType1, enemyType1Left,30,700,400,5,50,"walking",50,10);
					enemies.push(newEnemy);
				break;
				case "2":
					var newEnemy = new Type2Enemy(this.game, enemy.position.x, enemy.position.y, enemyType2, 700, 5, 50, "idle", 25, 15);
					console.log(enemyType2);
					enemies.push(newEnemy);
				break;
				case "5":
					var newEnemy = new Type5Enemy(this.game, enemy.position.x, enemy.position.y, enemyType5, 50);
					enemies.push(newEnemy);
				break;
			}
		});
  }
  
  var createTreasures = function(ctreasures){
		treasures = [];
		ctreasures.forEach( function(treasure) {
			switch(treasure.treasureType)
			{
				case "1":
					var newTreasure = new Type1Treasure(this.game, treasure.position.x, treasure.position.y, Resource.Image.greenCrystal, 1, 100, 700, 5, 25, 'normal', 2500);
					treasures.push(newTreasure);
				break;
				case "2":
					var newTreasure = new Type1Treasure(this.game, treasure.position.x, treasure.position.y, Resource.Image.redCrystal, 2, 100, 700, 5, 25, 'normal', 2500);
					treasures.push(newTreasure);
				break;
				case "3":
					var newTreasure = new Type1Treasure(this.game, treasure.position.x, treasure.position.y, Resource.Image.blueCrystal, 3, 100, 700, 5, 25, 'normal', 2500);
					treasures.push(newTreasure);
				break;
			}
		});
  }

  var update = function(elapsedTime){
		calculateEnemyCharacterCollisions(this.game, enemies);
		calculateEnemyCharacterBulletCollisions(this.game,enemies);
		enemies.forEach( function(enemy) {
			if(enemy.state=="dead")
			{
				this.game.score += enemy.maxHealth;
				enemies.splice($.inArray(enemy, enemies),1);
			}
			enemy.update();
		});
  }

  var render = function(screenCtx) {
		renderPortals(screenCtx);
		renderEnemies(screenCtx);
  }
  
  var renderPortals = function(screenCtx)
  {
			//Render Portals
			if(portal.portalx == 3162)
			{
				portal.portalx = 0;
			}
			if(game.levels[game.level-1].portal.portalCount==5)
			{
				portal.portalx +=102;
				portal.portalCount=0;
			}
			portal.portalCount++;
			if(!game.renderCharacter && portal.portalRadius <=100)
			{
				screenCtx.drawImage(portal.image,portal.portalx,0,102,126,Tilemap.portals[1].postion.x,Tilemap.portals[1].postion.y-50,portal.portalRadius,portal.portalRadius);
				if(!game.renderCharacter){
					portal.portalRadius+=2;
				}
			}
			else{
				game.renderCharacter = true;
				screenCtx.drawImage(portal.image,portal.portalx,0,102,126,Tilemap.portals[1].postion.x,Tilemap.portals[1].postion.y-50,portal.portalRadius,portal.portalRadius);
				if(game.levels[game.level-1].portal.portalRadius >0)
				{
					game.levels[game.level-1].portal.portalRadius-=2;
				}
			}
			
			screenCtx.drawImage(portal.image,portal.portalx,0,102,126,Tilemap.portals[0].postion.x,Tilemap.portals[0].postion.y-50,100,100);
  }
  
  var renderEnemies = function(screenCtx){
		    enemies.forEach( function(enemy) {
				enemy.render(screenCtx);
			});
  }
  
  
  // Expose the module's public API
  return {
	setBackground : setBackground,
	setGame : setGame,
	load : load,
    update: update,
    render: render,
	background : background,
	Resource : Resource,
	character : character,
	characterLeft : characterLeft,
	jetpack : jetpack,
	jetpackLeft: jetpackLeft,
	portal:portal,
	enemyType1: enemyType1,
	enemies: enemies,
	createEnemies: createEnemies,
	createTreasures : createTreasures
  }
})();