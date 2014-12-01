var Level1 = (function (game){
	this.game = game;
	var background = {
	image: new Image(),
	offset: {x: 0, y: 0}
	}
	background.image.src = "tilesets\/portal.gif";
	
  function onload(){
    console.log("Loaded", this);
    Resource.loading -= 1;
}
  var load = function(screenCtx)
  {
		var self = this;
	    Tilemap.load(tilemapDataLvl1V2);
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
	background : background
  }
})();

