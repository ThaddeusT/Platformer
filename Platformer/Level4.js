var Level4 = (function (){
	this.game;
	var Resource = {
		loading: 11,
		Image: {
		   background: new Image(),
		   character: new Image(),
		   characterLeft: new Image(),
		   jetpack: new Image(),
		   jetpackLeft: new Image(),
		   portal: new Image(),
		   enemyType1: new Image(),
		   enemyType1Left: new Image(),
		   greenCrystal: new Image(),
		   redCrystal: new Image(),
		   blueCrystal: new Image()
		},
		Music: {
			level_4_music: new Audio(),
            creditMusic: new Audio()
		},
		Sfx: {
			weaponFire: new Audio(),
            chargingFire: new Audio(),
            jumpingSound: new Audio(),
            deathSound: new Audio(),
            enableJetPackSound: new Audio(),
            disableJetPackSound: new Audio(),
            greenCrystalSound: new Audio(),
            blueCrystalSound: new Audio(),
            playerHitSound: new Audio(),
            headShot: new Audio(),
            wingsFlapping: new Audio(),
            barrierUp: new Audio(),
            barrierDown: new Audio()
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
	Resource.Image.greenCrystal.onload = onload;
	Resource.Image.blueCrystal.onload = onload;
	Resource.Image.redCrystal.onload = onload;
	Resource.Image.background.src = "background6.png";
	Resource.Image.character.src = "mainCharacterSpriteSheet100.png";
	Resource.Image.characterLeft.src = "mainCharacterSpriteSheet100Left.png";
	Resource.Image.jetpack.src = "jetpackSpriteSheet100.png";
	Resource.Image.jetpackLeft.src = "jetpackSpriteSheet100Left.png";
	Resource.Image.portal.src = "portalSpriteSheet.png";
	Resource.Image.enemyType1.src ="Robot_Blue1_SpriteSheet.png";
	Resource.Image.enemyType1Left.src ="Robot_Blue1_SpriteSheetLeft.png"
	Resource.Image.greenCrystal.src = "greenCrystalSpriteSheet.png";
	Resource.Image.blueCrystal.src = "blueCrystalSpriteSheet.png";
	Resource.Image.redCrystal.src = "redCrystalSpriteSheet.png";
	
    //Sound Effects
    Resource.Sfx.weaponFire.src = "Sound Effects/Weapon Fire.wav";
    Resource.Sfx.chargingFire.src ="Sound Effects/Chargingup.wav";
    Resource.Sfx.jumpingSound.src ="Sound Effects/Jumping.wav";
    Resource.Sfx.deathSound.src = "Sound Effects/deathh.wav";
    Resource.Sfx.enableJetPackSound.src = "Sound Effects/Power up (jetpack enabled).mp3";
    Resource.Sfx.disableJetPackSound.src = "Sound Effects/Power_Down_jetpack_disabled_.mp3";
    Resource.Sfx.greenCrystalSound.src = "Sound Effects/greenCrystalSound.wav";
    Resource.Sfx.blueCrystalSound.src = "Sound Effects/Blue Powerup.wav";
    Resource.Sfx.playerHitSound.src = "Sound Effects/pain1.wav";
    Resource.Sfx.headShot.src = "Sound Effects/Headshot.wav";
    Resource.Sfx.wingsFlapping.src = "Sound Effects/Wings Fapping.mp3";
    Resource.Sfx.barrierUp.src ="Sound Effects/cogs.mp3";
    Resource.Sfx.barrierDown.src = "Sound Effects/boxopen.mp3";
    
    //Level Music
    Resource.Music.level_4_music.src = "Levelmusic/song21_0.mp3";
    Resource.Music.creditMusic.src = "Levelmusic/Exodus.mp3";
    Resource.Music.creditMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
	Resource.Music.level_4_music.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    
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
  var enemies = []
  var treasures = []
  
  var setBackground = function(image){
	Resource.Image.background = image;
  }
  
  var load = function(screenCtx)
  {
		var self = this;
	    Tilemap.load(tilemapDataLvl4, {
			onload: function() {
			  // Tilemap.render(screenCtx);
			  console.log('Tilemap Loaded');
			}
		  });
          Resource.Music.level_4_music.play();
  }
  
   var playLevelMusic = function() {
    Resource.Music.level_4_music.play();
  }
  
  var stopLevelMusic = function() {
    Resource.Music.level_4_music.currentTime =0;
    Resource.Music.level_4_music.pause();
  }
  
  var createEnemies = function(cenemies){
		enemies = [];
		cenemies.forEach( function(enemy) {
			switch(enemy.enemyType)
			{
				case "1":
					var newEnemy = new Type1Enemy(this.game, enemy.position.x, enemy.position.y,enemyType1, enemyType1Left,30,700,400,5,50,"walking",50,10,250);
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
		calculateTreasureCharacterCollisions(this.game, treasures);
		calculateEnemyCharacterCollisions(this.game, enemies);
		calculateEnemyCharacterBulletCollisions(this.game,enemies);
		enemies.forEach( function(enemy) {
			if(enemy.state=="dead")
			{
				this.game.score += enemy.value;
				enemies.splice($.inArray(enemy, enemies),1);
			}
			enemy.update();
		});
		treasures.forEach( function(treasure) {
			if(treasure.state=="dead")
			{
				this.game.score += treasure.value;
				switch(treasure.type)
				{
					case 1:
						this.game.character.updateHealth(25);
					break;
					case 2:
						this.game.jetPackPowerCollected =true;
						this.game.character.enableJetPack();
					break;
					case 3:
						this.game.character.setRespawnPoint(this.game.character.x,this.game.character.y, this.game.backgroundx);
					break;
				}
				
				treasures.splice($.inArray(treasure, treasures),1);
			}
			treasure.update();
		});
		
  }

  var render = function(screenCtx) {
		if(!game.gameresetting)
		{
			renderPortals(screenCtx);
			renderEnemies(screenCtx);
			renderTreasures(screenCtx);
		}
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
  
  var renderTreasures =  function(screenCtx){
	treasures.forEach( function(treasure) {
		treasure.render(screenCtx);
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
	portal : portal,
	enemyType1 : enemyType1,
	enemies : enemies,
	createEnemies : createEnemies,
	createTreasures : createTreasures,
    stopLevelMusic : stopLevelMusic,
    playLevelMusic : playLevelMusic
  }
})();