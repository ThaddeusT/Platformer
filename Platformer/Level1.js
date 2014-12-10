var Level1 = (function (){
	this.game;
	var Resource = {
		loading: 4,
		Image: {
		   background: new Image(),
		   character: new Image(),
		   characterLeft: new Image(),
		   portal: new Image(),
		   enemyType1: new Image()
		},
		Music: {
			
		},
		Sfx: {
			
		}
	}
	Resource.Image.background.onload = onload;
	Resource.Image.character.onload = onload;
	Resource.Image.characterLeft.onload = onload;
	Resource.Image.portal.onload = onload;
	Resource.Image.background.src = "background.png";
	Resource.Image.character.src = "mainCharacterSpriteSheet100.png";
	Resource.Image.characterLeft.src = "mainCharacterSpriteSheet100Left.png";
	Resource.Image.portal.src = "portalSpriteSheet.png";
	Resource.Image.enemyType1.src ="Robot_Blue1.png";
	
	function onload(){
		Resource.loading -= 1;
	}
	
  var setGame = function(game)
	{
		this.game = game;
	}	  
  var background = {
	image: Resource.Image.background,
    offset: {x: 0, y: 0}
  }
  var character = {
	image: Resource.Image.character
  }
  var characterLeft ={
	image: Resource.Image.characterLeft
  }
  var portal ={
	image: Resource.Image.portal,
	portalx: 0,
	portalCount:0,
	portalRadius: 0
  }
  var enemyType1 ={
	image: Resource.Image.portal
  }
  var enemies = []
  var setBackground = function(image){
	Resource.Image.background = image;
  }
  
  var load = function(screenCtx)
  {
		var self = this;
	    Tilemap.load(tilemapDataLvl1V3, {
			onload: function() {
			  // Tilemap.render(screenCtx);
			  console.log('Tilemap Loaded');
			}
		  });
  }
  
  var createEnemies = function(cenemies){
		cenemies.forEach( function(enemy) {
			console.log(enemy.enemyType);
			switch(enemy.enemyType)
			{
				case "1":
					console.log("Enemy would be created at: "+enemy.position.x+","+enemy.position.y);
				break;
			}
		});
  }

  var update = function(elapsedTime){
  
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
				screenCtx.drawImage(portal.image,portal.portalx,0,102,126,Tilemap.portals[1].postion.x+game.backgroundx,Tilemap.portals[1].postion.y-50,portal.portalRadius,portal.portalRadius);
				if(!game.renderCharacter){
					portal.portalRadius+=2;
				}
			}
			else{
				game.renderCharacter = true;
				screenCtx.drawImage(portal.image,portal.portalx,0,102,126,Tilemap.portals[1].postion.x+game.backgroundx,Tilemap.portals[1].postion.y-50,portal.portalRadius,portal.portalRadius);
				if(game.levels[game.level-1].portal.portalRadius >0)
				{
					game.levels[game.level-1].portal.portalRadius-=2;
				}
			}
			
			screenCtx.drawImage(portal.image,portal.portalx,0,102,126,Tilemap.portals[0].postion.x+game.backgroundx*2,Tilemap.portals[0].postion.y-50,100,100);
  }
  
  var renderEnemies = function(screenCtx){
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
	portal:portal,
	enemyType1: enemyType1,
	enemies: enemies,
	createEnemies: createEnemies
  }
})();

