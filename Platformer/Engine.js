// Tilemap engine defined using the Module pattern
// See http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html

var Tilemap = (function (){
  var Portal = function(x,y){
	this.offset= {x: 0, y: 0};
	this.postion= {x:x,y:y};
	}
	Portal.image = new Image();
	Portal.image.src = "tilesets\/portal.gif";
  var Enemy = function(x,y,type){
	this.position = {
		x:x,
		y:y};
	this.enemyType = type;
  }
  var Treasure = function(x,y,type)
  {
	this.position = {
		x:x,
		y:y};
	this.treasureType = type;
  }
  var portals = [];
  var enemies = [];
  var treasures = [];
  var tiles = [],
	  tilesets = [],
      layers = [],
      tileWidth = 0,
      tileHeight = 0,
      mapWidth = 0,
      mapHeight = 0,
      screen,
      screenCtx;
  var load = function(mapData, options) {
      
    var loading = 0;
    
    // Release old tiles & tilesets
    tiles = [];
    tilesets = [];
	layers = [];
	
	// could also do portals.length = 0; Slightly more efficient because splice returns a value, not sure if it matters for this small array though.
	// portals.splice(0, 2);
	// enemies.splice(0,enemies.length);
	portals.length = 0;
	enemies.length = 0;
	treasures.length = 0;
	
    // Resize the map
    tileWidth = mapData.tilewidth;
    tileHeight = mapData.tileheight;
    mapWidth = mapData.width;
    mapHeight = mapData.height;
    // Load the tileset(s)
    mapData.tilesets.forEach( function(tilesetmapData, index) {
      // Load the tileset image
      var tileset = new Image();
      loading++;
      tileset.onload = function() {
        loading--;
        if(loading == 0 && options.onload) options.onload();
      }
      tileset.src = tilesetmapData.image;
      tilesets.push(tileset);
      
      // Create the tileset's tiles
      var colCount = Math.floor(tilesetmapData.imagewidth / tileWidth),
          rowCount = Math.floor(tilesetmapData.imageheight / tileHeight),
          tileCount = colCount * rowCount;
      
      for(i = 0; i < tileCount; i++) {
        var tile = {
          // Reference to the image, shared amongst all tiles in the tileset
          image: tileset,
          // Source x position.  i % colCount == col number (as we remove full rows)
          sx: (i % colCount) * tileWidth,
          // Source y position. i / colWidth (integer division) == row number 
          sy: Math.floor(i / rowCount) * tileHeight,
          // Indicates a solid tile (i.e. solid property is true).  As properties
          // can be left blank, we need to make sure the property exists. 
          // We'll assume any tiles missing the solid property are *not* solid
          solid: (tilesetmapData.tileproperties[i] && tilesetmapData.tileproperties[i].solid == "true") ? true : false,
		  portal:(tilesetmapData.tileproperties[i] && tilesetmapData.tileproperties[i].portal == "true") ? true : false,
		  Enemy: (tilesetmapData.tileproperties[i] && tilesetmapData.tileproperties[i].Enemy == "true") ? true : false,
		  EnemyType: (tilesetmapData.tileproperties[i] && tilesetmapData.tileproperties[i].EnemyType != "0") ? tilesetmapData.tileproperties[i].EnemyType : 0,
		  rotation: (tilesetmapData.tileproperties[i] && tilesetmapData.tileproperties[i].rotation != "0") ? tilesetmapData.tileproperties[i].rotation : 0,
		  Treasure: (tilesetmapData.tileproperties[i] && tilesetmapData.tileproperties[i].treasure == "true") ? true : false,
		  TreasureType: (tilesetmapData.tileproperties[i] && tilesetmapData.tileproperties[i].treasureType != "0") ? tilesetmapData.tileproperties[i].treasureType : 0,
        }
        tiles.push(tile);
		if(tile.portal)
		{
			for(y =0; y<mapHeight; y++)
			{
				for(x=0; x<mapWidth; x++)
				{
					if(mapData.layers[0].data[x+y*mapWidth]==tiles.length)
					{
						portals.push(new Portal(x*tileWidth,y*tileHeight));
					}
				}
			}
		}
		if(tile.Enemy)
		{
			for(y =0; y<mapHeight; y++)
			{
				for(x=0; x<mapWidth; x++)
				{
					if(mapData.layers[0].data[x+y*mapWidth]==tiles.length)
					{
						enemies.push(new Enemy(x*tileWidth,y*tileHeight, tile.EnemyType));
					}
				}
			}
		}
		if(tile.Treasure)
		{
			for(y =0; y<mapHeight; y++)
			{
				for(x=0; x<mapWidth; x++)
				{
					if(mapData.layers[0].data[x+y*mapWidth]==tiles.length)
					{
						var treasure = new Treasure(x*tileWidth,y*tileHeight, tile.TreasureType);
						treasures.push(treasure);
					}
				}
			}
		}
      }
    });
    
    // Parse the layers in the map
    mapData.layers.forEach( function(layerData) {
      
      // Tile layers need to be stored in the engine for later
      // rendering
      if(layerData.type == "tilelayer") {
        // Create a layer object to represent this tile layer
        var layer = {
          name: layerData.name,
          width: layerData.width,
          height: layerData.height,
          visible: layerData.visible
        }
      
        // Set up the layer's data array.  We'll try to optimize
        // by keeping the index data type as small as possible
        if(tiles.length < Math.pow(2,8))
          layer.data = new Uint8Array(layerData.data);
        else if (tiles.length < Math.Pow(2, 16))
          layer.data = new Uint16Array(layerData.data);
        else 
          layer.data = new Uint32Array(layerData.data);
      
        // save the tile layer
        layers.push(layer);
      }
    });
  }
  
  var render = function(screenCtx) {
    // Render tilemap layers - note this assumes
    // layers are sorted back-to-front so foreground
    // layers obscure background ones.
    // see http://en.wikipedia.org/wiki/Painter%27s_algorithm
    layers.forEach(function(layer){
      
      // Only draw layers that are currently visible
      if(layer.visible) { 
        for(x = 0; x < 200; x++) {
          for(y = 0; y < 10; y++) {
            var tileId = layer.data[x + layer.width * y];
            
            // tiles with an id of 0 don't exist
            if(tileId != 0) {
                var tile = tiles[tileId - 1];
				if(tile===undefined){
					console.log(tileId);
				}
				if(tile.image) { // Make sure the image has loaded
					if(tile.portal)
					{
						//screenCtx.drawImage(Portal.image,0,0,102,126,x*tileWidth,y*tileHeight-50,tileWidth*2, tileHeight*2);
					}
					else{
						if(!tile.Enemy && !tile.Treasure)
						{
							screenCtx.drawImage(
							  tile.image,     // The image to draw 
							  tile.sx, tile.sy, tileWidth, tileHeight, // The portion of image to draw
							  x*tileWidth, y*tileHeight, tileWidth, tileHeight // Where to draw the image on-screen
							);
						}
					}
				}			  
            }
            
          }
        }
      }
      
    });
  }
  
  var tileAt = function(x, y, layer) {
  
	x = Math.round(x/tileWidth);
	y = Math.round(y/tileHeight);
	if (layer === undefined)
	{
		layer = 0;
	}
    // sanity check
    if(layer < 0 || x < 0 || y < 0 || layer >= layers.length || x > mapWidth || y > mapHeight) 
      return undefined;  
    return tiles[layers[layer].data[x + y*mapWidth] - 1];
  }
  
  // Expose the module's public API
  return {
    load: load,
    render: render,
    tileAt: tileAt,
	portals : portals,
	enemies : enemies,
	treasures : treasures,
	layers : layers
  }
  
  
})();

