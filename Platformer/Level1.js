var Level1 = (function (){
	this.game;
	var Resource = {
		loading: 4,
		Image: {
		   background: new Image(),
		   character: new Image(),
		   characterLeft: new Image(),
		   portal: new Image()
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
  var setBackground = function(image){
	Resource.Image.background = image;
  }
  
  var load = function(screenCtx)
  {
		var self = this;
	    Tilemap.load(tilemapDataLvl1V2, {
			onload: function() {
			  // Tilemap.render(screenCtx);
			  console.log('Tilemap Loaded');
			}
		  });
  }

  var update = function(elapsedTime){
  
  }

  var render = function(screenCtx) {

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
	portal:portal
  }
})();

