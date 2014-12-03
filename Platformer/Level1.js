var Level1 = (function (game){
	this.game = game;
	var Resource = {
		loading: 1,
		Image: {
		   background: new Image(),
		},
		Music: {
			
		},
		Sfx: {
			
		}
	}
	Resource.Image.background.onload = onload;
	Resource.Image.background.src = "background.png";
	function onload(){
		Resource.loading -= 1;
	}
  var background = {
	image: Resource.Image.background,
    offset: {x: 0, y: 0}
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
		Tilemap.render(screenCtx);
		drawGrid(screenCtx, WIDTH, HEIGHT,50);
  }
  
  // Expose the module's public API
  return {
	load : load,
    update: update,
    render: render,
	background : background,
	Resource : Resource
  }
})();