function drawGrid(ctx, width, height, GridSize) {
        ctx.strokeStyle = "black";
        var i;
        for (i = 0; i < height; i += GridSize) {
            ctx.lineWidth = 1;
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
        for (i = 0; i < width; i += GridSize) {
            ctx.lineWidth = 1;
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
    }

function calculateEnemyCharacterCollisions(game, enemies)
{
	characterX = game.character.x - game.backgroundx*2;
	characterY = game.character.y;
	characterRadius = game.character.radius;
	enemies.forEach( function(enemy) {
		if(Math.abs(characterX-enemy.x) < 500 && enemy.state != 'explode' && enemy.state != 'dead' && game.character.state != 'dead')
		{
			x = characterX - enemy.x;
			y = characterY - enemy.y;
			d = Math.sqrt(x*x + y*y);
			mindist = characterRadius+enemy.radius;
			if(d<=(mindist*.75))
			{
				enemy.collidedWithCharacter();
                if(enemy.type != 5)
                {
                    this.game.levels[game.level-1].Resource.Sfx.playerHitSound.play();
                }
			}
		}
		
	});
}

function calculateTreasureCharacterCollisions(game, treasures)
{
	characterX = game.character.x - game.backgroundx*2;
	characterY = game.character.y;
	characterRadius = 50;
	var treasureCount = 0;
	treasures.forEach( function(treasure) {
		// if(treasureCount == 0)
		// {
			if(Math.abs(characterX-treasure.x) < 1000)
			{
				// console.log(game.character.x+"-"+game.backgroundx*2+"="+characterX);
				// console.log(Math.abs(characterX-treasure.x));
				// console.log(characterX+"-"+treasure.x+"="+Math.abs(characterX-treasure.x));
			}
			if(Math.abs(characterX-treasure.x) < 500 && treasure.state != 'explode' && treasure.state != 'dead')
			{
				x = characterX - treasure.x;
				y = characterY - treasure.y;
				d = Math.sqrt(x*x + y*y);
				mindist = characterRadius+treasure.radius;
				if(d<=mindist)
				{
                    if(treasure.type == 1)
                    {
                        this.game.levels[game.level-1].Resource.Sfx.greenCrystalSound.play();
                    }
                    else if(treasure.type == 3)
                    {
                        this.game.levels[game.level-1].Resource.Sfx.blueCrystalSound.play();
                    }
					treasure.collidedWithCharacter();
				}
			}
			treasureCount = 0;
		// }
		treasureCount++;
	});
}

function calculateEnemyCharacterBulletCollisions(game,enemies)
{
	game.characterBullets.forEach(function(bullet)
	{
		bulletx = bullet.x - game.backgroundx*2;		
		enemies.forEach( function(enemy) {
			if(Math.abs(bulletx-enemy.x)<500)
			{
				x = bulletx - (enemy.x+enemy.radius);
				y = bullet.y - (enemy.y+enemy.radius);
				d = Math.sqrt(x*x + y*y);
				
				switch(enemy.type)
				{
					case 1:
						if(Math.abs(bulletx - enemy.x) < 5)
						{
							// console.log("Distance: "+d+" Range: "+(enemy.radius+bullet.radius));
							// console.log("First Try - Bullet: "+bulletx+","+(bullet.y+bullet.radius+7)+" Enemy: "+enemy.x+","+(enemy.y+enemy.enemyHead));
							// console.log("Second Try - Bullet: "+bulletx+","+(bullet.y+bullet.radius+8)+" Enemy: "+enemy.x+","+(enemy.y+enemy.enemyHead));
						}
						if(d <= enemy.radius+bullet.radius && ((bullet.y+bullet.radius+7) >= enemy.y+enemy.enemyHead || (bullet.y+bullet.radius+8) >= (enemy.y+enemy.enemyHead)))
						{
							bullet.collided = true;
							if((bullet.y+bullet.radius+7) == enemy.y+enemy.enemyHead)
							{
								enemy.headShotCount = 0;
								enemy.headShot = true;
							}
							else if((bullet.y+bullet.radius+8) == (enemy.y+enemy.enemyHead))
							{
								enemy.headShotCount = 0;
								enemy.headShot = true;
							}
							else{
								enemy.headShot =false;
							}
							enemy.collideWithCharacterBullet(bullet.radius);
						}
					break;
					case 2:
						if(d <= enemy.radius+bullet.radius && ((bullet.y+bullet.radius+7) >= enemy.y+enemy.enemyHead || (bullet.y+bullet.radius+8) >= (enemy.y+enemy.enemyHead)))
						{
							bullet.collided = true;
							enemy.collideWithCharacterBullet(bullet.radius);
						}
					break;
					case 3:
						var mindist = enemy.radius+bullet.radius;
						//console.log(d,mindist);
						if(d <= mindist)
						{
							bullet.collided = true;
							enemy.collideWithCharacterBullet(bullet.radius);
						}
					break;
					case 1000:
						var mindist = enemy.radius*2+bullet.radius;
						//console.log(d,mindist);
						if(d <= mindist)
						{
							bullet.collided = true;
							enemy.collideWithCharacterBullet(bullet.radius);
						}
					break;
					case 1005:
						x = bulletx - (enemy.x+enemy.radius);
						y = bullet.y - (enemy.y-(enemy.radius/2));
						d = Math.sqrt(x*x + y*y);
						var mindist = enemy.radius+bullet.radius;
						console.log(d,mindist);
						if(d <= mindist)
						{
							bullet.collided = true;
							enemy.collideWithCharacterBullet(bullet.radius);
						}
					break;
					case 2000:
						if(d <= enemy.radius+bullet.radius && ((bullet.y+bullet.radius+7) >= enemy.y+enemy.enemyHead || (bullet.y+bullet.radius+8) >= (enemy.y+enemy.enemyHead)))
						{
							bullet.collided = true;
							enemy.collideWithCharacterBullet(bullet.radius);
						}
					break;
				}
			}
		});
	});
}
	
function convertCanvasToImage(canvas) {
	var image = new Image();
	image.src = canvas.toDataURL("image/png");
	return image;
}