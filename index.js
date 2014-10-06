(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = {
	"images": {
		//"bg": "img/bg.png"
	},
	"sounds": {
		"music": "audio/Scott_Joplin_-_Ragtime_Dance.mp3"
	},
	"fonts": {},
	"animations": {
		"player": {
			"strip": "img/player.png",
			"frames": 1,
			"msPerFrame": 200
		},
		"player-walk-down": {
			"strip": "img/player-walk-down.png",
			"frames": 2,
			"msPerFrame": 400
		},
		"player-walk-left": {
			"strip": "img/player-walk-left.png",
			"frames": 2,
			"msPerFrame": 400
		},
		"player-walk-right": {
			"strip": "img/player-walk-right.png",
			"frames": 2,
			"msPerFrame": 400
		},
		"theher": {
			"strip": "img/theher.png",
			"frames": 1,
			"msPerFrame": 200
		}
	}
};

//colors
var green = "#B7CBBF";
var coral = "#F4BFAD";
var brown = "#8C886F";

var bounds = {
	top: 0,
	left: 0,
	right: canvas.width,
	bottom: canvas.height
};



var playerYSpeed = 1.2;
var playerXSpeed = playerYSpeed;
var playerMoving = false;

//var theHerYSpeed = 3.2;
//var theHerXSpeed = 3.2;
//var theHerMoving = false;

var game = new Splat.Game(canvas, manifest);

function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) | 0;
	var y = offsetY | 0;
	context.fillText(text, x, y);
}

// x, y, width, height
var floorObsticles = [
	new Splat.Entity(568, 0, 20, canvas.height)
];

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// initialization
	this.timers.expire = new Splat.Timer(undefined, 3000, function() {
		game.scenes.switchTo("game");
	});
	this.timers.expire.start();
}, function() {
	// simulation
}, function(context) {
	// draw
	context.fillStyle = brown;
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#fff";
	context.font = "25px helvetica";
	centerText(context, "disconnect", 0, 200);
}));


game.scenes.add("game", new Splat.Scene(canvas, function() {
		// initialization
		game.sounds.play("music");
		//player
		this.playerIdle = game.animations.get("player");
		this.playerWalkDown = game.animations.get("player-walk-down");
		this.playerWalkLeft = game.animations.get("player-walk-left");
		this.playerWalkRight = game.animations.get("player-walk-right");
		this.player = new Splat.AnimatedEntity(10, 10, this.playerIdle.width, this.playerIdle.height, this.playerIdle, 0, 0);
		this.player.state = "ice";

		//theher
		this.theHerIdle = game.animations.get("theher");
		this.theHer = new Splat.AnimatedEntity(863, 293, this.theHerIdle.width, this.theHerIdle.height, this.theHerIdle, 0, 0);



	}, function(elapsedMillis) {
		// simulation

		//Player
		this.playerWalkDown.move(elapsedMillis);
		this.playerWalkLeft.move(elapsedMillis);
		this.playerWalkRight.move(elapsedMillis);
		if (game.keyboard.isPressed("left") || game.keyboard.isPressed("a")) {
			this.player.vx = -playerXSpeed;
			this.player.vy = 0;
			playerMoving = true;
			this.player.facing = "left";
		} else if (game.keyboard.isPressed("right") || game.keyboard.isPressed("d")) {
			this.player.vx = playerXSpeed;
			this.player.vy = 0;
			playerMoving = true;
			this.player.facing = "right";
		} else if (game.keyboard.isPressed("up") || game.keyboard.isPressed("w")) {
			this.player.vy = -playerYSpeed;
			this.player.vx = 0;
			playerMoving = true;
			this.player.facing = "up";
		} else if (game.keyboard.isPressed("down") || game.keyboard.isPressed("s")) {
			this.player.vy = playerYSpeed;
			this.player.vx = 0;
			playerMoving = true;
			this.player.facing = "down";
		} else {
			playerMoving = false;
		}

		if (playerMoving) {
			if (this.player.facing === "left") {
				this.player.sprite = this.playerWalkLeft;
			} else if (this.player.facing === "right") {
				this.player.sprite = this.playerWalkRight;
			} else {
				this.player.sprite = this.playerWalkDown;
			}

			this.player.x += this.player.vx;
			this.player.y += this.player.vy;
		} else {
			this.player.sprite = this.playerIdle;
		}

		// Bounds checking for player
		if (this.player.x < bounds.left) {
			this.player.x = bounds.left;
		}
		if (this.player.x + this.player.width > bounds.right) {
			this.player.x = bounds.right - this.player.width;
		}
		if (this.player.y < bounds.top) {
			this.player.y = bounds.top;
		}
		if (this.player.y + this.player.height > bounds.bottom) {
			this.player.y = bounds.bottom - this.player.height;
		}

		// player obsticle check
		for (var i = 0; i < floorObsticles.length; i++) {
			var playerLeft = this.player.x;
			var playerRight = this.player.x + this.player.width;
			if (this.player.collides(floorObsticles[i])) {
				if (playerRight > floorObsticles[i].x) {
					this.player.x = this.player.x - 5;
				}
				if (playerLeft > (floorObsticles[i].X + floorObsticles[i].width)) {
					this.player.x = (this.player.x + this.player.width) - 5;
				}

			}
		}

		//theher
		game.animations.get("theher").move();


	},
	function(context) {
		// draw
		context.fillStyle = green;
		context.fillRect(0, 0, canvas.width / 2, canvas.height);
		context.fillStyle = coral;
		context.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);

		this.theHer.draw(context);
		this.player.draw(context);

		// context.strokeStyle = "white";
		// for (var i = 0; i < floorObsticles.length; i++) {
		// 	context.strokeRect(floorObsticles[i].x, floorObsticles[i].y, floorObsticles[i].width, floorObsticles[i].height);
		// }


	}));

game.scenes.switchTo("loading");
},{"splatjs":21}],2:[function(require,module,exports){
"use strict";

/**
 * Holds the current orientation of the device if the device has an accelerometer. An instance of Accelerometer is available as {@link Splat.Game#accelerometer}.
 * @constructor
 */
function Accelerometer() {
	/**
	 * The angle of the device rotated around the z-axis. The z-axis is the axis coming out of the device screen. alpha represents how much the devies is spun around the center of the screen.
	 * @member {number}
	 */
	this.alpha = 0;
	/**
	 * The angle of the device rotated around the x-axis. The x-axis is horizontal across the device screen. beta represents how much the device is tilted forward or backward.
	 * @member {number}
	 */
	this.beta = 0;
	/**
	 * The angle of the device rotated around the y-axis. The y-axis is vertical across the device screen. gamma represents how much the device is turned left or right.
	 * @member {number}
	 */
	this.gamma = 0;

	var self = this;
	window.addEventListener("deviceorientation", function(event) {
		self.alpha = event.alpha;
		self.beta = event.beta;
		self.gamma = event.gamma;
	}, false);
}

module.exports = Accelerometer;

},{}],3:[function(require,module,exports){
"use strict";
/**
 * @namespace Splat.ads
 */

var platform = require("./platform");

if (platform.isEjecta()) {
	var adBanner = new window.Ejecta.AdBanner();

	var isLandscape = window.innerWidth > window.innerHeight;

	var sizes = {
		"iPhone": {
			"portrait": {
				"width": 320,
				"height": 50
			},
			"landscape": {
				"width": 480,
				"height": 32
			}
		},
		"iPad": {
			"portrait": {
				"width": 768,
				"height": 66
			},
			"landscape": {
				"width": 1024,
				"height": 66
			}
		}
	};

	var device = window.navigator.userAgent.indexOf("iPad") >= 0 ? "iPad" : "iPhone";
	var size = sizes[device][isLandscape ? "landscape" : "portrait"];

	module.exports = {
		/**
		 * Show an advertisement.
		 * @alias Splat.ads.show
		 * @param {boolean} isAtBottom true if the ad should be shown at the bottom of the screen. false if it should be shown at the top.
		 */
		"show": function(isAtBottom) {
			adBanner.isAtBottom = isAtBottom;
			adBanner.show();
		},
		/**
		 * Hide the current advertisement.
		 * @alias Splat.ads.hide
		 */
		"hide": function() {
			adBanner.hide();
		},
		/**
		 * The width of the ad that will show.
		 * @alias Splat.ads#width
		 */
		"width": size.width,
		/**
		 * The height of the ad that will show.
		 * @alias Splat.ads#height
		 */
		"height": size.height
	};
} else {
	module.exports = {
		"show": function() {},
		"hide": function() {},
		"width": 0,
		"height": 0,
	};
}

},{"./platform":27}],4:[function(require,module,exports){
"use strict";

var Entity = require("./entity");

/**
 * An upgraded {@link Splat.Entity} that knows how to draw and advance an {@link Animation}.
 * @constructor
 * @augments Splat.Entity
 * @alias Splat.AnimatedEntity
 * @param {number} x The top-left x coordinate. See {@link Splat.Entity#x}
 * @param {number} y The top-left y coordinate. See {@link Splat.Entity#y}
 * @param {number} width The width on the x-axis. See {@link Splat.Entity#width}
 * @param {number} height The height on the y-axis. See {@link Splat.Entity#height}
 * @param {Animation|external:image} sprite The Animation or image to draw
 * @param {number} spriteOffsetX How much to offset {@link Splat.AnimatedEntity#sprite} from the {@link Splat.Entity#x} when drawing
 * @param {number} spriteOffsetY How much to offset {@link Splat.AnimatedEntity#sprite} from the {@link Splat.Entity#y} when drawing
 */
function AnimatedEntity(x, y, width, height, sprite, spriteOffsetX, spriteOffsetY) {
	/**
	 * The Animation or image to draw
	 * @member {Animation|external:image}
	 */
	this.sprite = sprite;
	/**
	 * How much to offset {@link Splat.AnimatedEntity#sprite} from {@link Splat.Entity#x} when drawing.
	 * @member {number}
	 */
	this.spriteOffsetX = spriteOffsetX;
	/**
	 * How much to offset {@link Splat.AnimatedEntity#sprite} from {@link Splat.Entity#y} when drawing.
	 * @member {number}
	 */
	this.spriteOffsetY = spriteOffsetY;
	Entity.call(this, x, y, width, height);
}
AnimatedEntity.prototype = Object.create(Entity.prototype);
/**
 * Simulate movement since the last frame, changing {@link Splat.Entity#x}, {@link Splat.Entity#y}, and calling {@link Animation#move} if applicable.
 * @param {number} elapsedMillis The number of milliseconds since the last frame.
 */
AnimatedEntity.prototype.move = function(elapsedMillis) {
	Entity.prototype.move.call(this, elapsedMillis);
	if (typeof this.sprite.move === "function") {
		this.sprite.move(elapsedMillis);
	}
};
/**
 * Draw the {@link Splat.AnimatedEntity#sprite}.
 * @param {external:CanvasRenderingContext2D} context The drawing context.
 */
AnimatedEntity.prototype.draw = function(context) {
	if (typeof this.sprite.draw === "function") {
		this.sprite.draw(context, this.x + this.spriteOffsetX, this.y + this.spriteOffsetY);
	} else {
		context.drawImage(this.sprite, this.x + this.spriteOffsetX, this.y + this.spriteOffsetY);
	}
	// draw bounding boxes
	// context.strokeStyle = "#ff0000";
	// context.strokeRect(this.x, this.y, this.width, this.height);
};
/**
 * Make a copy of this AnimatedEntity. The {@link Splat.AnimatedEntity#sprite} is not copied, so both entities will share it.
 * @returns {Splat.AnimatedEntity}
 */
AnimatedEntity.prototype.copy = function() {
	return new AnimatedEntity(this.x, this.y, this.width, this.height, this.sprite, this.spriteOffsetX, this.spriteOffsetY);
};

module.exports = AnimatedEntity;

},{"./entity":12}],5:[function(require,module,exports){
"use strict";

var buffer = require("./buffer");

/**
 * An animated picture made of multiple images. Animations are constructed for you by {@link AnimationLoader}.
 * @constructor
 */
function Animation() {
	/**
	 * The individual frames making up the Animation.
	 * @member {Array}
	 * @private
	 */
	this.frames = [];
	/**
	 * The currently displayed frame of the Animation.
	 * @member {number}
	 */
	this.frame = 0;
	/**
	 * How long, in milliseconds, the current frame has been displayed for.
	 * @member {number}
	 * @private
	 */
	this.elapsedMillis = 0;
	/**
	 * The frame at which to restart the Animation after the last frame plays. It defaults to 0, so animations loop. If you want to disable looping, set this to the last frame. Otherwise, you can set it to one of the middle frames to have non-repeating introductory frames, while having looping later frames.
	 * @member {number}
	 */
	this.repeatAt = 0;
	/**
	 * The width of the first frame of the Animation.
	 * @member {number}
	 * @readonly
	 */
	this.width = 0;
	/**
	 * The height of the first frame of the Animation.
	 * @member {number}
	 * @readonly
	 */
	this.height = 0;
}
/**
 * Make a copy of this Animation.
 * @returns {Animation}
 */
Animation.prototype.copy = function() {
	var anim = new Animation();
	anim.frames = this.frames;
	anim.frame = this.frame;
	anim.elapsedMillis = this.elapsedMillis;
	anim.repeatAt = this.repeatAt;
	anim.width = this.width;
	anim.height = this.height;
	return anim;
};

/**
 * Add a frame to the Animation.
 * @param {external:canvas|external:image} img The image to draw for the frame being added.
 * @param {number} time How long, in milliseconds, this frame should be displayed in the Animation.
 */
Animation.prototype.add = function(img, time) {
	this.frames.push({
		img: img,
		time: time
	});
	if (this.frames.length === 1) {
		this.width = img.width;
		this.height = img.height;
	}
};
/**
 * Advance the Animation by a single frame.
 */
Animation.prototype.step = function() {
	this.frame++;
	if (this.frame >= this.frames.length) {
		this.frame = this.repeatAt;
	}
};
/**
 * Advance the Animation by a number of milliseconds.
 * @param {number} elapsedMillis How many milliseconds to advance the animation by.
 */
Animation.prototype.move = function(elapsedMillis) {
	this.elapsedMillis += elapsedMillis;
	while (this.elapsedMillis > this.frames[this.frame].time) {
		this.elapsedMillis -= this.frames[this.frame].time;
		this.step();
	}
};
/**
 * Draw the current frame of the Animation.
 * @param {external:CanvasRenderingContext2D} context The drawing context.
 * @param {number} x The x coordinate to draw the animation at.
 * @param {number} y The y coordinate to draw the animation at.
 */
Animation.prototype.draw = function(context, x, y) {
	var img = this.frames[this.frame].img;
	context.drawImage(img, x, y);
};
/**
 * Reset the Animation to the first frame. This can be useful when you have one piece of code calling {@link Animation#move} each frame, but you want the animation to appear stopped.
 */
Animation.prototype.reset = function() {
	this.frame = 0;
	this.elapsedMillis = 0;
};
/**
 * Flip all frames in the Animation horizontally. Useful when you want to use a single set of images for left and right animations.
 * @return {Animation} The Animation, so you can chain calls to rotate/flip methods.
 */
Animation.prototype.flipHorizontally = function() {
	for (var i = 0; i < this.frames.length; i++) {
		this.frames[i].img = buffer.flipBufferHorizontally(this.frames[i].img);
	}
	return this;
};
/**
 * Flip all frames in the Animation vertically. Useful when you want to use a single set of images for up and down animations.
 * @return {Animation} The Animation, so you can chain calls to rotate/flip methods.
 */
Animation.prototype.flipVertically = function() {
	for (var i = 0; i < this.frames.length; i++) {
		this.frames[i].img = buffer.flipBufferVertically(this.frames[i].img);
	}
	return this;
};
/**
 * Rotate all frames in the Animation clockwise by 90 degrees.
 * @return {Animation} The Animation, so you can chain calls to rotate/flip methods.
 */
Animation.prototype.rotateClockwise = function() {
	var w = this.width;
	this.width = this.height;
	this.height = w;
	for (var i = 0; i < this.frames.length; i++) {
		this.frames[i].img = buffer.rotateClockwise(this.frames[i].img);
	}
	return this;
};
/**
 * Rotate all frames in the Animation counter-clockwise by 90 degrees.
 * @return {Animation} The Animation, so you can chain calls to rotate/flip methods.
 */
Animation.prototype.rotateCounterclockwise = function() {
	var w = this.width;
	this.width = this.height;
	this.height = w;
	for (var i = 0; i < this.frames.length; i++) {
		this.frames[i].img = buffer.rotateCounterclockwise(this.frames[i].img);
	}
	return this;
};

module.exports = Animation;

},{"./buffer":9}],6:[function(require,module,exports){
"use strict";

var buffer = require("./buffer");
var Animation = require("./animation");

function makeFrame(img, frameWidth, f) {
	return buffer.makeBuffer(frameWidth, img.height, function(ctx) {
		var sx = f * frameWidth;
		ctx.drawImage(img, sx, 0, frameWidth, img.height, 0, 0, frameWidth, img.height);
	});
}

function makeAnimation(img, numFrames, time) {
	var a = new Animation();
	var frameWidth = img.width / numFrames |0;
	for (var f = 0; f < numFrames; f++) {
		a.add(makeFrame(img, frameWidth, f), time);
	}
	return a;
}

function loadImageFromManifest(imageLoader, name, info) {
	if (info.strip !== undefined) {
		imageLoader.load(name, info.strip);
	} else if (info.prefix !== undefined) {
		for (var i = 1; i <= info.frames; i++) {
			var number = "" + i;
			if (info.padNumberTo > 1) {
				while (number.length < info.padNumberTo) {
					number = "0" + number;
				}
			}
			name = info.prefix + number + info.suffix;
			imageLoader.load(name + i, name);
		}
	}
}

function loadImagesFromManifest(imageLoader, manifest) {
	for (var key in manifest) {
		if (manifest.hasOwnProperty(key)) {
			var info = manifest[key];
			loadImageFromManifest(imageLoader, key, info);
		}
	}
}

function makeAnimationFromManifest(images, key, manifestEntry) {
	var animation;
	if (manifestEntry.strip !== undefined) {
		var strip = images.get(key);
		animation = makeAnimation(strip, manifestEntry.frames, manifestEntry.msPerFrame);
	} else if (manifestEntry.prefix !== undefined) {
		animation = new Animation();
		for (var i = 1; i <= manifestEntry.frames; i++) {
			var frame = images.get(key + i);
			animation.add(frame, manifestEntry.msPerFrame);
		}
	}
	if (manifestEntry.repeatAt !== undefined) {
		animation.repeatAt = manifestEntry.repeatAt;
	}
	if (manifestEntry.flip === "horizontal") {
		animation.flipHorizontally();
	}
	if (manifestEntry.flip === "vertical") {
		animation.flipVertically();
	}
	if (manifestEntry.rotate === "cw") {
		animation.rotateClockwise();
	}
	if (manifestEntry.rotate === "180") {
		animation.rotateClockwise().rotateClockwise();
	}
	if (manifestEntry.rotate === "ccw") {
		animation.rotateCounterclockwise();
	}
	animation.name = key;
	return animation;
}

function generateAnimationsFromManifest(images, manifest) {
	var animations = {};
	for (var key in manifest) {
		if (manifest.hasOwnProperty(key)) {
			var info = manifest[key];
			animations[key] = makeAnimationFromManifest(images, key, info);
		}
	}
	return animations;
}

/**
 * Loads and constructs {@link Animation}s from a manifest. An instance of AnimationLoader is available as {@link Splat.Game#animations}.
 * @constructor
 * @param {ImageLoader} imageLoader The ImageLoader used to fetch all {@link external:image}s.
 * @param {object} manifest The list of {@link Animation}s to build.
 * @example
	var manifest = {
		"player-left": { // The Animation's name
			"strip": "img/player-left.png", // The path to a sprite-strip. A sprite strip is multiple frames side-by-side horizontally in a single image.
			"frames": 4, // The number of frames in the Animation
			"msPerFrame": 100 // How many milliseconds to display each frame
		},
		"player-right": {
			"strip": "img/player-left.png", // Re-use the left sprite-strip
			"frames": 4,
			"msPerFrame": 100,
			"flip": "horizontal" // Flip the animation horizontally so we can use the left image for the right.
		},
		"item": { // Create an animation from individual images named "img/item/[0000-0009].png"
			"prefix": "img/item/", // Image filename prefix
			"suffix": ".png", // Image filename suffix
			"padNumberTo": 4, // Number part of image is 4 characters long.
			"frames": 10, // Load 10 separate image files [0-9].
			"msPerFrame": 100,
			"repeatAt": 5, // Loop the animation back at frame 5.
			"rotate": "cw" // Rotate the animation clockwise.
		}
	};
	var imageLoader = new Splat.ImageLoader();
	var animationLoader = new Splat.AnimationLoader(imageLoader, manifest);
 */
function AnimationLoader(imageLoader, manifest) {
	/**
	 * The ImageLoader used to fetch all {@link external:image}s.
	 * @member {ImageLoader}
	 */
	this.imageLoader = imageLoader;
	/**
	 * The list of {@link Animation} metadata.
	 * @member {object}
	 */
	this.manifest = manifest;
	loadImagesFromManifest(imageLoader, manifest);
}
/**
 * Test if all {@link Animation}s are loaded.
 * @returns {boolean}
 */
AnimationLoader.prototype.allLoaded = function() {
	if (this.loaded) {
		return true;
	}
	var loaded = this.imageLoader.allLoaded();
	if (loaded) {
		this.animations = generateAnimationsFromManifest(this.imageLoader, this.manifest);
		this.loaded = true;
	}
	return loaded;
};
/**
 * Load a single {@link Animation}.
 * @param {string} name The name to store the {@link Animation} under. This name will be used to retrieve the Animation from {@link AnimationLoader#get}.
 * @param {object} info A single-animation portion of {@link AnimationLoader#manifest}.
 */
AnimationLoader.prototype.load = function(name, info) {
	this.manifest[name] = info;
	this.loaded = false;
	loadImageFromManifest(this.imageLoader, name, info);
};
/**
 * Fetch a loaded {@link Animation}.
 * @param {string} name The name used to identify the {@link Animation} in the {@link AnimationLoader#manifest}.
 * @returns {Animation}
 */
AnimationLoader.prototype.get = function(name) {
	var anim = this.animations[name];
	if (anim === undefined) {
		console.error("Unknown animation: " + name);
	}
	return anim;
};

module.exports = AnimationLoader;

},{"./animation":5,"./buffer":9}],7:[function(require,module,exports){
"use strict";

var BinaryHeap = require("./binary_heap");

/**
 * Implements the [A* pathfinding algorithm]{@link http://en.wikipedia.org/wiki/A*_search_algorithm} on a 2-dimensional grid. You can use this to find a path between a source and destination coordinate while avoiding obstacles.
 * @constructor
 * @alias Splat.AStar
 * @param {isWalkable} isWalkable A function to test if a coordinate is walkable by the entity you're performing the pathfinding for.
 */
function AStar(isWalkable) {
	this.destX = 0;
	this.destY = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.openNodes = {};
	this.closedNodes = {};
	this.openHeap = new BinaryHeap(function(a, b) {
		return a.f - b.f;
	});
	this.isWalkable = isWalkable;
}
/**
 * The [A* heuristic]{@link http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html}, commonly referred to as h(x), that estimates how far a location is from the destination. This implementation is the [Manhattan method]{@link http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html#manhattan-distance}, which is good for situations when the entity can travel in four directions. Feel free to replace this with a different heuristic implementation.
 * @param {number} x The x coordinate to estimate the distance to the destination.
 * @param {number} y The y coordinate to estimate the distance to the destination.
 */
AStar.prototype.heuristic = function(x, y) {
	// manhattan method
	var dx = Math.abs(x - this.destX) / this.scaleX;
	var dy = Math.abs(y - this.destY) / this.scaleY;
	return dx + dy;
};
/**
 * Make a node to track a given coordinate
 * @param {number} x The x coordinate of the node
 * @param {number} y The y coordinate of the node
 * @param {object} parent The parent node for the current node. This chain of parents eventually points back at the starting node.
 * @param {number} g The g(x) travel cost from the parent node to this node.
 * @private
 */
AStar.prototype.makeNode = function(x, y, parent, g) {
	g += parent.g;
	var h = this.heuristic(x, y);

	return {
		x: x,
		y: y,
		parent: parent,
		f: g + h,
		g: parent.g + g,
		h: h
	};
};
/**
 * Update the g(x) travel cost to a node if a new lower-cost path is found.
 * @param {string} key The key of the node on the open list.
 * @param {object} parent A parent node that may have a shorter path for the node specified in key.
 * @param {number} g The g(x) travel cost from parent to the node specified in key.
 * @private
 */
AStar.prototype.updateOpenNode = function(key, parent, g) {
	var node = this.openNodes[key];
	if (!node) {
		return false;
	}

	var newG = parent.g + g;

	if (newG >= node.g) {
		return true;
	}

	node.parent = parent;
	node.g = newG;
	node.f = node.g + node.h;

	var pos = this.openHeap.indexOf(node);
	this.openHeap.bubbleUp(pos);

	return true;
};
/**
 * Create a neighbor node to a parent node, and add it to the open list for consideration.
 * @param {string} key The key of the new neighbor node.
 * @param {number} x The x coordinate of the new neighbor node.
 * @param {number} y The y coordinate of the new neighbor node.
 * @param {object} parent The parent node of the new neighbor node.
 * @param {number} g The travel cost from the parent to the new parent node.
 * @private
 */
AStar.prototype.insertNeighbor = function(key, x, y, parent, g) {
	var node = this.makeNode(x, y, parent, g);
	this.openNodes[key] = node;
	this.openHeap.insert(node);
};
AStar.prototype.tryNeighbor = function(x, y, parent, g) {
	var key = makeKey(x, y);
	if (this.closedNodes[key]) {
		return;
	}
	if (!this.isWalkable(x, y)) {
		return;
	}
	if (!this.updateOpenNode(key, parent, g)) {
		this.insertNeighbor(key, x, y, parent, g);
	}
};
AStar.prototype.getNeighbors = function getNeighbors(parent) {
	var diagonalCost = 1.4;
	var straightCost = 1;
	this.tryNeighbor(parent.x - this.scaleX, parent.y - this.scaleY, parent, diagonalCost);
	this.tryNeighbor(parent.x, parent.y - this.scaleY, parent, straightCost);
	this.tryNeighbor(parent.x + this.scaleX, parent.y - this.scaleY, parent, diagonalCost);

	this.tryNeighbor(parent.x - this.scaleX, parent.y, parent, straightCost);
	this.tryNeighbor(parent.x + this.scaleX, parent.y, parent, straightCost);

	this.tryNeighbor(parent.x - this.scaleX, parent.y + this.scaleY, parent, diagonalCost);
	this.tryNeighbor(parent.x, parent.y + this.scaleY, parent, straightCost);
	this.tryNeighbor(parent.x + this.scaleX, parent.y + this.scaleY, parent, diagonalCost);
};

function generatePath(node) {
	var path = [];
	while (node.parent) {
		var ix = node.x;
		var iy = node.y;
		while (ix !== node.parent.x || iy !== node.parent.y) {
			path.unshift({x: ix, y: iy});

			var dx = node.parent.x - ix;
			if (dx > 0) {
				ix++;
			} else if (dx < 0) {
				ix--;
			}
			var dy = node.parent.y - iy;
			if (dy > 0) {
				iy++;
			} else if (dy < 0) {
				iy--;
			}
		}
		node = node.parent;
	}
	return path;
}

function makeKey(x, y) {
	return x + "," + y;
}

/**
 * Search for an optimal path between srcX, srcY and destX, destY, while avoiding obstacles.
 * @param {number} srcX The starting x coordinate
 * @param {number} srcY The starting y coordinate
 * @param {number} destX The destination x coordinate
 * @param {number} destY The destination y coordinate
 * @returns {Array} The optimal path, in the form of an array of objects that each have an x and y property.
 */
AStar.prototype.search = function aStar(srcX, srcY, destX, destY) {
	function scale(c, s) {
		var downscaled = (c / s) |0;
		return downscaled * s;
	}
	srcX = scale(srcX, this.scaleX);
	srcY = scale(srcY, this.scaleY);
	this.destX = scale(destX, this.scaleX);
	this.destY = scale(destY, this.scaleY);

	if (!this.isWalkable(this.destX, this.destY)) {
		return [];
	}

	var srcKey = makeKey(srcX, srcY);
	var srcNode = {
		x: srcX,
		y: srcY,
		g: 0,
		h: this.heuristic(srcX, srcY)
	};
	srcNode.f = srcNode.h;
	this.openNodes = {};
	this.openNodes[srcKey]  = srcNode;
	this.openHeap = new BinaryHeap(function(a, b) {
		return a.f - b.f;
	});
	this.openHeap.insert(srcNode);
	this.closedNodes = {};

	var node = this.openHeap.deleteRoot();
	while (node) {
		var key = makeKey(node.x, node.y);
		delete this.openNodes[key];
		this.closedNodes[key] = node;
		if (node.x === this.destX && node.y === this.destY) {
			return generatePath(node);
		}
		this.getNeighbors(node);
		node = this.openHeap.deleteRoot();
	}
	return [];
};

module.exports = AStar;

},{"./binary_heap":8}],8:[function(require,module,exports){
"use strict";

/**
 * An implementation of the [Binary Heap]{@link https://en.wikipedia.org/wiki/Binary_heap} data structure suitable for priority queues.
 * @constructor
 * @alias Splat.BinaryHeap
 * @param {compareFunction} cmp A comparison function that determines how the heap is sorted.
 */
function BinaryHeap(cmp) {
	/**
	 * The comparison function for sorting the heap.
	 * @member {compareFunction}
	 * @private
	 */
	this.cmp = cmp;
	/**
	 * The list of elements in the heap.
	 * @member {Array}
	 * @private
	 */
	this.array = [];
	/**
	 * The number of elements in the heap.
	 * @member {number}
	 * @readonly
	 */
	this.length = 0;
}
/**
 * Calculate the index of a node's parent.
 * @param {number} i The index of the child node
 * @returns {number}
 * @private
 */
BinaryHeap.prototype.parentIndex = function(i) {
	return ((i - 1) / 2) |0;
};
/**
 * Calculate the index of a parent's first child node.
 * @param {number} i The index of the parent node
 * @returns {number}
 * @private
 */
BinaryHeap.prototype.firstChildIndex = function(i) {
	return (2 * i) + 1;
};
/**
 * Bubble a node up the heap, stopping when it's value should not be sorted before its parent's value.
 * @param {number} pos The index of the node to bubble up.
 * @private
 */
BinaryHeap.prototype.bubbleUp = function(pos) {
	if (pos === 0) {
		return;
	}

	var data = this.array[pos];
	var parentIndex = this.parentIndex(pos);
	var parent = this.array[parentIndex];
	if (this.cmp(data, parent) < 0) {
		this.array[parentIndex] = data;
		this.array[pos] = parent;
		this.bubbleUp(parentIndex);
	}
};
/**
 * Store a new node in the heap.
 * @param {object} data The data to store
 */
BinaryHeap.prototype.insert = function(data) {
	this.array.push(data);
	this.length = this.array.length;
	var pos = this.array.length - 1;
	this.bubbleUp(pos);
};
/**
 * Bubble a node down the heap, stopping when it's value should not be sorted after its parent's value.
 * @param {number} pos The index of the node to bubble down.
 * @private
 */
BinaryHeap.prototype.bubbleDown = function(pos) {
	var left = this.firstChildIndex(pos);
	var right = left + 1;
	var largest = pos;
	if (left < this.array.length && this.cmp(this.array[left], this.array[largest]) < 0) {
		largest = left;
	}
	if (right < this.array.length && this.cmp(this.array[right], this.array[largest]) < 0) {
		largest = right;
	}
	if (largest !== pos) {
		var tmp = this.array[pos];
		this.array[pos] = this.array[largest];
		this.array[largest] = tmp;
		this.bubbleDown(largest);
	}
};
/**
 * Remove the heap's root node, and return it. The root node is whatever comes first as determined by the {@link compareFunction}.
 * @returns {data} The root node's data.
 */
BinaryHeap.prototype.deleteRoot = function() {
	var root = this.array[0];
	if (this.array.length <= 1) {
		this.array = [];
		this.length = 0;
		return root;
	}
	this.array[0] = this.array.pop();
	this.length = this.array.length;
	this.bubbleDown(0);
	return root;
};
/**
 * Search for a node in the heap.
 * @param {object} data The data to search for.
 * @returns {number} The index of the data in the heap, or -1 if it is not found.
 */
BinaryHeap.prototype.indexOf = function(data) {
	for (var i = 0; i < this.array.length; i++) {
		if (this.array[i] === data) {
			return i;
		}
	}
	return -1;
};

module.exports = BinaryHeap;

},{}],9:[function(require,module,exports){
"use strict";
/** @module buffer */

var platform = require("./platform");

/**
 * Make an invisible {@link canvas}.
 * @param {number} width The width of the canvas
 * @param {number} height The height of the canvas
 * @returns {external:canvas} A canvas DOM element
 * @private
 */
function makeCanvas(width, height) {
	var c = document.createElement("canvas");
	c.width = width;
	c.height = height;
	// when retina support is enabled, context.getImageData() reads from the wrong pixel causing NinePatch to break
	if (platform.isEjecta()) {
		c.retinaResolutionEnabled = false;
	}
	return c;
}

/**
 * Make an invisible canvas buffer, and draw on it.
 * @param {number} width The width of the buffer
 * @param {number} height The height of the buffer
 * @param {drawCallback} drawFun The callback that draws on the buffer
 * @returns {external:canvas} The drawn buffer
 */
function makeBuffer(width, height, drawFun) {
	var canvas = makeCanvas(width, height);
	var ctx = canvas.getContext("2d");
	// when image smoothing is enabled, the image gets blurred and the pixel data isn't correct even when the image shouldn't be scaled which breaks NinePatch
	if (platform.isEjecta()) {
		ctx.imageSmoothingEnabled = false;
	}
	drawFun(ctx);
	return canvas;
}

/**
 * Make a horizonally-flipped copy of a buffer or image.
 * @param {external:canvas|external:image} buffer The original image
 * @return {external:canvas} The flipped buffer
 */
function flipBufferHorizontally(buffer) {
	return makeBuffer(buffer.width, buffer.height, function(context) {
		context.scale(-1, 1);
		context.drawImage(buffer, -buffer.width, 0);
	});
}

/**
 * Make a vertically-flipped copy of a buffer or image.
 * @param {external:canvas|external:image} buffer The original image
 * @return {external:canvas} The flipped buffer
 */
function flipBufferVertically(buffer) {
	return makeBuffer(buffer.width, buffer.height, function(context) {
		context.scale(1, -1);
		context.drawImage(buffer, 0, -buffer.height);
	});
}
/**
 * Make a copy of a buffer that is rotated 90 degrees clockwise.
 * @param {external:canvas|external:image} buffer The original image
 * @return {external:canvas} The rotated buffer
 */
function rotateClockwise(buffer) {
	var w = buffer.height;
	var h = buffer.width;
	var w2 = Math.floor(w / 2);
	var h2 = Math.floor(h / 2);
	return makeBuffer(w, h, function(context) {
		context.translate(w2, h2);
		context.rotate(Math.PI / 2);
		context.drawImage(buffer, -h2, -w2);
	});
}
/**
 * Make a copy of a buffer that is rotated 90 degrees counterclockwise.
 * @param {external:canvas|external:image} buffer The original image
 * @return {external:canvas} The rotated buffer
 */
function rotateCounterclockwise(buffer) {
	var w = buffer.height;
	var h = buffer.width;
	var w2 = Math.floor(w / 2);
	var h2 = Math.floor(h / 2);
	return makeBuffer(w, h, function(context) {
		context.translate(w2, h2);
		context.rotate(-Math.PI / 2);
		context.drawImage(buffer, -h2, -w2);
	});
}

module.exports = {
	makeBuffer: makeBuffer,
	flipBufferHorizontally: flipBufferHorizontally,
	flipBufferVertically: flipBufferVertically,
	rotateClockwise: rotateClockwise,
	rotateCounterclockwise: rotateCounterclockwise
};

},{"./platform":27}],10:[function(require,module,exports){
"use strict";

var Animation = require("./animation");

function Button(mouse, x, y, sprites, stateChanged) {
	this.mouse = mouse;
	this.x = x;
	this.y = y;
	this.state = "normal";
	this.stateChanged = stateChanged;
	this.isToggle = false;

	if (!sprites.normal && sprites.pressDown instanceof Animation) {
		sprites.normal = sprites.pressDown.frames[0].img;
	}
	if (!sprites.pressed && sprites.pressDown instanceof Animation) {
		sprites.pressed = sprites.pressDown.frames[sprites.pressDown.frames.length - 1].img;
	}
	this.sprites = sprites; // normal, pressed, pressDown, popUp
	if (!sprites.normal) {
		console.error("Button is missing the required \"normal\" sprite");
	}
	if (!sprites.pressed) {
		console.error("Button is missing the required \"pressed\" sprite");
	}

	this.width = sprites.normal.width;
	this.height = sprites.normal.height;
}
Button.prototype.move = function(elapsedMillis) {
	var self = this;
	function changeState(state) {
		self.state = state;
		self.stateChanged(state);
		if (self.sprites[state] instanceof Animation) {
			self.sprites[state].reset();
		}
	}

	if (this.state === "normal" && this.mouse.consumePressed(0, this.x, this.y, this.width, this.height)) {
		changeState("pressDown");
		if (!this.sprites.pressDown) {
			changeState("pressed");
		}
	}
	if (this.state === "pressDown" && this.sprites.pressDown.frame === this.sprites.pressDown.frames.length - 1) {
		changeState("pressed");
	}
	if (this.state === "pressed" && (this.isToggle ? this.mouse.consumePressed(0, this.x, this.y, this.width, this.height) : !this.mouse.isPressed(0))) {
		changeState("popUp");
		if (!this.sprites.popUp) {
			changeState("normal");
		}
	}
	if (this.state === "popUp" && this.sprites.popUp.frame === this.sprites.popUp.frames.length - 1) {
		changeState("normal");
	}

	var sprite = this.sprites[this.state];
	if (typeof sprite.move === "function") {
		sprite.move(elapsedMillis);
	}
};
Button.prototype.draw = function(context) {
	var sprite = this.sprites[this.state];
	if (typeof sprite.draw === "function") {
		sprite.draw(context, this.x, this.y);
	} else {
		context.drawImage(sprite, this.x, this.y);
	}
};

module.exports = Button;

},{"./animation":5}],11:[function(require,module,exports){
"use strict";

var Entity = require("./entity");

/**
 * A basic camera. It's really an {@link Splat.Entity}, so you can control it in the same way.
 * By changing {@link Splat.Entity#x} and {@link Splat.Entity#y} you control what portion of the canvas is viewable.
 * For example, if the Camera is at 50,50, and you draw a rectangle at 200,200,
 * it will appear on the screen at 150,150.
 * @constructor
 * @augments Splat.Entity
 * @alias Splat.Camera
 * @param {number} x The top-left x coordinate
 * @param {number} y The top-left y coordinate
 * @param {number} width The width on the x-axis. Currently doesn't do anything.
 * @param {number} height The height on the y-axis. Currently doesn't do anything.
 */
function Camera(x, y, width, height) {
	Entity.call(this, x, y, width, height);
}
Camera.prototype = Object.create(Entity.prototype);
/**
 * Offset all following draw operations on the canvas.
 * This is automatically called for you by {@link Splat.Scene}.
 * @param {external:CanvasRendingContext2D} context The context to offset
 */
Camera.prototype.draw = function(context) {
	context.translate(-(this.x|0), -(this.y|0));
};
/**
 * Draw on the canvas at not-offset coordinates.
 * For example, if the camera is at 50,50 and you draw a rectangle at 200,200
 * it will appear on the screen at 200,200.
 * @param {external:CanvasRendingContext2D} context The context to offset
 * @param {drawCallback} drawFunc The callback the performs the non-offset drawing.
 */
Camera.prototype.drawAbsolute = function(context, drawFunc) {
	context.save();
	context.translate(this.x|0, this.y|0);
	drawFunc();
	context.restore();
};

module.exports = Camera;

},{"./entity":12}],12:[function(require,module,exports){
"use strict";

/**
 * The base in-game object, it supports a location and velocity.
 * Entities are boxes, consisting of an x,y coordinate along with a width and height.
 * Entities have basic collision detection and resolution.
 * @constructor
 * @alias Splat.Entity
 * @param {number} x The top-left x coordinate
 * @param {number} y The top-left y coordinate
 * @param {number} width The width on the x-axis
 * @param {number} height The height on the y-axis
 */
function Entity(x, y, width, height) {
	/**
	 * Leftmost position along the x-axis.
	 * @member {number}
	 */
	this.x = x;
	/**
	 * Topmost position along the y-axis.
	 * @member {number}
	 */
	this.y = y;
	/**
	 * Width of the Entity, extending to the right of {@link Splat.Entity#x}.
	 * @member {number}
	 */
	this.width = width;
	/**
	 * Height of the Entity, extending downward from {@link Splat.Entity#y}.
	 * @member {number}
	 */
	this.height = height;
	/**
	 * Velocity along the x-axis in pixels/millisecond.
	 * @member {number}
	 */
	this.vx = 0;
	/**
	 * Velocity along the y-axis in pixels/millisecond.
	 * @member {number}
	 */
	this.vy = 0;
	/**
	 * The value of {@link Splat.Entity#x} in the previous frame.
	 * @member {number}
	 * @readonly
	 */
	this.lastX = x;
	/**
	 * The value of {@link Splat.Entity#y} in the previous frame.
	 * @member {number}
	 * @readonly
	 */
	this.lastY = y;
	/**
	 * A multiplier on {@link Splat.Entity#vx}. Can be used to implement basic friction.
	 * @member {number}
	 * @private
	 */
	this.frictionX = 1;
	/**
	 * A multiplier on {@link Splat.Entity#vy}. Can be used to implement basic friction.
	 * @member {number}
	 * @private
	 */
	this.frictionY = 1;
}
/**
 * Simulate movement since the previous frame, changing {@link Splat.Entity#x} and {@link Splat.Entity#y} as necessary.
 * @param {number} elapsedMillis The number of milliseconds since the previous frame.
 */
Entity.prototype.move = function(elapsedMillis) {
	this.lastX = this.x;
	this.lastY = this.y;
	this.x += elapsedMillis * this.vx;
	this.y += elapsedMillis * this.vy;
	this.vx *= this.frictionX;
	this.vy *= this.frictionY;
};
/**
 * Test if this Entity horizontally overlaps another.
 * @param {Splat.Entity} other The Entity to test for overlap with
 * @returns {boolean}
 */
Entity.prototype.overlapsHoriz = function(other) {
	return this.x + this.width > other.x && this.x < other.x + other.width;
};
/**
 * Test if this Entity vertically overlaps another.
 * @param {Splat.Entity} other The Entity to test for overlap with
 * @returns {boolean}
 */
Entity.prototype.overlapsVert = function(other) {
	return this.y + this.height > other.y && this.y < other.y + other.height;
};
/**
 * Test if this Entity is currently colliding with another.
 * @param {Splat.Entity} other The Entity to test for collision with
 * @returns {boolean}
 */
Entity.prototype.collides = function(other) {
	return this.overlapsHoriz(other) && this.overlapsVert(other);
};

/**
 * Test if this Entity horizontally overlapped another in the previous frame.
 * @param {Splat.Entity} other The Entity to test for overlap with
 * @returns {boolean}
 */
Entity.prototype.didOverlapHoriz = function(other) {
	return this.lastX + this.width > other.lastX && this.lastX < other.lastX + other.width;
};
/**
 * Test if this Entity vertically overlapped another in the previous frame.
 * @param {Splat.Entity} other The Entity to test for overlap with
 * @returns {boolean}
 */
Entity.prototype.didOverlapVert = function(other) {
	return this.lastY + this.height > other.lastY && this.lastY < other.lastY + other.height;
};

/**
 * Test if this Entity was above another in the previous frame.
 * @param {Splat.Entity} other The Entity to test for above-ness with
 * @returns {boolean}
 */
Entity.prototype.wasAbove = function(other) {
	return this.lastY + this.height <= other.lastY;
};
/**
 * Test if this Entity was below another in the previous frame.
 * @param {Splat.Entity} other The Entity to test for below-ness with
 * @returns {boolean}
 */
Entity.prototype.wasBelow = function(other) {
	return this.lastY >= other.lastY + other.height;
};
/**
 * Test if this Entity was to the left of another in the previous frame.
 * @param {Splat.Entity} other The Entity to test for left-ness with
 * @returns {boolean}
 */
Entity.prototype.wasLeft = function(other) {
	return this.lastX + this.width <= other.lastX;
};
/**
 * Test if this Entity was to the right of another in the previous frame.
 * @param {Splat.Entity} other The Entity to test for right-ness with
 * @returns {boolean}
 */
Entity.prototype.wasRight = function(other) {
	return this.lastX >= other.lastX + other.width;
};

/**
 * Test if this Entity has changed position since the previous frame.
 * @returns {boolean}
 */
Entity.prototype.moved = function() {
	var x = this.x|0;
	var lastX = this.lastX|0;
	var y = this.y|0;
	var lastY = this.lastY|0;
	return (x !== lastX) || (y !== lastY);
};

Entity.prototype.draw = function() {
	// draw bounding boxes
	// context.strokeStyle = "#ff0000";
	// context.strokeRect(this.x, this.y, this.width, this.height);
};

/**
 * Adjust the Entity's position so its bottom edge does not penetrate the other Entity's top edge.
 * {@link Splat.Entity#vy} is also zeroed.
 * @param {Splat.Entity} other
 */
Entity.prototype.resolveBottomCollisionWith = function(other) {
	if (this.overlapsHoriz(other) && this.wasAbove(other)) {
		this.y = other.y - this.height;
		this.vy = 0;
	}
};
/**
 * Adjust the Entity's position so its top edge does not penetrate the other Entity's bottom edge.
 * {@link Splat.Entity#vy} is also zeroed.
 * @param {Splat.Entity} other
 */
Entity.prototype.resolveTopCollisionWith = function(other) {
	if (this.overlapsHoriz(other) && this.wasBelow(other)) {
		this.y = other.y + other.height;
		this.vy = 0;
	}
};
/**
 * Adjust the Entity's position so its right edge does not penetrate the other Entity's left edge.
 * {@link Splat.Entity#vx} is also zeroed.
 * @param {Splat.Entity} other
 */
Entity.prototype.resolveRightCollisionWith = function(other) {
	if (this.overlapsVert(other) && this.wasLeft(other)) {
		this.x = other.x - this.width;
		this.vx = 0;
	}
};
/**
 * Adjust the Entity's position so its left edge does not penetrate the other Entity's right edge.
 * {@link Splat.Entity#vx} is also zeroed.
 * @param {Splat.Entity} other
 */
Entity.prototype.resolveLeftCollisionWith = function(other) {
	if (this.overlapsVert(other) && this.wasRight(other)) {
		this.x = other.x + other.width;
		this.vx = 0;
	}
};
/**
 * Adjust the Entity's position so it does not penetrate the other Entity.
 * {@link Splat.Entity#vx} will be zeroed if {@link Splat.Entity#x} was adjusted, and {@link Splat.Entity#vy} will be zeroed if {@link Splat.Entity#y} was adjusted.
 * @param {Splat.Entity} other
 */
Entity.prototype.resolveCollisionWith = function(other) {
	this.resolveBottomCollisionWith(other);
	this.resolveTopCollisionWith(other);
	this.resolveRightCollisionWith(other);
	this.resolveLeftCollisionWith(other);
};
/**
 * Return a list of all Entities that collide with this Entity.
 * @param {Array} entities A list of Entities to check for collisions.
 * @return {Array} A list of entities that collide with this Entity.
 */
Entity.prototype.getCollisions = function(entities) {
	var self = this;
	return entities.filter(function(entity) {
		return self.collides(entity);
	});
};
/**
 * Detect and resolve collisions between this Entity and a list of other Entities
 * @param {Array} entities A list of Entities to solve against.
 * @param {Array} A list of entities that were involved in collisions.
 */
Entity.prototype.solveCollisions = function(entities) {
	var involved = [];
	var self = this;

	var countCollisionsAfterResolution = function(block) {
		var x = self.x;
		var y = self.y;
		var vx = self.vx;
		var vy = self.vy;

		self.resolveCollisionWith(block);
		var len = self.getCollisions(entities).length;

		self.x = x;
		self.y = y;
		self.vx = vx;
		self.vy = vy;

		return [block, len];
	};

	var minResolution = function(previous, current) {
		if (current[1] < previous[1]) {
			return current;
		}
		return previous;
	};

	while (true) {
		var collisions = self.getCollisions(entities);
		if (collisions.length === 0) {
			break;
		}

		var resolutions = collisions.map(countCollisionsAfterResolution);
		var minResolve = resolutions.reduce(minResolution);
		self.resolveCollisionWith(minResolve[0]);
		involved.push(minResolve[0]);

		if (minResolve[1] === 0) {
			break;
		}
	}
	return involved;
};

module.exports = Entity;

},{}],13:[function(require,module,exports){
"use strict";

var Camera = require("./camera");

/**
 * A {@link Splat.Camera} that tracks an {@link Splat.Entity} to keep it on screen within an invisible box. If the Entity moves outside of the invisible box, the camera is adjusted the minimal amount so that the Entity is back inside the box.
 * @constructor
 * @augments Splat.Entity
 * @alias Splat.EntityBoxCamera
 * @param {Splat.Entity} entity The Entity for the camera to track.
 * @param {number} width The width of the invisible box to keep the {@link Splat.Entity} within.
 * @param {number} height The height of the invisible box to keep the {@link Splat.Entity} within.
 * @param {number} screenCenterX The center of the invisible box on the screen along the x axis.
 * @param {number} screenCenterY The center of the invisible box on the screen along the y axis.
 * @example
var scene = new Splat.Scene(canvas, function() {
	// initialization
	this.player = new Splat.Entity(200, 200, 50, 50);
	// make a camera that won't let the player closer than 100 pixels to the left and right sides, or 50 pixels from the top or bottom
	this.camera = new Splat.EntityBoxCamera(this.player, canvas.width - 200, canvas.height - 100, canvas.width / 2, canvas.height / 2);
}, function(elapsedMillis) {
	// simulation
}, function(context) {
	// draw
});
 */
function EntityBoxCamera(entity, width, height, screenCenterX, screenCenterY) {
	/**
	 * The {@link Splat.Entity} for the camera to track.
	 * @member {Splat.Entity}
	 */
	this.entity = entity;
	/**
	 * The center of the invisible box on the screen along the x axis.
	 * @member {number}
	 */
	this.screenCenterX = screenCenterX;
	/**
	 * The center of the invisible box on the screen along the y axis.
	 * @member {number}
	 */
	this.screenCenterY = screenCenterY;

	var x = keepPositionInBox(entity.x, entity.width, 0, width, screenCenterX);
	var y = keepPositionInBox(entity.y, entity.height, 0, height, screenCenterY);
	Camera.call(this, x, y, width, height);
}
EntityBoxCamera.prototype = Object.create(Camera.prototype);
/**
 * Adjust the camera so that it keeps {@link Splat.EntityBoxCamera#entity} within the invisible box. This is usually automatically called by the {@link Splat.Scene} for you.
 */
EntityBoxCamera.prototype.move = function() {
	this.x = keepPositionInBox(this.entity.x, this.entity.width, this.x, this.width, this.screenCenterX);
	this.y = keepPositionInBox(this.entity.y, this.entity.height, this.y, this.height, this.screenCenterY);
};

function keepPositionInBox(entityPos, entitySize, thisPos, thisSize, offset) {
	var boundsFromCenter = thisSize / 2;
	if (entityPos < thisPos + offset - boundsFromCenter) {
		thisPos = entityPos - offset + boundsFromCenter;
	}
	if (entityPos + entitySize > thisPos + offset + boundsFromCenter) {
		thisPos = entityPos + entitySize - offset - boundsFromCenter;
	}
	return thisPos;
}

module.exports = EntityBoxCamera;

},{"./camera":11}],14:[function(require,module,exports){
"use strict";

require("../vendor/FontLoader.js");
var platform = require("./platform");

function buildFontFaceRule(family, urls) {
	var eot = urls["embedded-opentype"];
	var woff = urls.woff;
	var ttf = urls.truetype;
	var svg = urls.svg;

	var css = "\n";
	css += "@font-face {\n";
	css += "  font-family: \"" + family + "\";\n";
	css += "  src: url(\"" + eot + "\");\n";
	css += "  src: url(\"" + eot + "?iefix\") format(\"embedded-opentype\"),\n";
	css += "       url(\"" + woff + "\") format(\"woff\"),\n";
	css += "       url(\"" + ttf + "\") format(\"ttf\"),\n";
	css += "       url(\"" + svg + "\") format(\"svg\");\n";
	css += "}\n";
	return css;
}

function createCssFontFaces(fontFamilies) {
	var style = document.createElement("style");
	style.setAttribute("type", "text/css");
	var css = "";
	for (var family in fontFamilies) {
		if (fontFamilies.hasOwnProperty(family)) {
			css += buildFontFaceRule(family, fontFamilies[family]);
		}
	}
	style.appendChild(document.createTextNode(css));
	document.head.appendChild(style);
}

/**
 * Load fonts and lets you know when they're all available. An instance of FontLoader is available as {@link Splat.Game#fonts}.
 * @constructor
 */
function FontLoader() {
	/**
	 * The total number of fonts to be loaded.
	 * @member {number}
	 * @private
	 */
	this.totalFonts = 0;
	/**
	 * The number of fonts that have loaded completely.
	 * @member {number}
	 * @private
	 */
	this.loadedFonts = 0;
}
/**
 * Load a font.
 * @param {object} fontFamilies A key-value object that maps css font-family names to another object that holds paths to the various font files in different formats.
 * @example
game.fonts.load({
	"pixelade": {
		"embedded-opentype": "pixelade/pixelade-webfont.eot",
		"woff": "pixelade/pixelade-webfont.woff",
		"truetype": "pixelade/pixelade-webfont.ttf",
		"svg": "pixelade/pixelade-webfont.svg#pixeladeregular"
	}
});
 */
FontLoader.prototype.load = function(fontFamilies) {
	createCssFontFaces(fontFamilies);

	var families = [];
	for (var family in fontFamilies) {
		if (families.hasOwnProperty(family)) {
			families.push(family);
		}
	}
	this.totalFonts += families.length;

	var self = this;
	var loader = new window.FontLoader(families, {
		"fontLoaded": function() {
			self.loadedFonts++;
		}
	});
	loader.loadFonts();
};
/**
 * Test if all font fonts have loaded.
 * @returns {boolean}
 */
FontLoader.prototype.allLoaded = function() {
	return this.totalFonts === this.loadedFonts;
};

/**
 * An alternate {@link FontLoader} when the game is running inside [Ejecta]{@link http://impactjs.com/ejecta}. You shouldn't need to worry about this.
 * @constructor
 * @private
 */
function EjectaFontLoader() {
	this.totalFonts = 0;
	this.loadedFonts = 0;
}
/**
 * See {@link FontLoader#load}.
 */
EjectaFontLoader.prototype.load = function(fontFamilies) {
	for (var family in fontFamilies) {
		if (fontFamilies.hasOwnProperty(family)) {
			var fontPath = fontFamilies[family].truetype;
			if (fontPath) {
				window.ejecta.loadFont(fontPath);
			}
		}
	}
};
/**
 * See {@link FontLoader#allLoaded}.
 */
EjectaFontLoader.prototype.allLoaded = function() {
	return true;
};

if (platform.isEjecta()) {
	module.exports = EjectaFontLoader;
} else {
	module.exports = FontLoader;
}

},{"../vendor/FontLoader.js":34,"./platform":27}],15:[function(require,module,exports){
"use strict";

var Scene = require("./scene");
var Mouse = require("./mouse");
var Accelerometer = require("./accelerometer");
var Keyboard = require("./keyboard");
var keyMap = require("./key_map");
var ImageLoader = require("./image_loader");
var SoundLoader = require("./sound_loader");
var FontLoader = require("./font_loader");
var AnimationLoader = require("./animation_loader");
var SceneManager = require("./scene_manager");
var platform = require("./platform");

function loadAssets(assetLoader, assets) {
	for (var key in assets) {
		if (assets.hasOwnProperty(key)) {
			assetLoader.load(key, assets[key]);
		}
	}
}

function makeLoadingScene(game, canvas, nextScene) {
	return new Scene(canvas, function() {
	}, function() {
		if (game.isLoaded()) {
			game.scenes.switchTo(nextScene);
		}
	}, function(context) {
		context.fillStyle = "#000000";
		context.fillRect(0, 0, canvas.width, canvas.height);

		var quarterWidth = (canvas.width / 4) |0;
		var halfWidth = (canvas.width / 2) |0;
		var halfHeight = (canvas.height / 2) |0;

		context.fillStyle = "#ffffff";
		context.fillRect(quarterWidth, halfHeight - 15, halfWidth, 30);

		context.fillStyle = "#000000";
		context.fillRect(quarterWidth + 3, halfHeight - 12, halfWidth - 6, 24);

		context.fillStyle = "#ffffff";
		var barWidth = (halfWidth - 6) * game.percentLoaded();
		context.fillRect(quarterWidth + 3, halfHeight - 12, barWidth, 24);
	});
}

function setCanvasSizeScaled(canvas) {
	var ww = window.innerWidth;
	var wh = window.innerHeight;
	var cw = canvas.width;
	var ch = canvas.height;

	if (ww >= cw && wh >= ch) {
		return;
	} else if (ww < cw && wh >= ch) {
		wh = ((ww / cw) * ch) | 0;
		canvas.style.width = ww + "px";
		canvas.style.height = wh + "px";
	} else if (ww >= cw && wh < ch) {
		ww = ((wh / ch) * cw) | 0;
		canvas.style.width = ww + "px";
		canvas.style.height = wh + "px";
	} else if (ww < cw && wh < ch) {
		if ((ww / cw) * ch > wh) {
			ww = ((wh / ch) * cw) | 0;
		} else {
			wh = ((ww / cw) * ch) | 0;
		}
		canvas.style.width = ww + "px";
		canvas.style.height = wh + "px";
	}
}

/**
 * Represents a whole game. This class contains all the inputs, outputs, and data for the game.
 * @constructor
 * @alias Splat.Game
 * @param {external:canvas} canvas The canvas on which to render the game.
 * @param {object} manifest A key-value set of attributes that describe all the external resources for the game. This references all the images, sounds, fonts, and animations.
 * @example
	var canvas = document.getElementById("canvas");
	var manifest = {
		"images": {
			"bg": "images/bg.png"
		},
		"sounds": {
			"point": "sounds/point.wav"
		},
		"fonts": [
			"pixelade": {
				"embedded-opentype": "pixelade/pixelade-webfont.eot",
				"woff": "pixelade/pixelade-webfont.woff",
				"truetype": "pixelade/pixelade-webfont.ttf",
				"svg": "pixelade/pixelade-webfont.svg#pixeladeregular"
			}
		],
		"animations": {
			"player-slide-left": {
				"strip": "images/player-slide-anim.png",
				"frames": 8,
				"msPerFrame": 100
			}
		}
	};
	var game = new Splat.Game(canvas, manifest);
 */
function Game(canvas, manifest) {
	window.addEventListener("resize", function() { setCanvasSizeScaled(canvas); });
	setCanvasSizeScaled(canvas);

	var game = this;
	var wasMuted = false;
	window.addEventListener("visibilitychange", function() {
		var scene = game.scenes.currentScene;
		if (typeof scene.visibilitychange === "function") {
			scene.visibilitychange(document.visibilityState);
			return;
		}
		if (document.visibilityState === "hidden") {
			scene.stop();
			wasMuted = game.sounds.muted;
			game.sounds.mute();
		} else {
			scene.start();
			if (!wasMuted) {
				game.sounds.unmute();
			}
		}
	});

	/**
	 * The mouse input for the game.
	 * @member {Mouse}
	 */
	this.mouse = new Mouse(canvas);
	/**
	 * The keyboard input for the game.
	 * @member {Keyboard}
	 */
	this.keyboard = new Keyboard(keyMap.US);
	/**
	 * The accelerometer input for the game.
	 * @member {Accelerometer}
	 */
	this.accelerometer = new Accelerometer();

	/**
	 * The image assets for the game.
	 * @member {ImageLoader}
	 */
	this.images = new ImageLoader();
	loadAssets(this.images, manifest.images);

	/**
	 * The sound assets for the game.
	 * @member {SoundLoader}
	 */
	this.sounds = new SoundLoader();
	loadAssets(this.sounds, manifest.sounds);

	/**
	 * The font assets for the game.
	 * @member {FontLoader}
	 */
	this.fonts = new FontLoader();
	this.fonts.load(manifest.fonts);

	/**
	 * The animation assets for the game.
	 * @member {AnimationLoader}
	 */
	this.animations = new AnimationLoader(this.images, manifest.animations);

	/**
	 * The scenes for the game.
	 * @member {SceneManager}
	 */
	this.scenes = new SceneManager();
	this.scenes.add("loading", makeLoadingScene(this, canvas, "title"));
}
/**
 * Test if all the game's assets are loaded.
 * @returns {boolean}
 */
Game.prototype.isLoaded = function() {
	return this.images.allLoaded() &&
		this.sounds.allLoaded() &&
		this.fonts.allLoaded() &&
		this.animations.allLoaded();
};
/**
 * Determine the percent of the game's assets that are loaded. This is useful for drawing a loading bar.
 * @returns {number} A number between 0 and 1
 */
Game.prototype.percentLoaded = function() {
	var totalAssets =
		this.images.totalImages +
		this.sounds.totalSounds +
		this.fonts.totalFonts;
	var loadedAssets =
		this.images.loadedImages +
		this.sounds.loadedSounds +
		this.fonts.loadedFonts;
	return loadedAssets / totalAssets;
};
/**
 * Test if the game is running within a Chrome App.
 * @returns {boolean}
 */
Game.prototype.isChromeApp = function() {
	return platform.isChromeApp();
};

module.exports = Game;

},{"./accelerometer":2,"./animation_loader":6,"./font_loader":14,"./image_loader":17,"./key_map":18,"./keyboard":19,"./mouse":23,"./platform":27,"./scene":29,"./scene_manager":30,"./sound_loader":31}],16:[function(require,module,exports){
"use strict";

var platform = require("./platform");

if (platform.isEjecta()) {
	var iap = new window.Ejecta.IAPManager();

	module.exports = {
		"get": function(sku, callback) {
			iap.getProducts([sku], function(err, products) {
				if (err) {
					callback(err);
					return;
				}
				callback(undefined, products[0]);
			});
		},
		"buy": function(product, quantity, callback) {
			product.purchase(quantity, callback);
		},
		"restore": function(callback) {
			iap.restoreTransactions(function(err, transactions) {
				if (err) {
					callback(err);
					return;
				}
				callback(undefined, transactions.map(function(transaction) {
					return transaction.productId;
				}));
			});
		}
	};
} else if (platform.isChromeApp()) {
	// FIXME: needs google's buy.js included
	// https://developer.chrome.com/webstore/payments-iap
	module.exports = {
		"get": function(sku, callback) {
			window.google.payments.inapp.getSkuDetails({
				"parameters": {
					"env": "prod"
				},
				"sku": sku,
				"success": function(response) {
					callback(undefined, response.response.details.inAppProducts[0]);
				},
				"failure": function(response) {
					callback(response);
				}
			});
		},
		"buy": function(product, quantity, callback) { // jshint ignore:line
			window.google.payments.inapp.buy({
				"parameters": {
					"env": "prod"
				},
				"sku": product.sku,
				"success": function(response) {
					callback(undefined, response);
				},
				"failure": function(response) {
					callback(response);
				}
			});
		},
		"restore": function(callback) {
			window.google.payments.inapp.getPurchases({
				"success": function(response) {
					callback(undefined, response.response.details.map(function(detail) {
						return detail.sku;
					}));
				},
				"failure": function(response) {
					callback(response);
				}
			});
		}
	};
} else {
	module.exports = {
		"get": function(sku, callback) { // jshint ignore:line
			callback(undefined, undefined);
		},
		"buy": function(product, quantity, callback) { // jshint ignore:line
			callback(undefined);
		},
		"restore": function(callback) {
			callback(undefined, []);
		}
	};
}

},{"./platform":27}],17:[function(require,module,exports){
"use strict";

/**
 * Loads {@link external:image}s and lets you know when they're all available. An instance of ImageLoader is available as {@link Splat.Game#images}.
 * @constructor
 */
function ImageLoader() {
	/**
	 * The key-value object that stores named {@link external:image}s
	 * @member {object}
	 * @private
	 */
	this.images = {};
	/**
	 * The total number of images to be loaded.
	 * @member {number}
	 * @private
	 */
	this.totalImages = 0;
	/**
	 * The number of images that have loaded completely.
	 * @member {number}
	 * @private
	 */
	this.loadedImages = 0;
	/**
	 * The names of all the images that were requested to be loaded.
	 * @member {Array}
	 * @private
	 */
	this.names = [];
}
/**
 * Load an {@link external:image}.
 * @param {string} name The name you want to use when you {@link ImageLoader#get} the {@link external:image}
 * @param {string} path The path of the {@link external:image}.
 */
ImageLoader.prototype.load = function(name, path) {
	// only load an image once
	if (this.names.indexOf(name) > -1) {
		return;
	}
	this.names.push(name);

	this.totalImages++;

	var img = new Image();
	var self = this;
	img.addEventListener("load", function() {
		self.loadedImages++;
		self.images[name] = img;
	});
	img.addEventListener("error", function() {
		console.error("Error loading image " + path);
	});
	img.src = path;
};
/**
 * Test if all {@link external:image}s have loaded.
 * @returns {boolean}
 */
ImageLoader.prototype.allLoaded = function() {
	return this.totalImages === this.loadedImages;
};
/**
 * Retrieve a loaded {@link external:image}.
 * @param {string} name The name given to the image during {@link ImageLoader#load}.
 * @returns {external:image}
 */
ImageLoader.prototype.get = function(name) {
	var img = this.images[name];
	if (img === undefined) {
		console.error("Unknown image: " + name);
	}
	return img;
};

module.exports = ImageLoader;

},{}],18:[function(require,module,exports){
/**
 * Keyboard code mappings that map keycodes to key names. A specific named map should be given to {@link Keyboard}. The default map is "US".
 * @module KeyMap
 */
module.exports = {
	"US": {
		8: "backspace",
		9: "tab",
		13: "enter",
		16: "shift",
		17: "ctrl",
		18: "alt",
		19: "pause/break",
		20: "capslock",
		27: "escape",
		32: "space",
		33: "pageup",
		34: "pagedown",
		35: "end",
		36: "home",
		37: "left",
		38: "up",
		39: "right",
		40: "down",
		45: "insert",
		46: "delete",
		48: "0",
		49: "1",
		50: "2",
		51: "3",
		52: "4",
		53: "5",
		54: "6",
		55: "7",
		56: "8",
		57: "9",
		65: "a",
		66: "b",
		67: "c",
		68: "d",
		69: "e",
		70: "f",
		71: "g",
		72: "h",
		73: "i",
		74: "j",
		75: "k",
		76: "l",
		77: "m",
		78: "n",
		79: "o",
		80: "p",
		81: "q",
		82: "r",
		83: "s",
		84: "t",
		85: "u",
		86: "v",
		87: "w",
		88: "x",
		89: "y",
		90: "z",
		91: "leftwindow",
		92: "rightwindow",
		93: "select",
		96: "numpad-0",
		97: "numpad-1",
		98: "numpad-2",
		99: "numpad-3",
		100: "numpad-4",
		101: "numpad-5",
		102: "numpad-6",
		103: "numpad-7",
		104: "numpad-8",
		105: "numpad-9",
		106: "multiply",
		107: "add",
		109: "subtract",
		110: "decimalpoint",
		111: "divide",
		112: "f1",
		113: "f2",
		114: "f3",
		115: "f4",
		116: "f5",
		117: "f6",
		118: "f7",
		119: "f8",
		120: "f9",
		121: "f10",
		122: "f11",
		123: "f12",
		144: "numlock",
		145: "scrolllock",
		186: "semicolon",
		187: "equals",
		188: "comma",
		189: "dash",
		190: "period",
		191: "forwardslash",
		192: "graveaccent",
		219: "openbracket",
		220: "backslash",
		221: "closebraket",
		222: "singlequote"
	}
};

},{}],19:[function(require,module,exports){
"use strict";

/**
 * Keyboard input handling. An instance of Keyboard is available as {@link Splat.Game#keyboard}.
 * @constructor
 * @param {module:KeyMap} keymap A map of keycodes to descriptive key names.
 */
function Keyboard(keyMap) {
	/**
	 * The current key states.
	 * @member {object}
	 * @private
	 */
	this.keys = {};

	var self = this;
	for (var kc in keyMap) {
		if (keyMap.hasOwnProperty(kc)) {
			this.keys[keyMap[kc]] = 0;
		}
	}
	window.addEventListener("keydown", function(event) {
		if (keyMap.hasOwnProperty(event.keyCode)) {
			if (self.keys[keyMap[event.keyCode]] === 0) {
				self.keys[keyMap[event.keyCode]] = 2;
			}
			return false;
		}
	});
	window.addEventListener("keyup", function(event) {
		if (keyMap.hasOwnProperty(event.keyCode)) {
			self.keys[keyMap[event.keyCode]] = 0;
			return false;
		}
	});
}
/**
 * Test if a key is currently pressed.
 * @param {string} name The name of the key to test
 * @returns {boolean}
 */
Keyboard.prototype.isPressed = function(name) {
	return this.keys[name] >= 1;
};
/**
 * Test if a key is currently pressed, also making it look like the key was unpressed.
 * This makes is so multiple successive calls will not return true unless the key was repressed.
 * @param {string} name The name of the key to test
 * @returns {boolean}
 */
Keyboard.prototype.consumePressed = function(name) {
	var p = this.keys[name] === 2;
	if (p) {
		this.keys[name] = 1;
	}
	return p;
};

module.exports = Keyboard;

},{}],20:[function(require,module,exports){
"use strict";
/**
 * @namespace Splat.leaderboards
 */

var platform = require("./platform");

if (platform.isEjecta()) {
	var gameCenter = new window.Ejecta.GameCenter();
	gameCenter.softAuthenticate();

	var authFirst = function(action) {
		if (gameCenter.authed) {
			action();
		} else {
			gameCenter.authenticate(function(err) {
				if (err) {
					return;
				}
				action();
			});
		}
	};

	module.exports = {
		/**
		 * Report that an achievement was achieved.
		 * @alias Splat.leaderboards.reportAchievement
		 * @param {string} id The name of the achievement.
		 * @param {int} percent The percentage of the achievement that is completed in the range of 0-100.
		 */
		"reportAchievement": function(id, percent) {
			authFirst(function() {
				gameCenter.reportAchievement(id, percent);
			});
		},
		/**
		 * Report that a score was achieved on a leaderboard.
		 * @alias Splat.leaderboards.reportScore
		 * @param {string} leaderboard The name of the leaderboard the score is on.
		 * @param {int} score The score that was achieved.
		 */
		"reportScore": function(leaderboard, score) {
			authFirst(function() {
				gameCenter.reportScore(leaderboard, score);
			});
		},
		/**
		 * Show the achievements screen.
		 * @alias Splat.leaderboards.showAchievements
		 */
		"showAchievements": function() {
			authFirst(function() {
				gameCenter.showAchievements();
			});
		},
		/**
		 * Show a leaderboard screen.
		 * @alias Splat.leaderboards.showLeaderboard
		 * @param {string} name The name of the leaderboard to show.
		 */
		"showLeaderboard": function(name) {
			authFirst(function() {
				gameCenter.showLeaderboard(name);
			});
		}
	};
} else {
	module.exports = {
		"reportAchievement": function() {},
		"reportScore": function() {},
		"showAchievements": function() {},
		"showLeaderboard": function() {}
	};
}


},{"./platform":27}],21:[function(require,module,exports){
"use strict";

var buffer = require("./buffer");

/**
 * @namespace Splat
 */
module.exports = {
	makeBuffer: buffer.makeBuffer,
	flipBufferHorizontally: buffer.flipBufferHorizontally,
	flipBufferVertically: buffer.flipBufferVertically,

	ads: require("./ads"),
	AnimatedEntity: require("./animated_entity"),
	AStar: require("./astar"),
	BinaryHeap: require("./binary_heap"),
	Button: require("./button"),
	Camera: require("./camera"),
	Entity: require("./entity"),
	EntityBoxCamera: require("./entity_box_camera"),
	Game: require("./game"),
	iap: require("./iap"),
	leaderboards: require("./leaderboards"),
	math: require("./math"),
	openUrl: require("./openUrl"),
	NinePatch: require("./ninepatch"),
	Particles: require("./particles"),
	saveData: require("./save_data"),
	Scene: require("./scene"),
	Timer: require("./timer"),
};

},{"./ads":3,"./animated_entity":4,"./astar":7,"./binary_heap":8,"./buffer":9,"./button":10,"./camera":11,"./entity":12,"./entity_box_camera":13,"./game":15,"./iap":16,"./leaderboards":20,"./math":22,"./ninepatch":24,"./openUrl":25,"./particles":26,"./save_data":28,"./scene":29,"./timer":32}],22:[function(require,module,exports){
"use strict";

/**
 * Oscillate between -1 and 1 given a value and a period. This is basically a simplification on using Math.sin().
 * @alias Splat.math.oscillate
 * @param {number} current The current value of the number you want to oscillate.
 * @param {number} period The period, or how often the number oscillates. The return value will oscillate between -1 and 1, depending on how close current is to a multiple of period.
 * @returns {number} A number between -1 and 1.
 * @example
Splat.math.oscillate(0, 100); // returns 0
Splat.math.oscillate(100, 100); // returns 0-ish
Splat.math.oscillate(50, 100); // returns 1
Splat.math.oscillate(150, 100); // returns -1
Splat.math.oscillate(200, 100); // returns 0-ish
 */
function oscillate(current, period) {
	return Math.sin(current / period * Math.PI);
}

/**
 * @namespace Splat.math
 */
module.exports = {
	oscillate: oscillate,
	/**
	 * A seedable pseudo-random number generator. Currently a Mersenne Twister PRNG.
	 * @constructor
	 * @alias Splat.math.Random
	 * @param {number} [seed] The seed for the PRNG.
	 * @see [mersenne-twister package at github]{@link https://github.com/boo1ean/mersenne-twister}
	 * @example
var rand = new Splat.math.Random(123);
var val = rand.random();
	 */
	Random: require("mersenne-twister")
};

},{"mersenne-twister":33}],23:[function(require,module,exports){
"use strict";

var platform = require("./platform");

// prevent springy scrolling on ios
document.ontouchmove = function(e) {
	e.preventDefault();
};

// prevent right-click on desktop
window.oncontextmenu = function() {
	return false;
};

var relMouseCoords = function(canvas, event) {
	var x = event.pageX - canvas.offsetLeft + document.body.scrollLeft;
	var y = event.pageY - canvas.offsetTop + document.body.scrollTop;

	// scale based on ratio of canvas internal dimentions to css dimensions
	if (canvas.style.width.length) {
		x *= canvas.width / canvas.style.width.substring(0, canvas.style.width.indexOf("p"));
	}
	if (canvas.style.height.length) {
		y *= canvas.height / canvas.style.height.substring(0, canvas.style.height.indexOf("p"));
	}

	return {x:x, y:y};
};

function relMouseCoordsEjecta(canvas, event) {
	var ratioX = canvas.width / window.innerWidth;
	var ratioY = canvas.height / window.innerHeight;
	var x = event.pageX * ratioX;
	var y = event.pageY * ratioY;
	return {x:x, y:y};
}

if (platform.isEjecta()) {
	relMouseCoords = relMouseCoordsEjecta;
}

/**
 * Mouse and touch input handling. An instance of Mouse is available as {@link Splat.Game#mouse}.
 *
 * The first touch will emulates a mouse press with button 0.
 * This means you can use the mouse ({@link Mouse#isPressed}/{@link Mouse#consumePressed}) APIs and your game will work on touch screens (as long as you only need the left button.
 *
 * A mouse press will emulate a touch if the device does not support touch.
 * This means you can use {@link Mouse#touches}, and your game will still work on a PC with a mouse.
 * Also, if you call {@link Mouse#consumePressed} with button 0, it will add a `consumed:true` field to all current touches. This will help you prevent processing a touch multiple times.
 *
 * @constructor
 * @param {external:canvas} canvas The canvas to listen for events on.
 */
function Mouse(canvas) {
	/**
	 * The x coordinate of the cursor relative to the left side of the canvas.
	 * @member {number}
	 */
	this.x = 0;
	/**
	 * The y coordinate of the cursor relative to the top of the canvas.
	 * @member {number}
	 */
	this.y = 0;
	/**
	 * The current button states.
	 * @member {Array}
	 * @private
	 */
	this.buttons = [0, 0, 0];

	/**
	 * An array of the current touches on a touch screen device. Each touch has a `x`, `y`, and `id` field.
	 * @member {Array}
	 */
	this.touches = [];

	/**
	 * A function that is called when a mouse button or touch is released.
	 * @callback onmouseupHandler
	 * @param {number} x The x coordinate of the mouse or touch that was released.
	 * @param {number} y The y coordinate of the mouse or touch that was released.
	 */
	/**
	 * A function that will be called when a mouse button is released, or a touch has stopped.
	 * This is useful for opening a URL with {@link Splat.openUrl} to avoid popup blockers.
	 * @member {onmouseupHandler}
	 */
	this.onmouseup = undefined;

	var self = this;
	canvas.addEventListener("mousedown", function(event) {
		var m = relMouseCoords(canvas, event);
		self.x = m.x;
		self.y = m.y;
		self.buttons[event.button] = 2;
		updateTouchFromMouse();
	});
	canvas.addEventListener("mouseup", function(event) {
		var m = relMouseCoords(canvas, event);
		self.x = m.x;
		self.y = m.y;
		self.buttons[event.button] = 0;
		updateTouchFromMouse();
		if (self.onmouseup) {
			self.onmouseup(self.x, self.y);
		}
	});
	canvas.addEventListener("mousemove", function(event) {
		var m = relMouseCoords(canvas, event);
		self.x = m.x;
		self.y = m.y;
		updateTouchFromMouse();
	});

	function updateTouchFromMouse() {
		if (self.supportsTouch()) {
			return;
		}
		var idx = touchIndexById("mouse");
		if (self.isPressed(0)) {
			if (idx !== undefined) {
				var touch = self.touches[idx];
				touch.x = self.x;
				touch.y = self.y;
			} else {
				self.touches.push({
					id: "mouse",
					x: self.x,
					y: self.y
				});
			}
		} else if (idx !== undefined) {
			self.touches.splice(idx, 1);
		}
	}
	function updateMouseFromTouch(touch) {
		self.x = touch.x;
		self.y = touch.y;
		if (self.buttons[0] === 0) {
			self.buttons[0] = 2;
		}
	}
	function touchIndexById(id) {
		for (var i = 0; i < self.touches.length; i++) {
			if (self.touches[i].id === id) {
				return i;
			}
		}
		return undefined;
	}
	function eachChangedTouch(event, onChangeFunc) {
		var touches = event.changedTouches;
		for (var i = 0; i < touches.length; i++) {
			onChangeFunc(touches[i]);
		}
	}
	canvas.addEventListener("touchstart", function(event) {
		eachChangedTouch(event, function(touch) {
			var t = relMouseCoords(canvas, touch);
			t.id = touch.identifier;
			if (self.touches.length === 0) {
				t.isMouse = true;
				updateMouseFromTouch(t);
			}
			self.touches.push(t);
		});
	});
	canvas.addEventListener("touchmove", function(event) {
		eachChangedTouch(event, function(touch) {
			var idx = touchIndexById(touch.identifier);
			var t = self.touches[idx];
			var coords = relMouseCoords(canvas, touch);
			t.x = coords.x;
			t.y = coords.y;
			if (t.isMouse) {
				updateMouseFromTouch(t);
			}
		});
	});
	canvas.addEventListener("touchend", function(event) {
		eachChangedTouch(event, function(touch) {
			var idx = touchIndexById(touch.identifier);
			var t = self.touches.splice(idx, 1)[0];
			if (t.isMouse) {
				if (self.touches.length === 0) {
					self.buttons[0] = 0;
				} else {
					self.touches[0].isMouse = true;
					updateMouseFromTouch(self.touches[0]);
				}
			}
			if (self.onmouseup) {
				self.onmouseup(t.x, t.y);
			}
		});
	});
}
/**
 * Test whether the device supports touch events. This is useful to customize messages to say either "click" or "tap".
 * @returns {boolean}
 */
Mouse.prototype.supportsTouch = function() {
	return "ontouchstart" in window || navigator.msMaxTouchPoints;
};
/**
 * Test if a mouse button is currently pressed.
 * @param {number} button The button number to test. Button 0 is typically the left mouse button, as well as the first touch location.
 * @param {number} [x] The left edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
 * @param {number} [y] The top edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
 * @param {number} [width] The width of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
 * @param {number} [height] The height of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
 * @returns {boolean}
 */
Mouse.prototype.isPressed = function(button, x, y, width, height) {
	var b = this.buttons[button] >= 1;
	if (arguments.length > 1 && (this.x < x || this.x > x + width || this.y < y || this.y > y + height)) {
		b = false;
	}
	return b;
};
/**
 * Test if a mouse button is currently pressed, and was newly pressed down since the last call to consumePressed.
 * If you call this with button 0, it will add a `consumed:true` field to all current touches. This will help you prevent processing a touch multiple times.
 * @param {number} button The button number to test.
 * @param {number} [x] The left edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
 * @param {number} [y] The top edge of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
 * @param {number} [width] The width of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
 * @param {number} [height] The height of a rectangle to restrict the test to. If the mouse position is outside of this rectangle, the button will not be considered pressed.
 * @returns {boolean}
 */
Mouse.prototype.consumePressed = function(button, x, y, width, height) {
	var b = this.buttons[button] === 2;
	if (arguments.length > 1 && (this.x < x || this.x > x + width || this.y < y || this.y > y + height)) {
		b = false;
	}
	if (b) {
		this.buttons[button] = 1;
		if (button === 0) {
			for (var i = 0; i < this.touches.length; i++) {
				this.touches[i].consumed = true;
			}
		}
	}
	return b;
};

module.exports = Mouse;

},{"./platform":27}],24:[function(require,module,exports){
"use strict";

var buffer = require("./buffer");

function getContextForImage(image) {
	var ctx;
	buffer.makeBuffer(image.width, image.height, function(context) {
		context.drawImage(image, 0, 0, image.width, image.height);
		ctx = context;
	});
	return ctx;
}

/**
 * A stretchable image that has borders.
 * Similar to the [Android NinePatch]{@link https://developer.android.com/guide/topics/graphics/2d-graphics.html#nine-patch}, but it only has the lines on the bottom and right edges to denote the stretchable area.
 * A NinePatch is a normal picture, but has an extra 1-pixel wide column on the right edge and bottom edge. The extra column contains a black line that denotes the tileable center portion of the image. The lines are used to divide the image into nine tiles that can be automatically repeated to stretch the picture to any size without distortion.
 * @constructor
 * @alias Splat.NinePatch
 * @param {external:image} image The source image to make stretchable.
 */
function NinePatch(image) {
	this.img = image;
	var imgw = image.width - 1;
	var imgh = image.height - 1;

	var context = getContextForImage(image);
	var firstDiv = imgw;
	var secondDiv = imgw;
	var pixel;
	var alpha;
	for (var x = 0; x < imgw; x++) {
		pixel = context.getImageData(x, imgh, 1, 1).data;
		alpha = pixel[3];
		if (firstDiv === imgw && alpha > 0) {
			firstDiv = x;
		}
		if (firstDiv < imgw && alpha === 0) {
			secondDiv = x;
			break;
		}
	}
	this.w1 = firstDiv;
	this.w2 = secondDiv - firstDiv;
	this.w3 = imgw - secondDiv;

	firstDiv = secondDiv = imgh;
	for (var y = 0; y < imgh; y++) {
		pixel = context.getImageData(imgw, y, 1, 1).data;
		alpha = pixel[3];
		if (firstDiv === imgh && alpha > 0) {
			firstDiv = y;
		}
		if (firstDiv < imgh && alpha === 0) {
			secondDiv = y;
			break;
		}
	}
	this.h1 = firstDiv;
	this.h2 = secondDiv - firstDiv;
	this.h3 = imgh - secondDiv;
}
/**
 * Draw the image stretched to a given rectangle.
 * @param {external:CanvasRenderingContext2D} context The drawing context.
 * @param {number} x The left side of the rectangle.
 * @param {number} y The top of the rectangle.
 * @param {number} width The width of the rectangle.
 * @param {number} height The height of the rectangle.
 */
NinePatch.prototype.draw = function(context, x, y, width, height) {
	x = x|0;
	y = y|0;
	width = width |0;
	height = height |0;
	var cx, cy, w, h;

	for (cy = y + this.h1; cy < y + height - this.h3; cy += this.h2) {
		for (cx = x + this.w1; cx < x + width - this.w3; cx += this.w2) {
			w = Math.min(this.w2, x + width - this.w3 - cx);
			h = Math.min(this.h2, y + height - this.h3 - cy);
			context.drawImage(this.img, this.w1, this.h1, w, h, cx, cy, w, h);
		}
	}
	for (cy = y + this.h1; cy < y + height - this.h3; cy += this.h2) {
		h = Math.min(this.h2, y + height - this.h3 - cy);
		if (this.w1 > 0) {
			context.drawImage(this.img, 0,                 this.h1, this.w1, h, x,                   cy, this.w1, h);
		}
		if (this.w3 > 0) {
			context.drawImage(this.img, this.w1 + this.w2, this.h1, this.w3, h, x + width - this.w3, cy, this.w3, h);
		}
	}
	for (cx = x + this.w1; cx < x + width - this.w3; cx += this.w2) {
		w = Math.min(this.w2, x + width - this.w3 - cx);
		if (this.h1 > 0) {
			context.drawImage(this.img, this.w1, 0,                 w, this.h1, cx, y,                    w, this.h1);
		}
		if (this.h3 > 0) {
			context.drawImage(this.img, this.w1, this.w1 + this.w2, w, this.h3, cx, y + height - this.h3, w, this.h3);
		}
	}
	if (this.w1 > 0 && this.h1 > 0) {
		context.drawImage(this.img, 0, 0, this.w1, this.h1, x, y, this.w1, this.h1);
	}
	if (this.w3 > 0 && this.h1 > 0) {
		context.drawImage(this.img, this.w1 + this.w2, 0, this.w3, this.h1, x + width - this.w3, y, this.w3, this.h1);
	}
	if (this.w1 > 0 && this.h3 > 0) {
		context.drawImage(this.img, 0, this.h1 + this.h2, this.w1, this.h3, x, y + height - this.h3, this.w1, this.h3);
	}
	if (this.w3 > 0 && this.h3 > 0) {
		context.drawImage(this.img, this.w1 + this.w2, this.h1 + this.h2, this.w3, this.h3, x + width - this.w3, y + height - this.h3, this.w3, this.h3);
	}
};

module.exports = NinePatch;

},{"./buffer":9}],25:[function(require,module,exports){
"use strict";

var platform = require("./platform");

/**
 * Open a url in a new window.
 * @alias Splat.openUrl
 * @param {string} url The url to open in a new window.
 */
module.exports = function(url) {
	window.open(url);
};

if (platform.isEjecta()) {
	module.exports = function(url) {
		window.ejecta.openURL(url);
	};
}

},{"./platform":27}],26:[function(require,module,exports){
"use strict";

function Particles(max, setupParticle, drawParticle) {
	this.particles = [];
	this.setupParticle = setupParticle;
	this.drawParticle = drawParticle;
	for (var i = 0; i < max; i++) {
		var particle = {
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			enabled: false,
			age: 0
		};
		this.setupParticle(particle);
		this.particles.push(particle);
	}
	this.gravity = 0.1;
	this.maxAge = 1000;
}
Particles.prototype.move = function(elapsedMillis) {
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		if (!particle.enabled) {
			continue;
		}
		particle.age += elapsedMillis;
		if (particle.age > this.maxAge) {
			particle.enabled = false;
			continue;
		}
		particle.x += particle.vx * elapsedMillis;
		particle.y += particle.vy * elapsedMillis;
		particle.vy += this.gravity;
	}
};
Particles.prototype.draw = function(context) {
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];
		if (!particle.enabled) {
			continue;
		}
		this.drawParticle(context, particle);
	}
};
Particles.prototype.add = function(quantity, x, y, velocity, config) {
	var self = this;
	function setupParticle(particle) {
		particle.enabled = true;
		particle.age = 0;
		particle.x = x;
		particle.y = y;
		particle.vx = (Math.random() - 0.5) * velocity;
		particle.vy = (Math.random() - 0.5) * velocity;
		self.setupParticle(particle, config);
	}

	var particle;
	for (var i = 0; i < this.particles.length; i++) {
		particle = this.particles[i];
		if (particle.enabled) {
			continue;
		}
		if (quantity < 1) {
			return;
		}
		quantity--;
		setupParticle(particle);
	}

	// sort oldest first
	this.particles.sort(function(a, b) {
		return b.age - a.age;
	});

	for (i = 0; i < quantity; i++) {
		particle = this.particles[i];
		setupParticle(particle);
	}
};
Particles.prototype.reset = function() {
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].enabled = false;
	}
};

module.exports = Particles;

},{}],27:[function(require,module,exports){
"use strict";

module.exports = {
	isChromeApp: function() {
		return window.chrome && window.chrome.app && window.chrome.app.runtime;
	},
	isEjecta: function() {
		return window.ejecta;
	}
};

},{}],28:[function(require,module,exports){
"use strict";
/**
 * @namespace Splat.saveData
 */

var platform = require("./platform");

function cookieGet(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length === 2) {
		return parts.pop().split(";").shift();
	} else {
		throw "cookie " + name + " was not found";
	}
}

function cookieSet(name, value) {
	var expire = new Date();
	expire.setTime(expire.getTime() + 1000 * 60 * 60 * 24 * 365);
	var cookie = name + "=" + value + "; expires=" + expire.toUTCString() + ";";
	document.cookie = cookie;
}

function getMultiple(getSingleFunc, keys, callback) {
	if (typeof keys === "string") {
		keys = [keys];
	}

	try
	{
		var data = keys.map(function(key) {
			return [key, getSingleFunc(key)];
		}).reduce(function(accum, pair) {
			accum[pair[0]] = pair[1];
			return accum;
		}, {});

		callback(undefined, data);
	}
	catch (e) {
		callback(e);
	}
}

function setMultiple(setSingleFunc, data, callback) {
	try {
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				setSingleFunc(key, data[key]);
			}
		}
		callback();
	}
	catch (e) {
		callback(e);
	}
}

var cookieSaveData = {
	"get": getMultiple.bind(undefined, cookieGet),
	"set": setMultiple.bind(undefined, cookieSet)
};

function localStorageGet(name) {
	return window.localStorage.getItem(name);
}

function localStorageSet(name, value) {
	window.localStorage.setItem(name, value.toString());
}

var localStorageSaveData = {
	"get": getMultiple.bind(undefined, localStorageGet),
	"set": setMultiple.bind(undefined, localStorageSet)
};

/**
 * A function that is called when save data has finished being retrieved.
 * @callback saveDataGetFinished
 * @param {error} err If defined, err is the error that occurred when retrieving the data.
 * @param {object} data The key-value pairs of data that were previously saved.
 */
/**
 * Retrieve data previously stored with {@link Splat.saveData.set}.
 * @alias Splat.saveData.get
 * @param {string | Array} keys A single key or array of key names of data items to retrieve.
 * @param {saveDataGetFinished} callback A callback that is called with the data when it has been retrieved.
 */
function chromeStorageGet(keys, callback) {
	window.chrome.storage.sync.get(keys, function(data) {
		if (window.chrome.runtime.lastError) {
			callback(window.chrome.runtime.lastError);
		} else {
			callback(undefined, data);
		}
	});
}

/**
 * A function that is called when save data has finished being stored.
 * @callback saveDataSetFinished
 * @param {error} err If defined, err is the error that occurred when saving the data.
 */
/**
 * Store data for later.
 * @alias Splat.saveData.set
 * @param {object} data An object containing key-value pairs of data to save.
 * @param {saveDataSetFinished} callback A callback that is called when the data has finished saving.
 */
function chromeStorageSet(data, callback) {
	window.chrome.storage.sync.set(data, function() {
		callback(window.chrome.runtime.lastError);
	});
}

var chromeStorageSaveData = {
	"get": chromeStorageGet,
	"set": chromeStorageSet,
};

if (platform.isChromeApp()) {
	module.exports = chromeStorageSaveData;
} else if (window.localStorage) {
	module.exports = localStorageSaveData;
} else {
	module.exports = cookieSaveData;
}

},{"./platform":27}],29:[function(require,module,exports){
"use strict";

var Camera = require("./camera");

/**
 * A Scene handles the render loop for the game. Inside of initFunc, simulationFunc, and drawFunc `this` refers to the current scene.
 * @constructor
 * @alias Splat.Scene
 * @param {external:canvas} canvas The canvas to render on.
 * @param {emptyCallback} initFunc A callback to be called every time the Scene is {@link Splat.Scene#start started}.
 * @param {simulationCallback} simulationFunc A callback that updates the state of the game's simulation.
 * @param {drawCallback} drawFunc A callback that draws the game.
 */
function Scene(canvas, initFunc, simulationFunc, drawFunc) {
	/**
	 * The canvas to render on.
	 * @member {external:canvas}
	 * @private
	 */
	this.canvas = canvas;
	/**
	 * A callback to be called ever time the Scene is {@link Splat.Scene#start started}.
	 * @member {emptyCallback}
	 * @private
	 */
	this.initFunc = initFunc;
	/**
	 * A callback that updates the state of the game's simulation.
	 * @member {simulationCallback}
	 * @private
	 */
	this.simulationFunc = simulationFunc;
	/**
	 * A callback that draws the game.
	 * @member {drawCallback}
	 * @private
	 */
	this.drawFunc = drawFunc;

	/**
	 * The drawing context for {@link Scene#canvas}
	 * @member {external:CanvasRenderingContext2D}
	 * @private
	 */
	this.context = canvas.getContext("2d");
	/**
	 * The timestamp of the last frame. Used to determine how many milliseconds elapsed between frames.
	 * @member {number}
	 * @private
	 */
	this.lastTimestamp = -1;
	/**
	 * Whether or not the Scene is currently running.
	 * @member {boolean}
	 * @private
	 */
	this.running = false;
	/**
	 * A key-value store of named timers. Timers in this object will be automatically {@link Splat.Timer#tick tick()}ed for you when the scene is running..
	 * @member {object}
	 */
	this.timers = {};

	/**
	 * The Camera used to offset the Scene's drawing.
	 * This Camera's {@link Splat.Entity#move move} and {@link Splat.Camera#draw draw} methods are called automatically for you. The default Camera starts at the origin (0,0).
	 * @member {Splat.Camera}
	 */
	this.camera = new Camera(0, 0, canvas.width, canvas.height);
	/**
	 * A flag that enables/disables a frame rate counter in the corner of the screen. This is useful during development.
	 * @member {boolean}
	 */
	this.showFrameRate = false;
}
/**
 * Start running the scene.
 */
Scene.prototype.start = function() {
	this.lastTimestamp = -1;
	this.running = true;
	var scene = this;
	window.requestAnimationFrame(function(t) { mainLoop(scene, t); });
};
/**
 * Stop running the scene.
 */
Scene.prototype.stop = function() {
	this.running = false;
};
/**
 * Reset the simulation by re-running the {@link Splat.Scene#initFunc}.
 */
Scene.prototype.reset = function() {
	this.initFunc.call(this);
};

function mainLoop(scene, timestamp) {
	if (!scene.running) {
		return;
	}
	if (scene.lastTimestamp === -1) {
		scene.lastTimestamp = timestamp;
	}
	var elapsedMillis = timestamp - scene.lastTimestamp;
	scene.lastTimestamp = timestamp;

	incrementTimers(scene.timers, elapsedMillis);
	if (!scene.running) {
		return;
	}
	scene.simulationFunc.call(scene, elapsedMillis);
	scene.camera.move(elapsedMillis);

	scene.context.save();
	scene.camera.draw(scene.context);
	scene.drawFunc.call(scene, scene.context);

	if (scene.showFrameRate) {
		drawFrameRate(scene, elapsedMillis);
	}

	scene.context.restore();

	if (scene.running) {
		window.requestAnimationFrame(function(t) { mainLoop(scene, t); });
	}
}

function incrementTimers(timers, elapsedMillis) {
	for (var i in timers) {
		if (timers.hasOwnProperty(i)) {
			timers[i].tick(elapsedMillis);
		}
	}
}

function drawFrameRate(scene, elapsedMillis) {
	var fps = (1000 / elapsedMillis) |0;

	scene.context.font = "24px mono";
	if (fps < 30) {
		scene.context.fillStyle = "#ff0000";
	} else if (fps < 50) {
		scene.context.fillStyle = "#ffff00";
	} else {
		scene.context.fillStyle = "#00ff00";
	}
	var msg = fps + " FPS";
	var w = scene.context.measureText(msg).width;
	scene.camera.drawAbsolute(scene.context, function() {
		scene.context.fillText(msg, scene.canvas.width - w - 50, 50);
	});
}

module.exports = Scene;

},{"./camera":11}],30:[function(require,module,exports){
"use strict";

/**
 * Provides a way to switch between {@link Splat.Scene}s. An instance of SceneManager is available as {@link Splat.Game#scenes}.
 * @constructor
 */
function SceneManager() {
	/**
	 * A key-value list of all the named scenes.
	 * @member {object}
	 * @private
	 */
	this.scenes = {};
}
/**
 * Begin tracking a {@link Splat.Scene}.
 * @param {string} name The name of the {@link Splat.Scene} to be used later when you call {@link SceneManager#switchTo}.
 * @param {Splat.Scene} scene The Scene to track.
 */
SceneManager.prototype.add = function(name, scene) {
	this.scenes[name] = scene;
};
/**
 * Fetch a {@link Splat.Scene} that was previously stored with {@link SceneManager#add}.
 * @param {string} name The name that was provided when the {@link Splat.Scene} was stored during {@link SceneManager#add}.
 * @returns {Splat.Scene}
 */
SceneManager.prototype.get = function(name) {
	return this.scenes[name];
};
/**
 * Stop running the current {@link Splat.Scene}, and start running the named Scene.
 * @param {string} name The name that was providded when the {@link Splat.Scene} was stored during {@link SceneManager#add}.
 */
SceneManager.prototype.switchTo = function(name) {
	if (this.currentScene === this.scenes[name]) {
		this.currentScene.reset();
		return;
	}
	if (this.currentScene !== undefined) {
		this.currentScene.stop();
	}
	this.currentScene = this.scenes[name];
	this.currentScene.reset();
	this.currentScene.start();
};

module.exports = SceneManager;

},{}],31:[function(require,module,exports){
"use strict";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

/**
 * Loads sound files and lets you know when they're all available. An instance of SoundLoader is available as {@link Splat.Game#sounds}.
 * This implementation uses the Web Audio API, and if that is not available it automatically falls back to the HTML5 &lt;audio&gt; tag.
 * @constructor
 */
function SoundLoader() {
	/**
	 * The key-value object that stores named sounds.
	 * @member {object}
	 * @private
	 */
	this.sounds = {};
	/**
	 * The total number of sounds to be loaded.
	 * @member {number}
	 * @private
	 */
	this.totalSounds = 0;
	/**
	 * The number of sounds that have loaded completely.
	 * @member {number}
	 * @private
	 */
	this.loadedSounds = 0;
	/**
	 * A flag signifying if sounds have been muted through {@link SoundLoader#mute}.
	 * @member {boolean}
	 * @private
	 */
	this.muted = false;
	/**
	 * A key-value object that stores named looping sounds.
	 * @member {object}
	 * @private
	 */
	this.looping = {};

	/**
	 * The Web Audio API AudioContext
	 * @member {external:AudioContext}
	 * @private
	 */
	this.context = new window.AudioContext();

	this.gainNode = this.context.createGain();
	this.gainNode.connect(this.context.destination);
	this.volume = this.gainNode.gain.value;
}
/**
 * Load an audio file.
 * @param {string} name The name you want to use when you {@link SoundLoader#play} the sound.
 * @param {string} path The path of the sound file.
 */
SoundLoader.prototype.load = function(name, path) {
	var self = this;

	if (this.totalSounds === 0) {
		// safari on iOS mutes sounds until they're played in response to user input
		// play a dummy sound on first touch
		var firstTouchHandler = function() {
			window.removeEventListener("click", firstTouchHandler);
			window.removeEventListener("keydown", firstTouchHandler);
			window.removeEventListener("touchstart", firstTouchHandler);

			var source = self.context.createOscillator();
			source.connect(self.gainNode);
			source.start(0);
			source.stop(0);

			if (self.firstPlay) {
				self.play(self.firstPlay, self.firstPlayLoop);
			} else {
				self.firstPlay = "workaround";
			}
		};
		window.addEventListener("click", firstTouchHandler);
		window.addEventListener("keydown", firstTouchHandler);
		window.addEventListener("touchstart", firstTouchHandler);
	}

	this.totalSounds++;

	var request = new XMLHttpRequest();
	request.open("GET", path, true);
	request.responseType = "arraybuffer";
	request.addEventListener("readystatechange", function() {
		if (request.readyState !== 4) {
			return;
		}
		if (request.status !== 200 && request.status !== 0) {
			console.error("Error loading sound " + path);
			return;
		}
		self.context.decodeAudioData(request.response, function(buffer) {
			self.sounds[name] = buffer;
			self.loadedSounds++;
		}, function(err) {
			console.error("Error decoding audio data for " + path + ": " + err);
		});
	});
	request.addEventListener("error", function() {
		console.error("Error loading sound " + path);
	});
	try {
		request.send();
	} catch (e) {
		console.error("Error loading sound", path, e);
	}
};
/**
 * Test if all sounds have loaded.
 * @returns {boolean}
 */
SoundLoader.prototype.allLoaded = function() {
	return this.totalSounds === this.loadedSounds;
};
/**
 * Play a sound.
 * @param {string} name The name given to the sound during {@link SoundLoader#load}
 * @param {boolean} [loop=false] A flag denoting whether the sound should be looped. To stop a looped sound use {@link SoundLoader#stop}.
 */
SoundLoader.prototype.play = function(name, loop) {
	if (loop && this.looping[name]) {
		return;
	}
	if (!this.firstPlay) {
		// let the iOS user input workaround handle it
		this.firstPlay = name;
		this.firstPlayLoop = loop;
		return;
	}
	var snd = this.sounds[name];
	if (snd === undefined) {
		console.error("Unknown sound: " + name);
	}
	var source = this.context.createBufferSource();
	source.buffer = snd;
	source.connect(this.gainNode);
	if (loop) {
		source.loop = true;
		this.looping[name] = source;
	}
	source.start(0);
};
/**
 * Stop playing a sound. This currently only stops playing a sound that was looped earlier, and doesn't stop a sound mid-play. Patches welcome.
 * @param {string} name The name given to the sound during {@link SoundLoader#load}
 */
SoundLoader.prototype.stop = function(name) {
	if (!this.looping[name]) {
		return;
	}
	this.looping[name].stop();
	delete this.looping[name];
};
/**
 * Silence all sounds. Sounds keep playing, but at zero volume. Call {@link SoundLoader#unmute} to restore the previous volume level.
 */
SoundLoader.prototype.mute = function() {
	this.gainNode.gain.value = 0;
	this.muted = true;
};
/**
 * Restore volume to whatever value it was before {@link SoundLoader#mute} was called.
 */
SoundLoader.prototype.unmute = function() {
	this.gainNode.gain.value = this.volume;
	this.muted = false;
};
/**
 * Set the volume of all sounds.
 * @param {number} gain The desired volume level. A number between 0.0 and 1.0, with 0.0 being silent, and 1.0 being maximum volume.
 */
SoundLoader.prototype.setVolume = function(gain) {
	this.volume = gain;
	this.gainNode.gain  = gain;
	this.muted = false;
};
/**
 * Test if the volume is currently muted.
 * @return {boolean} True if the volume is currently muted.
 */
SoundLoader.prototype.isMuted = function() {
	return this.muted;
};

function AudioTagSoundLoader() {
	this.sounds = {};
	this.totalSounds = 0;
	this.loadedSounds = 0;
	this.muted = false;
	this.looping = {};
	this.volume = new Audio().volume;
}
AudioTagSoundLoader.prototype.load = function(name, path) {
	this.totalSounds++;

	var audio = new Audio();
	var self = this;
	audio.addEventListener("error", function() {
		console.error("Error loading sound " + path);
	});
	audio.addEventListener("canplaythrough", function() {
		self.sounds[name] = audio;
		self.loadedSounds++;
	});
	audio.volume = this.volume;
	audio.src = path;
	audio.load();
};
AudioTagSoundLoader.prototype.allLoaded = function() {
	return this.totalSounds === this.loadedSounds;
};
AudioTagSoundLoader.prototype.play = function(name, loop) {
	if (loop && this.looping[name]) {
		return;
	}
	var snd = this.sounds[name];
	if (snd === undefined) {
		console.error("Unknown sound: " + name);
	}
	if (loop) {
		snd.loop = true;
		this.looping[name] = snd;
	}
	snd.play();
};
AudioTagSoundLoader.prototype.stop = function(name) {
	var snd = this.looping[name];
	if (!snd) {
		return;
	}
	snd.loop = false;
	snd.pause();
	snd.currentTime = 0;
	delete this.looping[name];
};
function setAudioTagVolume(sounds, gain) {
	for (var name in sounds) {
		if (sounds.hasOwnProperty(name)) {
			sounds[name].volume = gain;
		}
	}
}
AudioTagSoundLoader.prototype.mute = function() {
	setAudioTagVolume(this.sounds, 0);
	this.muted = true;
};
AudioTagSoundLoader.prototype.unmute = function() {
	setAudioTagVolume(this.sounds, this.volume);
	this.muted = false;
};
AudioTagSoundLoader.prototype.setVolume = function(gain) {
	this.volume = gain;
	setAudioTagVolume(this.sounds, gain);
	this.muted = false;
};
AudioTagSoundLoader.prototype.isMuted = function() {
	return this.muted;
};


function FakeSoundLoader() {}
FakeSoundLoader.prototype.load = function() {};
FakeSoundLoader.prototype.allLoaded = function() { return true; };
FakeSoundLoader.prototype.play = function() {};
FakeSoundLoader.prototype.stop = function() {};
FakeSoundLoader.prototype.mute = function() {};
FakeSoundLoader.prototype.unmute = function() {};
FakeSoundLoader.prototype.setVolume = function() {};
FakeSoundLoader.prototype.isMuted = function() {
	return true;
};

if (window.AudioContext) {
	module.exports = SoundLoader;
} else if (window.Audio) {
	module.exports = AudioTagSoundLoader;
} else {
	console.log("This browser doesn't support the Web Audio API or the HTML5 audio tag.");
	module.exports = FakeSoundLoader;
}

},{}],32:[function(require,module,exports){
"use strict";

/**
 * A timer that calls callbacks while it is running, and when it expires.
 * @constructor
 * @alias Splat.Timer
 * @param {simulationCallback} onTick Called when the Timer is {@link Splat.Timer#tick tick()}ed
 * @param {number} expireMillis The number of milliseconds until the Timer expires
 * @param {emptyCallback} onExpire Called when the Timer expires
 */
function Timer(onTick, expireMillis, onExpire) {
	/**
	 * Called when the Timer is {@link Splat.Timer#tick tick()}ed
	 * @member {tickCallback}
	 * @private
	 */
	this.onTick = onTick;
	/**
	 * The number of milliseconds until the Timer expires.
	 * When {@link Splat.Timer#time} reaches this number, the Timer will be expired, and {@link Splat.Timer#onExpire} will be called.
	 * @member {number}
	 * @private
	 */
	this.expireMillis = expireMillis;
	/**
	 * Called when the Timer expires.
	 * @member {expireCallback}
	 * @private
	 */
	this.onExpire = onExpire;
	/**
	 * Whether or not the Timer is currently running.
	 * @member {boolean}
	 * @private
	 */
	this.running = false;
	/**
	 * How long the Timer has run in milliseconds.
	 * @member {number}
	 * @private
	 */
	this.time = 0;
}
/** 
 * Start the Timer running.
 * This does not {@link Splat.Timer#reset reset} the Timer!
 */
Timer.prototype.start = function() {
	this.running = true;
};
/** 
 * Stop the Timer.
 * This does not {@link Splat.Timer#reset reset} the Timer!
 */
Timer.prototype.stop = function() {
	this.running = false;
};
/**
 * Zeroes the timer.
 * This does not {@link Splat.Timer#stop stop} the Timer!
 */
Timer.prototype.reset = function() {
	this.time = 0;
};
/**
 * Advance the Timer.
 * Normally {@link Splat.Scene} does this for you.
 * @param {number} elapsedMillis How many milliseconds to advance the timer.
 */
Timer.prototype.tick = function(elapsedMillis) {
	if (!this.running) {
		return;
	}
	this.time += elapsedMillis;
	if (this.expired()) {
		this.stop();
		if (typeof this.onExpire === "function") {
			this.onExpire.call(this);
		}
		return;
	}

	if (typeof this.onTick === "function") {
		this.onTick.call(this, elapsedMillis);
	}
};
/**
 * Test if the Timer has expired.
 * @returns {boolean}
 */
Timer.prototype.expired = function() {
	return typeof this.expireMillis !== "undefined" && this.time >= this.expireMillis;
};

module.exports = Timer;

},{}],33:[function(require,module,exports){
/*
  https://github.com/banksean wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.
  
  If you want to use this as a substitute for Math.random(), use the random()
  method like so:
  
  var m = new MersenneTwister();
  var randomNumber = m.random();
  
  You can also call the other genrand_{foo}() methods on the instance.
 
  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:
 
  var m = new MersenneTwister(123);
 
  and that will always produce the same random sequence.
 
  Sean McCullough (banksean@gmail.com)
*/
 
/* 
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
 
   Before using, initialize the state by using init_seed(seed)  
   or init_by_array(init_key, key_length).
 
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.                          
 
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
 
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
 
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
 
     3. The names of its contributors may not be used to endorse or promote 
        products derived from this software without specific prior written 
        permission.
 
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
 
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/
 
var MersenneTwister = function(seed) {
	if (seed == undefined) {
		seed = new Date().getTime();
	} 

	/* Period parameters */  
	this.N = 624;
	this.M = 397;
	this.MATRIX_A = 0x9908b0df;   /* constant vector a */
	this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
	this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

	this.mt = new Array(this.N); /* the array for the state vector */
	this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

	this.init_seed(seed);
}  

/* initializes mt[N] with a seed */
/* origin name init_genrand */
MersenneTwister.prototype.init_seed = function(s) {
	this.mt[0] = s >>> 0;
	for (this.mti=1; this.mti<this.N; this.mti++) {
		var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
		this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
		+ this.mti;
		/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
		/* In the previous versions, MSBs of the seed affect   */
		/* only MSBs of the array mt[].                        */
		/* 2002/01/09 modified by Makoto Matsumoto             */
		this.mt[this.mti] >>>= 0;
		/* for >32 bit machines */
	}
}

/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
	var i, j, k;
	this.init_seed(19650218);
	i=1; j=0;
	k = (this.N>key_length ? this.N : key_length);
	for (; k; k--) {
		var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
		this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
		+ init_key[j] + j; /* non linear */
		this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
		i++; j++;
		if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
		if (j>=key_length) j=0;
	}
	for (k=this.N-1; k; k--) {
		var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
		this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
		- i; /* non linear */
		this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
		i++;
		if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
	}

	this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */ 
}

/* generates a random number on [0,0xffffffff]-interval */
/* origin name genrand_int32 */
MersenneTwister.prototype.random_int = function() {
	var y;
	var mag01 = new Array(0x0, this.MATRIX_A);
	/* mag01[x] = x * MATRIX_A  for x=0,1 */

	if (this.mti >= this.N) { /* generate N words at one time */
		var kk;

		if (this.mti == this.N+1)  /* if init_seed() has not been called, */
			this.init_seed(5489);  /* a default initial seed is used */

		for (kk=0;kk<this.N-this.M;kk++) {
			y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
			this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
		}
		for (;kk<this.N-1;kk++) {
			y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
			this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
		}
		y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
		this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

		this.mti = 0;
	}

	y = this.mt[this.mti++];

	/* Tempering */
	y ^= (y >>> 11);
	y ^= (y << 7) & 0x9d2c5680;
	y ^= (y << 15) & 0xefc60000;
	y ^= (y >>> 18);

	return y >>> 0;
}

/* generates a random number on [0,0x7fffffff]-interval */
/* origin name genrand_int31 */
MersenneTwister.prototype.random_int31 = function() {
	return (this.random_int()>>>1);
}

/* generates a random number on [0,1]-real-interval */
/* origin name genrand_real1 */
MersenneTwister.prototype.random_incl = function() {
	return this.random_int()*(1.0/4294967295.0); 
	/* divided by 2^32-1 */ 
}

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function() {
	return this.random_int()*(1.0/4294967296.0); 
	/* divided by 2^32 */
}

/* generates a random number on (0,1)-real-interval */
/* origin name genrand_real3 */
MersenneTwister.prototype.random_excl = function() {
	return (this.random_int() + 0.5)*(1.0/4294967296.0); 
	/* divided by 2^32 */
}

/* generates a random number on [0,1) with 53-bit resolution*/
/* origin name genrand_res53 */
MersenneTwister.prototype.random_long = function() { 
	var a=this.random_int()>>>5, b=this.random_int()>>>6; 
	return(a*67108864.0+b)*(1.0/9007199254740992.0); 
} 

/* These real versions are due to Isaku Wada, 2002/01/09 added */

module.exports = MersenneTwister;

},{}],34:[function(require,module,exports){
(function(namespace) {
	
	var isIE = /MSIE/i.test(navigator.userAgent),
		ieVer = null;
	
	// Get Internet Explorer version
	if (isIE) {
		var re, result;
		re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
		result = re.exec(navigator.userAgent);
		if (result !== null) {
			ieVer = parseFloat(result[1]);
		}
	}
	
	/**
	 * FontLoader detects when web fonts specified in the "fontFamiliesArray" array were loaded and rendered. Then it
	 * notifies the specified delegate object via "fontLoaded" and "fontsLoaded" methods when specific or all fonts were
	 * loaded respectively. The use of this functions implies that the insertion of specified web fonts into the
	 * document is done elsewhere.
	 * 
	 * If timeout (default 3000ms) is reached before all fonts were loaded and rendered, then "fontsLoaded" delegate
	 * method is invoked with an error object as its single parameter. The error object has two fields: the "message"
	 * field holding the error description and the "notLoadedFontFamilies" field holding an array with all the
	 * font-families that weren't loaded. Otherwise the parameter is null.
	 *
	 * @param {Array}     fontFamiliesArray       Array of font-family strings.
	 * @param {Object}    delegate                Delegate object whose delegate methods will be invoked in its own context.
	 * @param {Function}  [delegate.fontsLoaded]  Delegate method invoked after all fonts are loaded or timeout is reached.
	 * @param {Function}  [delegate.fontLoaded]   Delegate method invoked for each loaded font with its font-family string as its single parameter.
	 * @param {Number}    [timeout=3000]          Timeout in milliseconds. Pass "null" to disable timeout.
	 * @constructor
	 */
	function FontLoader(fontFamiliesArray, delegate, timeout) {
		// Public
		this.delegate = delegate;
		this.timeout = (typeof timeout !== "undefined") ? timeout : 3000;

		// Private
		this._fontFamiliesArray = fontFamiliesArray.slice(0);
		this._testContainer = null;
		this._adobeBlankSizeWatcher = null;
		this._timeoutId = null;
		this._intervalId = null;
		this._intervalDelay = 50;
		this._numberOfLoadedFonts = 0;
		this._numberOfFontFamilies = this._fontFamiliesArray.length;
		this._fontsMap = {};
		this._finished = false;
	}

	namespace.FontLoader = FontLoader;
	
	FontLoader.testDiv = null;
	FontLoader.useAdobeBlank = !isIE || ieVer >= 11.0;
	FontLoader.useResizeEvent = isIE && ieVer < 11.0 && typeof document.attachEvent !== "undefined";
	FontLoader.useIntervalChecking = window.opera || (isIE && ieVer < 11.0 && !FontLoader.useResizeEvent);
	FontLoader.referenceText = " !\"\\#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
	FontLoader.referenceFontFamilies = FontLoader.useAdobeBlank ? ["AdobeBlank"] : ["serif", "cursive"];
	FontLoader.referenceFontFamiliesSizes = [];
	FontLoader.adobeBlankFontFaceRule = "@font-face{ font-family:AdobeBlank; src:url('data:font/opentype;base64,T1RUTwAKAIAAAwAgQ0ZGIM6ZbkwAAEPEAAAZM0RTSUcAAAABAABtAAAAAAhPUy8yAR6vMwAAARAAAABgY21hcDqI98oAACjEAAAa4GhlYWT+BQILAAAArAAAADZoaGVhCCID7wAAAOQAAAAkaG10eAPoAHwAAFz4AAAQBm1heHAIAVAAAAABCAAAAAZuYW1lD/tWxwAAAXAAACdScG9zdP+4ADIAAEOkAAAAIAABAAAAAQj1Snw1O18PPPUAAwPoAAAAAM2C2p8AAAAAzYLanwB8/4gDbANwAAAAAwACAAAAAAAAAAEAAANw/4gAyAPoAHwAfANsAAEAAAAAAAAAAAAAAAAAAAACAABQAAgBAAAABAAAAZAABQAAAooCWAAAAEsCigJYAAABXgAyANwAAAAAAAAAAAAAAAD3/67/+9///w/gAD8AAAAAQURCRQHAAAD//wNw/4gAyANwAHhgLwH/AAAAAAAAAAAAAAAgAAAAAAARANIAAQAAAAAAAQALAAAAAQAAAAAAAgAHAAsAAQAAAAAAAwAbABIAAQAAAAAABAALAAAAAQAAAAAABQA5AC0AAQAAAAAABgAKAGYAAwABBAkAAABuAHAAAwABBAkAAQAWAN4AAwABBAkAAgAOAPQAAwABBAkAAwA2AQIAAwABBAkABAAWAN4AAwABBAkABQByATgAAwABBAkABgAUAaoAAwABBAkACAA0Ab4AAwABBAkACwA0AfIAAwABBAkADSQSAiYAAwABBAkADgBIJjhBZG9iZSBCbGFua1JlZ3VsYXIxLjAzNTtBREJFO0Fkb2JlQmxhbms7QURPQkVWZXJzaW9uIDEuMDM1O1BTIDEuMDAzO2hvdGNvbnYgMS4wLjcwO21ha2VvdGYubGliMi41LjU5MDBBZG9iZUJsYW5rAKkAIAAyADAAMQAzACAAQQBkAG8AYgBlACAAUwB5AHMAdABlAG0AcwAgAEkAbgBjAG8AcgBwAG8AcgBhAHQAZQBkAC4AIABBAGwAbAAgAFIAaQBnAGgAdABzACAAUgBlAHMAZQByAHYAZQBkAC4AQQBkAG8AYgBlACAAQgBsAGEAbgBrAFIAZQBnAHUAbABhAHIAMQAuADAAMwA1ADsAQQBEAEIARQA7AEEAZABvAGIAZQBCAGwAYQBuAGsAOwBBAEQATwBCAEUAVgBlAHIAcwBpAG8AbgAgADEALgAwADMANQA7AFAAUwAgADEALgAwADAAMwA7AGgAbwB0AGMAbwBuAHYAIAAxAC4AMAAuADcAMAA7AG0AYQBrAGUAbwB0AGYALgBsAGkAYgAyAC4ANQAuADUAOQAwADAAQQBkAG8AYgBlAEIAbABhAG4AawBBAGQAbwBiAGUAIABTAHkAcwB0AGUAbQBzACAASQBuAGMAbwByAHAAbwByAGEAdABlAGQAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGEAZABvAGIAZQAuAGMAbwBtAC8AdAB5AHAAZQAvAEEAZABvAGIAZQAgAEIAbABhAG4AawAgAGkAcwAgAHIAZQBsAGUAYQBzAGUAZAAgAHUAbgBkAGUAcgAgAHQAaABlACAAUwBJAEwAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUAIAAtACAAcABsAGUAYQBzAGUAIAByAGUAYQBkACAAaQB0ACAAYwBhAHIAZQBmAHUAbABsAHkAIABhAG4AZAAgAGQAbwAgAG4AbwB0ACAAZABvAHcAbgBsAG8AYQBkACAAdABoAGUAIABmAG8AbgB0AHMAIAB1AG4AbABlAHMAcwAgAHkAbwB1ACAAYQBnAHIAZQBlACAAdABvACAAdABoAGUAIAB0AGgAZQAgAHQAZQByAG0AcwAgAG8AZgAgAHQAaABlACAAbABpAGMAZQBuAHMAZQA6AA0ACgANAAoAQwBvAHAAeQByAGkAZwBoAHQAIACpACAAMgAwADEAMwAgAEEAZABvAGIAZQAgAFMAeQBzAHQAZQBtAHMAIABJAG4AYwBvAHIAcABvAHIAYQB0AGUAZAAgACgAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGEAZABvAGIAZQAuAGMAbwBtAC8AKQAsACAAdwBpAHQAaAAgAFIAZQBzAGUAcgB2AGUAZAAgAEYAbwBuAHQAIABOAGEAbQBlACAAQQBkAG8AYgBlACAAQgBsAGEAbgBrAA0ACgANAAoAVABoAGkAcwAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUAIABpAHMAIABsAGkAYwBlAG4AcwBlAGQAIAB1AG4AZABlAHIAIAB0AGgAZQAgAFMASQBMACAATwBwAGUAbgAgAEYAbwBuAHQAIABMAGkAYwBlAG4AcwBlACwAIABWAGUAcgBzAGkAbwBuACAAMQAuADEALgANAAoADQAKAFQAaABpAHMAIABsAGkAYwBlAG4AcwBlACAAaQBzACAAYwBvAHAAaQBlAGQAIABiAGUAbABvAHcALAAgAGEAbgBkACAAaQBzACAAYQBsAHMAbwAgAGEAdgBhAGkAbABhAGIAbABlACAAdwBpAHQAaAAgAGEAIABGAEEAUQAgAGEAdAA6ACAAaAB0AHQAcAA6AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIAZwAvAE8ARgBMAA0ACgANAAoALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAA0ACgBTAEkATAAgAE8AUABFAE4AIABGAE8ATgBUACAATABJAEMARQBOAFMARQAgAFYAZQByAHMAaQBvAG4AIAAxAC4AMQAgAC0AIAAyADYAIABGAGUAYgByAHUAYQByAHkAIAAyADAAMAA3AA0ACgAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ADQAKAA0ACgBQAFIARQBBAE0AQgBMAEUADQAKAFQAaABlACAAZwBvAGEAbABzACAAbwBmACAAdABoAGUAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUAIAAoAE8ARgBMACkAIABhAHIAZQAgAHQAbwAgAHMAdABpAG0AdQBsAGEAdABlACAAdwBvAHIAbABkAHcAaQBkAGUAIABkAGUAdgBlAGwAbwBwAG0AZQBuAHQAIABvAGYAIABjAG8AbABsAGEAYgBvAHIAYQB0AGkAdgBlACAAZgBvAG4AdAAgAHAAcgBvAGoAZQBjAHQAcwAsACAAdABvACAAcwB1AHAAcABvAHIAdAAgAHQAaABlACAAZgBvAG4AdAAgAGMAcgBlAGEAdABpAG8AbgAgAGUAZgBmAG8AcgB0AHMAIABvAGYAIABhAGMAYQBkAGUAbQBpAGMAIABhAG4AZAAgAGwAaQBuAGcAdQBpAHMAdABpAGMAIABjAG8AbQBtAHUAbgBpAHQAaQBlAHMALAAgAGEAbgBkACAAdABvACAAcAByAG8AdgBpAGQAZQAgAGEAIABmAHIAZQBlACAAYQBuAGQAIABvAHAAZQBuACAAZgByAGEAbQBlAHcAbwByAGsAIABpAG4AIAB3AGgAaQBjAGgAIABmAG8AbgB0AHMAIABtAGEAeQAgAGIAZQAgAHMAaABhAHIAZQBkACAAYQBuAGQAIABpAG0AcAByAG8AdgBlAGQAIABpAG4AIABwAGEAcgB0AG4AZQByAHMAaABpAHAAIAB3AGkAdABoACAAbwB0AGgAZQByAHMALgANAAoADQAKAFQAaABlACAATwBGAEwAIABhAGwAbABvAHcAcwAgAHQAaABlACAAbABpAGMAZQBuAHMAZQBkACAAZgBvAG4AdABzACAAdABvACAAYgBlACAAdQBzAGUAZAAsACAAcwB0AHUAZABpAGUAZAAsACAAbQBvAGQAaQBmAGkAZQBkACAAYQBuAGQAIAByAGUAZABpAHMAdAByAGkAYgB1AHQAZQBkACAAZgByAGUAZQBsAHkAIABhAHMAIABsAG8AbgBnACAAYQBzACAAdABoAGUAeQAgAGEAcgBlACAAbgBvAHQAIABzAG8AbABkACAAYgB5ACAAdABoAGUAbQBzAGUAbAB2AGUAcwAuACAAVABoAGUAIABmAG8AbgB0AHMALAAgAGkAbgBjAGwAdQBkAGkAbgBnACAAYQBuAHkAIABkAGUAcgBpAHYAYQB0AGkAdgBlACAAdwBvAHIAawBzACwAIABjAGEAbgAgAGIAZQAgAGIAdQBuAGQAbABlAGQALAAgAGUAbQBiAGUAZABkAGUAZAAsACAAcgBlAGQAaQBzAHQAcgBpAGIAdQB0AGUAZAAgAGEAbgBkAC8AbwByACAAcwBvAGwAZAAgAHcAaQB0AGgAIABhAG4AeQAgAHMAbwBmAHQAdwBhAHIAZQAgAHAAcgBvAHYAaQBkAGUAZAAgAHQAaABhAHQAIABhAG4AeQAgAHIAZQBzAGUAcgB2AGUAZAAgAG4AYQBtAGUAcwAgAGEAcgBlACAAbgBvAHQAIAB1AHMAZQBkACAAYgB5ACAAZABlAHIAaQB2AGEAdABpAHYAZQAgAHcAbwByAGsAcwAuACAAVABoAGUAIABmAG8AbgB0AHMAIABhAG4AZAAgAGQAZQByAGkAdgBhAHQAaQB2AGUAcwAsACAAaABvAHcAZQB2AGUAcgAsACAAYwBhAG4AbgBvAHQAIABiAGUAIAByAGUAbABlAGEAcwBlAGQAIAB1AG4AZABlAHIAIABhAG4AeQAgAG8AdABoAGUAcgAgAHQAeQBwAGUAIABvAGYAIABsAGkAYwBlAG4AcwBlAC4AIABUAGgAZQAgAHIAZQBxAHUAaQByAGUAbQBlAG4AdAAgAGYAbwByACAAZgBvAG4AdABzACAAdABvACAAcgBlAG0AYQBpAG4AIAB1AG4AZABlAHIAIAB0AGgAaQBzACAAbABpAGMAZQBuAHMAZQAgAGQAbwBlAHMAIABuAG8AdAAgAGEAcABwAGwAeQAgAHQAbwAgAGEAbgB5ACAAZABvAGMAdQBtAGUAbgB0ACAAYwByAGUAYQB0AGUAZAAgAHUAcwBpAG4AZwAgAHQAaABlACAAZgBvAG4AdABzACAAbwByACAAdABoAGUAaQByACAAZABlAHIAaQB2AGEAdABpAHYAZQBzAC4ADQAKAA0ACgBEAEUARgBJAE4ASQBUAEkATwBOAFMADQAKACIARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAiACAAcgBlAGYAZQByAHMAIAB0AG8AIAB0AGgAZQAgAHMAZQB0ACAAbwBmACAAZgBpAGwAZQBzACAAcgBlAGwAZQBhAHMAZQBkACAAYgB5ACAAdABoAGUAIABDAG8AcAB5AHIAaQBnAGgAdAAgAEgAbwBsAGQAZQByACgAcwApACAAdQBuAGQAZQByACAAdABoAGkAcwAgAGwAaQBjAGUAbgBzAGUAIABhAG4AZAAgAGMAbABlAGEAcgBsAHkAIABtAGEAcgBrAGUAZAAgAGEAcwAgAHMAdQBjAGgALgAgAFQAaABpAHMAIABtAGEAeQAgAGkAbgBjAGwAdQBkAGUAIABzAG8AdQByAGMAZQAgAGYAaQBsAGUAcwAsACAAYgB1AGkAbABkACAAcwBjAHIAaQBwAHQAcwAgAGEAbgBkACAAZABvAGMAdQBtAGUAbgB0AGEAdABpAG8AbgAuAA0ACgANAAoAIgBSAGUAcwBlAHIAdgBlAGQAIABGAG8AbgB0ACAATgBhAG0AZQAiACAAcgBlAGYAZQByAHMAIAB0AG8AIABhAG4AeQAgAG4AYQBtAGUAcwAgAHMAcABlAGMAaQBmAGkAZQBkACAAYQBzACAAcwB1AGMAaAAgAGEAZgB0AGUAcgAgAHQAaABlACAAYwBvAHAAeQByAGkAZwBoAHQAIABzAHQAYQB0AGUAbQBlAG4AdAAoAHMAKQAuAA0ACgANAAoAIgBPAHIAaQBnAGkAbgBhAGwAIABWAGUAcgBzAGkAbwBuACIAIAByAGUAZgBlAHIAcwAgAHQAbwAgAHQAaABlACAAYwBvAGwAbABlAGMAdABpAG8AbgAgAG8AZgAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUAIABjAG8AbQBwAG8AbgBlAG4AdABzACAAYQBzACAAZABpAHMAdAByAGkAYgB1AHQAZQBkACAAYgB5ACAAdABoAGUAIABDAG8AcAB5AHIAaQBnAGgAdAAgAEgAbwBsAGQAZQByACgAcwApAC4ADQAKAA0ACgAiAE0AbwBkAGkAZgBpAGUAZAAgAFYAZQByAHMAaQBvAG4AIgAgAHIAZQBmAGUAcgBzACAAdABvACAAYQBuAHkAIABkAGUAcgBpAHYAYQB0AGkAdgBlACAAbQBhAGQAZQAgAGIAeQAgAGEAZABkAGkAbgBnACAAdABvACwAIABkAGUAbABlAHQAaQBuAGcALAAgAG8AcgAgAHMAdQBiAHMAdABpAHQAdQB0AGkAbgBnACAALQAtACAAaQBuACAAcABhAHIAdAAgAG8AcgAgAGkAbgAgAHcAaABvAGwAZQAgAC0ALQAgAGEAbgB5ACAAbwBmACAAdABoAGUAIABjAG8AbQBwAG8AbgBlAG4AdABzACAAbwBmACAAdABoAGUAIABPAHIAaQBnAGkAbgBhAGwAIABWAGUAcgBzAGkAbwBuACwAIABiAHkAIABjAGgAYQBuAGcAaQBuAGcAIABmAG8AcgBtAGEAdABzACAAbwByACAAYgB5ACAAcABvAHIAdABpAG4AZwAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAHQAbwAgAGEAIABuAGUAdwAgAGUAbgB2AGkAcgBvAG4AbQBlAG4AdAAuAA0ACgANAAoAIgBBAHUAdABoAG8AcgAiACAAcgBlAGYAZQByAHMAIAB0AG8AIABhAG4AeQAgAGQAZQBzAGkAZwBuAGUAcgAsACAAZQBuAGcAaQBuAGUAZQByACwAIABwAHIAbwBnAHIAYQBtAG0AZQByACwAIAB0AGUAYwBoAG4AaQBjAGEAbAAgAHcAcgBpAHQAZQByACAAbwByACAAbwB0AGgAZQByACAAcABlAHIAcwBvAG4AIAB3AGgAbwAgAGMAbwBuAHQAcgBpAGIAdQB0AGUAZAAgAHQAbwAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAuAA0ACgANAAoAUABFAFIATQBJAFMAUwBJAE8ATgAgACYAIABDAE8ATgBEAEkAVABJAE8ATgBTAA0ACgBQAGUAcgBtAGkAcwBzAGkAbwBuACAAaQBzACAAaABlAHIAZQBiAHkAIABnAHIAYQBuAHQAZQBkACwAIABmAHIAZQBlACAAbwBmACAAYwBoAGEAcgBnAGUALAAgAHQAbwAgAGEAbgB5ACAAcABlAHIAcwBvAG4AIABvAGIAdABhAGkAbgBpAG4AZwAgAGEAIABjAG8AcAB5ACAAbwBmACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACwAIAB0AG8AIAB1AHMAZQAsACAAcwB0AHUAZAB5ACwAIABjAG8AcAB5ACwAIABtAGUAcgBnAGUALAAgAGUAbQBiAGUAZAAsACAAbQBvAGQAaQBmAHkALAAgAHIAZQBkAGkAcwB0AHIAaQBiAHUAdABlACwAIABhAG4AZAAgAHMAZQBsAGwAIABtAG8AZABpAGYAaQBlAGQAIABhAG4AZAAgAHUAbgBtAG8AZABpAGYAaQBlAGQAIABjAG8AcABpAGUAcwAgAG8AZgAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAsACAAcwB1AGIAagBlAGMAdAAgAHQAbwAgAHQAaABlACAAZgBvAGwAbABvAHcAaQBuAGcAIABjAG8AbgBkAGkAdABpAG8AbgBzADoADQAKAA0ACgAxACkAIABOAGUAaQB0AGgAZQByACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAbgBvAHIAIABhAG4AeQAgAG8AZgAgAGkAdABzACAAaQBuAGQAaQB2AGkAZAB1AGEAbAAgAGMAbwBtAHAAbwBuAGUAbgB0AHMALAAgAGkAbgAgAE8AcgBpAGcAaQBuAGEAbAAgAG8AcgAgAE0AbwBkAGkAZgBpAGUAZAAgAFYAZQByAHMAaQBvAG4AcwAsACAAbQBhAHkAIABiAGUAIABzAG8AbABkACAAYgB5ACAAaQB0AHMAZQBsAGYALgANAAoADQAKADIAKQAgAE8AcgBpAGcAaQBuAGEAbAAgAG8AcgAgAE0AbwBkAGkAZgBpAGUAZAAgAFYAZQByAHMAaQBvAG4AcwAgAG8AZgAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAG0AYQB5ACAAYgBlACAAYgB1AG4AZABsAGUAZAAsACAAcgBlAGQAaQBzAHQAcgBpAGIAdQB0AGUAZAAgAGEAbgBkAC8AbwByACAAcwBvAGwAZAAgAHcAaQB0AGgAIABhAG4AeQAgAHMAbwBmAHQAdwBhAHIAZQAsACAAcAByAG8AdgBpAGQAZQBkACAAdABoAGEAdAAgAGUAYQBjAGgAIABjAG8AcAB5ACAAYwBvAG4AdABhAGkAbgBzACAAdABoAGUAIABhAGIAbwB2AGUAIABjAG8AcAB5AHIAaQBnAGgAdAAgAG4AbwB0AGkAYwBlACAAYQBuAGQAIAB0AGgAaQBzACAAbABpAGMAZQBuAHMAZQAuACAAVABoAGUAcwBlACAAYwBhAG4AIABiAGUAIABpAG4AYwBsAHUAZABlAGQAIABlAGkAdABoAGUAcgAgAGEAcwAgAHMAdABhAG4AZAAtAGEAbABvAG4AZQAgAHQAZQB4AHQAIABmAGkAbABlAHMALAAgAGgAdQBtAGEAbgAtAHIAZQBhAGQAYQBiAGwAZQAgAGgAZQBhAGQAZQByAHMAIABvAHIAIABpAG4AIAB0AGgAZQAgAGEAcABwAHIAbwBwAHIAaQBhAHQAZQAgAG0AYQBjAGgAaQBuAGUALQByAGUAYQBkAGEAYgBsAGUAIABtAGUAdABhAGQAYQB0AGEAIABmAGkAZQBsAGQAcwAgAHcAaQB0AGgAaQBuACAAdABlAHgAdAAgAG8AcgAgAGIAaQBuAGEAcgB5ACAAZgBpAGwAZQBzACAAYQBzACAAbABvAG4AZwAgAGEAcwAgAHQAaABvAHMAZQAgAGYAaQBlAGwAZABzACAAYwBhAG4AIABiAGUAIABlAGEAcwBpAGwAeQAgAHYAaQBlAHcAZQBkACAAYgB5ACAAdABoAGUAIAB1AHMAZQByAC4ADQAKAA0ACgAzACkAIABOAG8AIABNAG8AZABpAGYAaQBlAGQAIABWAGUAcgBzAGkAbwBuACAAbwBmACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAbQBhAHkAIAB1AHMAZQAgAHQAaABlACAAUgBlAHMAZQByAHYAZQBkACAARgBvAG4AdAAgAE4AYQBtAGUAKABzACkAIAB1AG4AbABlAHMAcwAgAGUAeABwAGwAaQBjAGkAdAAgAHcAcgBpAHQAdABlAG4AIABwAGUAcgBtAGkAcwBzAGkAbwBuACAAaQBzACAAZwByAGEAbgB0AGUAZAAgAGIAeQAgAHQAaABlACAAYwBvAHIAcgBlAHMAcABvAG4AZABpAG4AZwAgAEMAbwBwAHkAcgBpAGcAaAB0ACAASABvAGwAZABlAHIALgAgAFQAaABpAHMAIAByAGUAcwB0AHIAaQBjAHQAaQBvAG4AIABvAG4AbAB5ACAAYQBwAHAAbABpAGUAcwAgAHQAbwAgAHQAaABlACAAcAByAGkAbQBhAHIAeQAgAGYAbwBuAHQAIABuAGEAbQBlACAAYQBzACAAcAByAGUAcwBlAG4AdABlAGQAIAB0AG8AIAB0AGgAZQAgAHUAcwBlAHIAcwAuAA0ACgANAAoANAApACAAVABoAGUAIABuAGEAbQBlACgAcwApACAAbwBmACAAdABoAGUAIABDAG8AcAB5AHIAaQBnAGgAdAAgAEgAbwBsAGQAZQByACgAcwApACAAbwByACAAdABoAGUAIABBAHUAdABoAG8AcgAoAHMAKQAgAG8AZgAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAHMAaABhAGwAbAAgAG4AbwB0ACAAYgBlACAAdQBzAGUAZAAgAHQAbwAgAHAAcgBvAG0AbwB0AGUALAAgAGUAbgBkAG8AcgBzAGUAIABvAHIAIABhAGQAdgBlAHIAdABpAHMAZQAgAGEAbgB5ACAATQBvAGQAaQBmAGkAZQBkACAAVgBlAHIAcwBpAG8AbgAsACAAZQB4AGMAZQBwAHQAIAB0AG8AIABhAGMAawBuAG8AdwBsAGUAZABnAGUAIAB0AGgAZQAgAGMAbwBuAHQAcgBpAGIAdQB0AGkAbwBuACgAcwApACAAbwBmACAAdABoAGUAIABDAG8AcAB5AHIAaQBnAGgAdAAgAEgAbwBsAGQAZQByACgAcwApACAAYQBuAGQAIAB0AGgAZQAgAEEAdQB0AGgAbwByACgAcwApACAAbwByACAAdwBpAHQAaAAgAHQAaABlAGkAcgAgAGUAeABwAGwAaQBjAGkAdAAgAHcAcgBpAHQAdABlAG4AIABwAGUAcgBtAGkAcwBzAGkAbwBuAC4ADQAKAA0ACgA1ACkAIABUAGgAZQAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUALAAgAG0AbwBkAGkAZgBpAGUAZAAgAG8AcgAgAHUAbgBtAG8AZABpAGYAaQBlAGQALAAgAGkAbgAgAHAAYQByAHQAIABvAHIAIABpAG4AIAB3AGgAbwBsAGUALAAgAG0AdQBzAHQAIABiAGUAIABkAGkAcwB0AHIAaQBiAHUAdABlAGQAIABlAG4AdABpAHIAZQBsAHkAIAB1AG4AZABlAHIAIAB0AGgAaQBzACAAbABpAGMAZQBuAHMAZQAsACAAYQBuAGQAIABtAHUAcwB0ACAAbgBvAHQAIABiAGUAIABkAGkAcwB0AHIAaQBiAHUAdABlAGQAIAB1AG4AZABlAHIAIABhAG4AeQAgAG8AdABoAGUAcgAgAGwAaQBjAGUAbgBzAGUALgAgAFQAaABlACAAcgBlAHEAdQBpAHIAZQBtAGUAbgB0ACAAZgBvAHIAIABmAG8AbgB0AHMAIAB0AG8AIAByAGUAbQBhAGkAbgAgAHUAbgBkAGUAcgAgAHQAaABpAHMAIABsAGkAYwBlAG4AcwBlACAAZABvAGUAcwAgAG4AbwB0ACAAYQBwAHAAbAB5ACAAdABvACAAYQBuAHkAIABkAG8AYwB1AG0AZQBuAHQAIABjAHIAZQBhAHQAZQBkACAAdQBzAGkAbgBnACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlAC4ADQAKAA0ACgBUAEUAUgBNAEkATgBBAFQASQBPAE4ADQAKAFQAaABpAHMAIABsAGkAYwBlAG4AcwBlACAAYgBlAGMAbwBtAGUAcwAgAG4AdQBsAGwAIABhAG4AZAAgAHYAbwBpAGQAIABpAGYAIABhAG4AeQAgAG8AZgAgAHQAaABlACAAYQBiAG8AdgBlACAAYwBvAG4AZABpAHQAaQBvAG4AcwAgAGEAcgBlACAAbgBvAHQAIABtAGUAdAAuAA0ACgANAAoARABJAFMAQwBMAEEASQBNAEUAUgANAAoAVABIAEUAIABGAE8ATgBUACAAUwBPAEYAVABXAEEAUgBFACAASQBTACAAUABSAE8AVgBJAEQARQBEACAAIgBBAFMAIABJAFMAIgAsACAAVwBJAFQASABPAFUAVAAgAFcAQQBSAFIAQQBOAFQAWQAgAE8ARgAgAEEATgBZACAASwBJAE4ARAAsACAARQBYAFAAUgBFAFMAUwAgAE8AUgAgAEkATQBQAEwASQBFAEQALAAgAEkATgBDAEwAVQBEAEkATgBHACAAQgBVAFQAIABOAE8AVAAgAEwASQBNAEkAVABFAEQAIABUAE8AIABBAE4AWQAgAFcAQQBSAFIAQQBOAFQASQBFAFMAIABPAEYAIABNAEUAUgBDAEgAQQBOAFQAQQBCAEkATABJAFQAWQAsACAARgBJAFQATgBFAFMAUwAgAEYATwBSACAAQQAgAFAAQQBSAFQASQBDAFUATABBAFIAIABQAFUAUgBQAE8AUwBFACAAQQBOAEQAIABOAE8ATgBJAE4ARgBSAEkATgBHAEUATQBFAE4AVAAgAE8ARgAgAEMATwBQAFkAUgBJAEcASABUACwAIABQAEEAVABFAE4AVAAsACAAVABSAEEARABFAE0AQQBSAEsALAAgAE8AUgAgAE8AVABIAEUAUgAgAFIASQBHAEgAVAAuACAASQBOACAATgBPACAARQBWAEUATgBUACAAUwBIAEEATABMACAAVABIAEUAIABDAE8AUABZAFIASQBHAEgAVAAgAEgATwBMAEQARQBSACAAQgBFACAATABJAEEAQgBMAEUAIABGAE8AUgAgAEEATgBZACAAQwBMAEEASQBNACwAIABEAEEATQBBAEcARQBTACAATwBSACAATwBUAEgARQBSACAATABJAEEAQgBJAEwASQBUAFkALAAgAEkATgBDAEwAVQBEAEkATgBHACAAQQBOAFkAIABHAEUATgBFAFIAQQBMACwAIABTAFAARQBDAEkAQQBMACwAIABJAE4ARABJAFIARQBDAFQALAAgAEkATgBDAEkARABFAE4AVABBAEwALAAgAE8AUgAgAEMATwBOAFMARQBRAFUARQBOAFQASQBBAEwAIABEAEEATQBBAEcARQBTACwAIABXAEgARQBUAEgARQBSACAASQBOACAAQQBOACAAQQBDAFQASQBPAE4AIABPAEYAIABDAE8ATgBUAFIAQQBDAFQALAAgAFQATwBSAFQAIABPAFIAIABPAFQASABFAFIAVwBJAFMARQAsACAAQQBSAEkAUwBJAE4ARwAgAEYAUgBPAE0ALAAgAE8AVQBUACAATwBGACAAVABIAEUAIABVAFMARQAgAE8AUgAgAEkATgBBAEIASQBMAEkAVABZACAAVABPACAAVQBTAEUAIABUAEgARQAgAEYATwBOAFQAIABTAE8ARgBUAFcAQQBSAEUAIABPAFIAIABGAFIATwBNACAATwBUAEgARQBSACAARABFAEEATABJAE4ARwBTACAASQBOACAAVABIAEUAIABGAE8ATgBUACAAUwBPAEYAVABXAEEAUgBFAC4ADQAKAGgAdAB0AHAAOgAvAC8AdwB3AHcALgBhAGQAbwBiAGUALgBjAG8AbQAvAHQAeQBwAGUALwBsAGUAZwBhAGwALgBoAHQAbQBsAAAAAAAFAAAAAwAAADgAAAAEAAABUAABAAAAAAAsAAMAAQAAADgAAwAKAAABUAAGAAwAAAAAAAEAAAAEARgAAABCAEAABQACB/8P/xf/H/8n/y//N/8//0f/T/9X/1//Z/9v/3f/f/+H/4//l/+f/6f/r/+3/7//x//P/9f/5//v//f//c///f//AAAAAAgAEAAYACAAKAAwADgAQABIAFAAWABgAGgAcAB4AIAAiACQAJgAoACoALAAuADAAMgA0ADgAOgA8AD4AP3w//8AAfgB8AHoAeAB2AHQAcgBwAG4AbABqAGgAZgBkAGIAYABeAFwAWgBYAFYAVABSAFAATgBMAEgARgBEAEIAQgBAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAZkAAAAAAAAAIgAAAAAAAAB/8AAAABAAAIAAAAD/8AAAABAAAQAAAAF/8AAAABAAAYAAAAH/8AAAABAAAgAAAAJ/8AAAABAAAoAAAAL/8AAAABAAAwAAAAN/8AAAABAAA4AAAAP/8AAAABAABAAAAAR/8AAAABAABIAAAAT/8AAAABAABQAAAAV/8AAAABAABYAAAAX/8AAAABAABgAAAAZ/8AAAABAABoAAAAb/8AAAABAABwAAAAd/8AAAABAAB4AAAAf/8AAAABAACAAAAAh/8AAAABAACIAAAAj/8AAAABAACQAAAAl/8AAAABAACYAAAAn/8AAAABAACgAAAAp/8AAAABAACoAAAAr/8AAAABAACwAAAAt/8AAAABAAC4AAAAv/8AAAABAADAAAAAx/8AAAABAADIAAAAz/8AAAABAADQAAAA1/8AAAABAADgAAAA5/8AAAABAADoAAAA7/8AAAABAADwAAAA9/8AAAABAAD4AAAA/c8AAAABAAD98AAA//0AAAXxAAEAAAABB/8AAAABAAEIAAABD/8AAAABAAEQAAABF/8AAAABAAEYAAABH/8AAAABAAEgAAABJ/8AAAABAAEoAAABL/8AAAABAAEwAAABN/8AAAABAAE4AAABP/8AAAABAAFAAAABR/8AAAABAAFIAAABT/8AAAABAAFQAAABV/8AAAABAAFYAAABX/8AAAABAAFgAAABZ/8AAAABAAFoAAABb/8AAAABAAFwAAABd/8AAAABAAF4AAABf/8AAAABAAGAAAABh/8AAAABAAGIAAABj/8AAAABAAGQAAABl/8AAAABAAGYAAABn/8AAAABAAGgAAABp/8AAAABAAGoAAABr/8AAAABAAGwAAABt/8AAAABAAG4AAABv/8AAAABAAHAAAABx/8AAAABAAHIAAABz/8AAAABAAHQAAAB1/8AAAABAAHYAAAB3/8AAAABAAHgAAAB5/8AAAABAAHoAAAB7/8AAAABAAHwAAAB9/8AAAABAAH4AAAB//0AAAABAAIAAAACB/8AAAABAAIIAAACD/8AAAABAAIQAAACF/8AAAABAAIYAAACH/8AAAABAAIgAAACJ/8AAAABAAIoAAACL/8AAAABAAIwAAACN/8AAAABAAI4AAACP/8AAAABAAJAAAACR/8AAAABAAJIAAACT/8AAAABAAJQAAACV/8AAAABAAJYAAACX/8AAAABAAJgAAACZ/8AAAABAAJoAAACb/8AAAABAAJwAAACd/8AAAABAAJ4AAACf/8AAAABAAKAAAACh/8AAAABAAKIAAACj/8AAAABAAKQAAACl/8AAAABAAKYAAACn/8AAAABAAKgAAACp/8AAAABAAKoAAACr/8AAAABAAKwAAACt/8AAAABAAK4AAACv/8AAAABAALAAAACx/8AAAABAALIAAACz/8AAAABAALQAAAC1/8AAAABAALYAAAC3/8AAAABAALgAAAC5/8AAAABAALoAAAC7/8AAAABAALwAAAC9/8AAAABAAL4AAAC//0AAAABAAMAAAADB/8AAAABAAMIAAADD/8AAAABAAMQAAADF/8AAAABAAMYAAADH/8AAAABAAMgAAADJ/8AAAABAAMoAAADL/8AAAABAAMwAAADN/8AAAABAAM4AAADP/8AAAABAANAAAADR/8AAAABAANIAAADT/8AAAABAANQAAADV/8AAAABAANYAAADX/8AAAABAANgAAADZ/8AAAABAANoAAADb/8AAAABAANwAAADd/8AAAABAAN4AAADf/8AAAABAAOAAAADh/8AAAABAAOIAAADj/8AAAABAAOQAAADl/8AAAABAAOYAAADn/8AAAABAAOgAAADp/8AAAABAAOoAAADr/8AAAABAAOwAAADt/8AAAABAAO4AAADv/8AAAABAAPAAAADx/8AAAABAAPIAAADz/8AAAABAAPQAAAD1/8AAAABAAPYAAAD3/8AAAABAAPgAAAD5/8AAAABAAPoAAAD7/8AAAABAAPwAAAD9/8AAAABAAP4AAAD//0AAAABAAQAAAAEB/8AAAABAAQIAAAED/8AAAABAAQQAAAEF/8AAAABAAQYAAAEH/8AAAABAAQgAAAEJ/8AAAABAAQoAAAEL/8AAAABAAQwAAAEN/8AAAABAAQ4AAAEP/8AAAABAARAAAAER/8AAAABAARIAAAET/8AAAABAARQAAAEV/8AAAABAARYAAAEX/8AAAABAARgAAAEZ/8AAAABAARoAAAEb/8AAAABAARwAAAEd/8AAAABAAR4AAAEf/8AAAABAASAAAAEh/8AAAABAASIAAAEj/8AAAABAASQAAAEl/8AAAABAASYAAAEn/8AAAABAASgAAAEp/8AAAABAASoAAAEr/8AAAABAASwAAAEt/8AAAABAAS4AAAEv/8AAAABAATAAAAEx/8AAAABAATIAAAEz/8AAAABAATQAAAE1/8AAAABAATYAAAE3/8AAAABAATgAAAE5/8AAAABAAToAAAE7/8AAAABAATwAAAE9/8AAAABAAT4AAAE//0AAAABAAUAAAAFB/8AAAABAAUIAAAFD/8AAAABAAUQAAAFF/8AAAABAAUYAAAFH/8AAAABAAUgAAAFJ/8AAAABAAUoAAAFL/8AAAABAAUwAAAFN/8AAAABAAU4AAAFP/8AAAABAAVAAAAFR/8AAAABAAVIAAAFT/8AAAABAAVQAAAFV/8AAAABAAVYAAAFX/8AAAABAAVgAAAFZ/8AAAABAAVoAAAFb/8AAAABAAVwAAAFd/8AAAABAAV4AAAFf/8AAAABAAWAAAAFh/8AAAABAAWIAAAFj/8AAAABAAWQAAAFl/8AAAABAAWYAAAFn/8AAAABAAWgAAAFp/8AAAABAAWoAAAFr/8AAAABAAWwAAAFt/8AAAABAAW4AAAFv/8AAAABAAXAAAAFx/8AAAABAAXIAAAFz/8AAAABAAXQAAAF1/8AAAABAAXYAAAF3/8AAAABAAXgAAAF5/8AAAABAAXoAAAF7/8AAAABAAXwAAAF9/8AAAABAAX4AAAF//0AAAABAAYAAAAGB/8AAAABAAYIAAAGD/8AAAABAAYQAAAGF/8AAAABAAYYAAAGH/8AAAABAAYgAAAGJ/8AAAABAAYoAAAGL/8AAAABAAYwAAAGN/8AAAABAAY4AAAGP/8AAAABAAZAAAAGR/8AAAABAAZIAAAGT/8AAAABAAZQAAAGV/8AAAABAAZYAAAGX/8AAAABAAZgAAAGZ/8AAAABAAZoAAAGb/8AAAABAAZwAAAGd/8AAAABAAZ4AAAGf/8AAAABAAaAAAAGh/8AAAABAAaIAAAGj/8AAAABAAaQAAAGl/8AAAABAAaYAAAGn/8AAAABAAagAAAGp/8AAAABAAaoAAAGr/8AAAABAAawAAAGt/8AAAABAAa4AAAGv/8AAAABAAbAAAAGx/8AAAABAAbIAAAGz/8AAAABAAbQAAAG1/8AAAABAAbYAAAG3/8AAAABAAbgAAAG5/8AAAABAAboAAAG7/8AAAABAAbwAAAG9/8AAAABAAb4AAAG//0AAAABAAcAAAAHB/8AAAABAAcIAAAHD/8AAAABAAcQAAAHF/8AAAABAAcYAAAHH/8AAAABAAcgAAAHJ/8AAAABAAcoAAAHL/8AAAABAAcwAAAHN/8AAAABAAc4AAAHP/8AAAABAAdAAAAHR/8AAAABAAdIAAAHT/8AAAABAAdQAAAHV/8AAAABAAdYAAAHX/8AAAABAAdgAAAHZ/8AAAABAAdoAAAHb/8AAAABAAdwAAAHd/8AAAABAAd4AAAHf/8AAAABAAeAAAAHh/8AAAABAAeIAAAHj/8AAAABAAeQAAAHl/8AAAABAAeYAAAHn/8AAAABAAegAAAHp/8AAAABAAeoAAAHr/8AAAABAAewAAAHt/8AAAABAAe4AAAHv/8AAAABAAfAAAAHx/8AAAABAAfIAAAHz/8AAAABAAfQAAAH1/8AAAABAAfYAAAH3/8AAAABAAfgAAAH5/8AAAABAAfoAAAH7/8AAAABAAfwAAAH9/8AAAABAAf4AAAH//0AAAABAAgAAAAIB/8AAAABAAgIAAAID/8AAAABAAgQAAAIF/8AAAABAAgYAAAIH/8AAAABAAggAAAIJ/8AAAABAAgoAAAIL/8AAAABAAgwAAAIN/8AAAABAAg4AAAIP/8AAAABAAhAAAAIR/8AAAABAAhIAAAIT/8AAAABAAhQAAAIV/8AAAABAAhYAAAIX/8AAAABAAhgAAAIZ/8AAAABAAhoAAAIb/8AAAABAAhwAAAId/8AAAABAAh4AAAIf/8AAAABAAiAAAAIh/8AAAABAAiIAAAIj/8AAAABAAiQAAAIl/8AAAABAAiYAAAIn/8AAAABAAigAAAIp/8AAAABAAioAAAIr/8AAAABAAiwAAAIt/8AAAABAAi4AAAIv/8AAAABAAjAAAAIx/8AAAABAAjIAAAIz/8AAAABAAjQAAAI1/8AAAABAAjYAAAI3/8AAAABAAjgAAAI5/8AAAABAAjoAAAI7/8AAAABAAjwAAAI9/8AAAABAAj4AAAI//0AAAABAAkAAAAJB/8AAAABAAkIAAAJD/8AAAABAAkQAAAJF/8AAAABAAkYAAAJH/8AAAABAAkgAAAJJ/8AAAABAAkoAAAJL/8AAAABAAkwAAAJN/8AAAABAAk4AAAJP/8AAAABAAlAAAAJR/8AAAABAAlIAAAJT/8AAAABAAlQAAAJV/8AAAABAAlYAAAJX/8AAAABAAlgAAAJZ/8AAAABAAloAAAJb/8AAAABAAlwAAAJd/8AAAABAAl4AAAJf/8AAAABAAmAAAAJh/8AAAABAAmIAAAJj/8AAAABAAmQAAAJl/8AAAABAAmYAAAJn/8AAAABAAmgAAAJp/8AAAABAAmoAAAJr/8AAAABAAmwAAAJt/8AAAABAAm4AAAJv/8AAAABAAnAAAAJx/8AAAABAAnIAAAJz/8AAAABAAnQAAAJ1/8AAAABAAnYAAAJ3/8AAAABAAngAAAJ5/8AAAABAAnoAAAJ7/8AAAABAAnwAAAJ9/8AAAABAAn4AAAJ//0AAAABAAoAAAAKB/8AAAABAAoIAAAKD/8AAAABAAoQAAAKF/8AAAABAAoYAAAKH/8AAAABAAogAAAKJ/8AAAABAAooAAAKL/8AAAABAAowAAAKN/8AAAABAAo4AAAKP/8AAAABAApAAAAKR/8AAAABAApIAAAKT/8AAAABAApQAAAKV/8AAAABAApYAAAKX/8AAAABAApgAAAKZ/8AAAABAApoAAAKb/8AAAABAApwAAAKd/8AAAABAAp4AAAKf/8AAAABAAqAAAAKh/8AAAABAAqIAAAKj/8AAAABAAqQAAAKl/8AAAABAAqYAAAKn/8AAAABAAqgAAAKp/8AAAABAAqoAAAKr/8AAAABAAqwAAAKt/8AAAABAAq4AAAKv/8AAAABAArAAAAKx/8AAAABAArIAAAKz/8AAAABAArQAAAK1/8AAAABAArYAAAK3/8AAAABAArgAAAK5/8AAAABAAroAAAK7/8AAAABAArwAAAK9/8AAAABAAr4AAAK//0AAAABAAsAAAALB/8AAAABAAsIAAALD/8AAAABAAsQAAALF/8AAAABAAsYAAALH/8AAAABAAsgAAALJ/8AAAABAAsoAAALL/8AAAABAAswAAALN/8AAAABAAs4AAALP/8AAAABAAtAAAALR/8AAAABAAtIAAALT/8AAAABAAtQAAALV/8AAAABAAtYAAALX/8AAAABAAtgAAALZ/8AAAABAAtoAAALb/8AAAABAAtwAAALd/8AAAABAAt4AAALf/8AAAABAAuAAAALh/8AAAABAAuIAAALj/8AAAABAAuQAAALl/8AAAABAAuYAAALn/8AAAABAAugAAALp/8AAAABAAuoAAALr/8AAAABAAuwAAALt/8AAAABAAu4AAALv/8AAAABAAvAAAALx/8AAAABAAvIAAALz/8AAAABAAvQAAAL1/8AAAABAAvYAAAL3/8AAAABAAvgAAAL5/8AAAABAAvoAAAL7/8AAAABAAvwAAAL9/8AAAABAAv4AAAL//0AAAABAAwAAAAMB/8AAAABAAwIAAAMD/8AAAABAAwQAAAMF/8AAAABAAwYAAAMH/8AAAABAAwgAAAMJ/8AAAABAAwoAAAML/8AAAABAAwwAAAMN/8AAAABAAw4AAAMP/8AAAABAAxAAAAMR/8AAAABAAxIAAAMT/8AAAABAAxQAAAMV/8AAAABAAxYAAAMX/8AAAABAAxgAAAMZ/8AAAABAAxoAAAMb/8AAAABAAxwAAAMd/8AAAABAAx4AAAMf/8AAAABAAyAAAAMh/8AAAABAAyIAAAMj/8AAAABAAyQAAAMl/8AAAABAAyYAAAMn/8AAAABAAygAAAMp/8AAAABAAyoAAAMr/8AAAABAAywAAAMt/8AAAABAAy4AAAMv/8AAAABAAzAAAAMx/8AAAABAAzIAAAMz/8AAAABAAzQAAAM1/8AAAABAAzYAAAM3/8AAAABAAzgAAAM5/8AAAABAAzoAAAM7/8AAAABAAzwAAAM9/8AAAABAAz4AAAM//0AAAABAA0AAAANB/8AAAABAA0IAAAND/8AAAABAA0QAAANF/8AAAABAA0YAAANH/8AAAABAA0gAAANJ/8AAAABAA0oAAANL/8AAAABAA0wAAANN/8AAAABAA04AAANP/8AAAABAA1AAAANR/8AAAABAA1IAAANT/8AAAABAA1QAAANV/8AAAABAA1YAAANX/8AAAABAA1gAAANZ/8AAAABAA1oAAANb/8AAAABAA1wAAANd/8AAAABAA14AAANf/8AAAABAA2AAAANh/8AAAABAA2IAAANj/8AAAABAA2QAAANl/8AAAABAA2YAAANn/8AAAABAA2gAAANp/8AAAABAA2oAAANr/8AAAABAA2wAAANt/8AAAABAA24AAANv/8AAAABAA3AAAANx/8AAAABAA3IAAANz/8AAAABAA3QAAAN1/8AAAABAA3YAAAN3/8AAAABAA3gAAAN5/8AAAABAA3oAAAN7/8AAAABAA3wAAAN9/8AAAABAA34AAAN//0AAAABAA4AAAAOB/8AAAABAA4IAAAOD/8AAAABAA4QAAAOF/8AAAABAA4YAAAOH/8AAAABAA4gAAAOJ/8AAAABAA4oAAAOL/8AAAABAA4wAAAON/8AAAABAA44AAAOP/8AAAABAA5AAAAOR/8AAAABAA5IAAAOT/8AAAABAA5QAAAOV/8AAAABAA5YAAAOX/8AAAABAA5gAAAOZ/8AAAABAA5oAAAOb/8AAAABAA5wAAAOd/8AAAABAA54AAAOf/8AAAABAA6AAAAOh/8AAAABAA6IAAAOj/8AAAABAA6QAAAOl/8AAAABAA6YAAAOn/8AAAABAA6gAAAOp/8AAAABAA6oAAAOr/8AAAABAA6wAAAOt/8AAAABAA64AAAOv/8AAAABAA7AAAAOx/8AAAABAA7IAAAOz/8AAAABAA7QAAAO1/8AAAABAA7YAAAO3/8AAAABAA7gAAAO5/8AAAABAA7oAAAO7/8AAAABAA7wAAAO9/8AAAABAA74AAAO//0AAAABAA8AAAAPB/8AAAABAA8IAAAPD/8AAAABAA8QAAAPF/8AAAABAA8YAAAPH/8AAAABAA8gAAAPJ/8AAAABAA8oAAAPL/8AAAABAA8wAAAPN/8AAAABAA84AAAPP/8AAAABAA9AAAAPR/8AAAABAA9IAAAPT/8AAAABAA9QAAAPV/8AAAABAA9YAAAPX/8AAAABAA9gAAAPZ/8AAAABAA9oAAAPb/8AAAABAA9wAAAPd/8AAAABAA94AAAPf/8AAAABAA+AAAAPh/8AAAABAA+IAAAPj/8AAAABAA+QAAAPl/8AAAABAA+YAAAPn/8AAAABAA+gAAAPp/8AAAABAA+oAAAPr/8AAAABAA+wAAAPt/8AAAABAA+4AAAPv/8AAAABAA/AAAAPx/8AAAABAA/IAAAPz/8AAAABAA/QAAAP1/8AAAABAA/YAAAP3/8AAAABAA/gAAAP5/8AAAABAA/oAAAP7/8AAAABAA/wAAAP9/8AAAABAA/4AAAP//0AAAABABAAAAAQB/8AAAABABAIAAAQD/8AAAABABAQAAAQF/8AAAABABAYAAAQH/8AAAABABAgAAAQJ/8AAAABABAoAAAQL/8AAAABABAwAAAQN/8AAAABABA4AAAQP/8AAAABABBAAAAQR/8AAAABABBIAAAQT/8AAAABABBQAAAQV/8AAAABABBYAAAQX/8AAAABABBgAAAQZ/8AAAABABBoAAAQb/8AAAABABBwAAAQd/8AAAABABB4AAAQf/8AAAABABCAAAAQh/8AAAABABCIAAAQj/8AAAABABCQAAAQl/8AAAABABCYAAAQn/8AAAABABCgAAAQp/8AAAABABCoAAAQr/8AAAABABCwAAAQt/8AAAABABC4AAAQv/8AAAABABDAAAAQx/8AAAABABDIAAAQz/8AAAABABDQAAAQ1/8AAAABABDYAAAQ3/8AAAABABDgAAAQ5/8AAAABABDoAAAQ7/8AAAABABDwAAAQ9/8AAAABABD4AAAQ//0AAAABAAMAAAAAAAD/tQAyAAAAAAAAAAAAAAAAAAAAAAAAAAABAAQCAAEBAQtBZG9iZUJsYW5rAAEBATD4G/gciwwe+B0B+B4Ci/sM+gD6BAUeGgA/DB8cCAEMIvdMD/dZEfdRDCUcGRYMJAAFAQEGDk1YZ0Fkb2JlSWRlbnRpdHlDb3B5cmlnaHQgMjAxMyBBZG9iZSBTeXN0ZW1zIEluY29ycG9yYXRlZC4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5BZG9iZSBCbGFua0Fkb2JlQmxhbmstMjA0OQAAAgABB/8DAAEAAAAIAQgBAgABAEsATABNAE4ATwBQAFEAUgBTAFQAVQBWAFcAWABZAFoAWwBcAF0AXgBfAGAAYQBiAGMAZABlAGYAZwBoAGkAagBrAGwAbQBuAG8AcABxAHIAcwB0AHUAdgB3AHgAeQB6AHsAfAB9AH4AfwCAAIEAggCDAIQAhQCGAIcAiACJAIoAiwCMAI0AjgCPAJAAkQCSAJMAlACVAJYAlwCYAJkAmgCbAJwAnQCeAJ8AoAChAKIAowCkAKUApgCnAKgAqQCqAKsArACtAK4ArwCwALEAsgCzALQAtQC2ALcAuAC5ALoAuwC8AL0AvgC/AMAAwQDCAMMAxADFAMYAxwDIAMkAygDLAMwAzQDOAM8A0ADRANIA0wDUANUA1gDXANgA2QDaANsA3ADdAN4A3wDgAOEA4gDjAOQA5QDmAOcA6ADpAOoA6wDsAO0A7gDvAPAA8QDyAPMA9AD1APYA9wD4APkA+gD7APwA/QD+AP8BAAEBAQIBAwEEAQUBBgEHAQgBCQEKAQsBDAENAQ4BDwEQAREBEgETARQBFQEWARcBGAEZARoBGwEcAR0BHgEfASABIQEiASMBJAElASYBJwEoASkBKgErASwBLQEuAS8BMAExATIBMwE0ATUBNgE3ATgBOQE6ATsBPAE9AT4BPwFAAUEBQgFDAUQBRQFGAUcBSAFJAUoBSwFMAU0BTgFPAVABUQFSAVMBVAFVAVYBVwFYAVkBWgFbAVwBXQFeAV8BYAFhAWIBYwFkAWUBZgFnAWgBaQFqAWsBbAFtAW4BbwFwAXEBcgFzAXQBdQF2AXcBeAF5AXoBewF8AX0BfgF/AYABgQGCAYMBhAGFAYYBhwGIAYkBigGLAYwBjQGOAY8BkAGRAZIBkwGUAZUBlgGXAZgBmQGaAZsBnAGdAZ4BnwGgAaEBogGjAaQBpQGmAacBqAGpAaoBqwGsAa0BrgGvAbABsQGyAbMBtAG1AbYBtwG4AbkBugG7AbwBvQG+Ab8BwAHBAcIBwwHEAcUBxgHHAcgByQHKAcsBzAHNAc4BzwHQAdEB0gHTAdQB1QHWAdcB2AHZAdoB2wHcAd0B3gHfAeAB4QHiAeMB5AHlAeYB5wHoAekB6gHrAewB7QHuAe8B8AHxAfIB8wH0AfUB9gH3AfgB+QH6AfsB/AH9Af4B/wIAAgECAgIDAgQCBQIGAgcCCAIJAgoCCwIMAg0CDgIPAhACEQISAhMCFAIVAhYCFwIYAhkCGgIbAhwCHQIeAh8CIAIhAiICIwIkAiUCJgInAigCKQIqAisCLAItAi4CLwIwAjECMgIzAjQCNQI2AjcCOAI5AjoCOwI8Aj0CPgI/AkACQQJCAkMCRAJFAkYCRwJIAkkCSgJLAkwCTQJOAk8CUAJRAlICUwJUAlUCVgJXAlgCWQJaAlsCXAJdAl4CXwJgAmECYgJjAmQCZQJmAmcCaAJpAmoCawJsAm0CbgJvAnACcQJyAnMCdAJ1AnYCdwJ4AnkCegJ7AnwCfQJ+An8CgAKBAoICgwKEAoUChgKHAogCiQKKAosCjAKNAo4CjwKQApECkgKTApQClQKWApcCmAKZApoCmwKcAp0CngKfAqACoQKiAqMCpAKlAqYCpwKoAqkCqgKrAqwCrQKuAq8CsAKxArICswK0ArUCtgK3ArgCuQK6ArsCvAK9Ar4CvwLAAsECwgLDAsQCxQLGAscCyALJAsoCywLMAs0CzgLPAtAC0QLSAtMC1ALVAtYC1wLYAtkC2gLbAtwC3QLeAt8C4ALhAuIC4wLkAuUC5gLnAugC6QLqAusC7ALtAu4C7wLwAvEC8gLzAvQC9QL2AvcC+AL5AvoC+wL8Av0C/gL/AwADAQMCAwMDBAMFAwYDBwMIAwkDCgMLAwwDDQMOAw8DEAMRAxIDEwMUAxUDFgMXAxgDGQMaAxsDHAMdAx4DHwMgAyEDIgMjAyQDJQMmAycDKAMpAyoDKwMsAy0DLgMvAzADMQMyAzMDNAM1AzYDNwM4AzkDOgM7AzwDPQM+Az8DQANBA0IDQwNEA0UDRgNHA0gDSQNKA0sDTANNA04DTwNQA1EDUgNTA1QDVQNWA1cDWANZA1oDWwNcA10DXgNfA2ADYQNiA2MDZANlA2YDZwNoA2kDagNrA2wDbQNuA28DcANxA3IDcwN0A3UDdgN3A3gDeQN6A3sDfAN9A34DfwOAA4EDggODA4QDhQOGA4cDiAOJA4oDiwOMA40DjgOPA5ADkQOSA5MDlAOVA5YDlwOYA5kDmgObA5wDnQOeA58DoAOhA6IDowOkA6UDpgOnA6gDqQOqA6sDrAOtA64DrwOwA7EDsgOzA7QDtQO2A7cDuAO5A7oDuwO8A70DvgO/A8ADwQPCA8MDxAPFA8YDxwPIA8kDygPLA8wDzQPOA88D0APRA9ID0wPUA9UD1gPXA9gD2QPaA9sD3APdA94D3wPgA+ED4gPjA+QD5QPmA+cD6APpA+oD6wPsA+0D7gPvA/AD8QPyA/MD9AP1A/YD9wP4A/kD+gP7A/wD/QP+A/8EAAQBBAIEAwQEBAUEBgQHBAgECQQKBAsEDAQNBA4EDwQQBBEEEgQTBBQEFQQWBBcEGAQZBBoEGwQcBB0EHgQfBCAEIQQiBCMEJAQlBCYEJwQoBCkEKgQrBCwELQQuBC8EMAQxBDIEMwQ0BDUENgQ3BDgEOQQ6BDsEPAQ9BD4EPwRABEEEQgRDBEQERQRGBEcESARJBEoESwRMBE0ETgRPBFAEUQRSBFMEVARVBFYEVwRYBFkEWgRbBFwEXQReBF8EYARhBGIEYwRkBGUEZgRnBGgEaQRqBGsEbARtBG4EbwRwBHEEcgRzBHQEdQR2BHcEeAR5BHoEewR8BH0EfgR/BIAEgQSCBIMEhASFBIYEhwSIBIkEigSLBIwEjQSOBI8EkASRBJIEkwSUBJUElgSXBJgEmQSaBJsEnASdBJ4EnwSgBKEEogSjBKQEpQSmBKcEqASpBKoEqwSsBK0ErgSvBLAEsQSyBLMEtAS1BLYEtwS4BLkEugS7BLwEvQS+BL8EwATBBMIEwwTEBMUExgTHBMgEyQTKBMsEzATNBM4EzwTQBNEE0gTTBNQE1QTWBNcE2ATZBNoE2wTcBN0E3gTfBOAE4QTiBOME5ATlBOYE5wToBOkE6gTrBOwE7QTuBO8E8ATxBPIE8wT0BPUE9gT3BPgE+QT6BPsE/AT9BP4E/wUABQEFAgUDBQQFBQUGBQcFCAUJBQoFCwUMBQ0FDgUPBRAFEQUSBRMFFAUVBRYFFwUYBRkFGgUbBRwFHQUeBR8FIAUhBSIFIwUkBSUFJgUnBSgFKQUqBSsFLAUtBS4FLwUwBTEFMgUzBTQFNQU2BTcFOAU5BToFOwU8BT0FPgU/BUAFQQVCBUMFRAVFBUYFRwVIBUkFSgVLBUwFTQVOBU8FUAVRBVIFUwVUBVUFVgVXBVgFWQVaBVsFXAVdBV4FXwVgBWEFYgVjBWQFZQVmBWcFaAVpBWoFawVsBW0FbgVvBXAFcQVyBXMFdAV1BXYFdwV4BXkFegV7BXwFfQV+BX8FgAWBBYIFgwWEBYUFhgWHBYgFiQWKBYsFjAWNBY4FjwWQBZEFkgWTBZQFlQWWBZcFmAWZBZoFmwWcBZ0FngWfBaAFoQWiBaMFpAWlBaYFpwWoBakFqgWrBawFrQWuBa8FsAWxBbIFswW0BbUFtgW3BbgFuQW6BbsFvAW9Bb4FvwXABcEFwgXDBcQFxQXGBccFyAXJBcoFywXMBc0FzgXPBdAF0QXSBdMF1AXVBdYF1wXYBdkF2gXbBdwF3QXeBd8F4AXhBeIF4wXkBeUF5gXnBegF6QXqBesF7AXtBe4F7wXwBfEF8gXzBfQF9QX2BfcF+AX5BfoF+wX8Bf0F/gX/BgAGAQYCBgMGBAYFBgYGBwYIBgkGCgYLBgwGDQYOBg8GEAYRBhIGEwYUBhUGFgYXBhgGGQYaBhsGHAYdBh4GHwYgBiEGIgYjBiQGJQYmBicGKAYpBioGKwYsBi0GLgYvBjAGMQYyBjMGNAY1BjYGNwY4BjkGOgY7BjwGPQY+Bj8GQAZBBkIGQwZEBkUGRgZHBkgGSQZKBksGTAZNBk4GTwZQBlEGUgZTBlQGVQZWBlcGWAZZBloGWwZcBl0GXgZfBmAGYQZiBmMGZAZlBmYGZwZoBmkGagZrBmwGbQZuBm8GcAZxBnIGcwZ0BnUGdgZ3BngGeQZ6BnsGfAZ9Bn4GfwaABoEGggaDBoQGhQaGBocGiAaJBooGiwaMBo0GjgaPBpAGkQaSBpMGlAaVBpYGlwaYBpkGmgabBpwGnQaeBp8GoAahBqIGowakBqUGpganBqgGqQaqBqsGrAatBq4GrwawBrEGsgazBrQGtQa2BrcGuAa5BroGuwa8Br0Gvga/BsAGwQbCBsMGxAbFBsYGxwbIBskGygbLBswGzQbOBs8G0AbRBtIG0wbUBtUG1gbXBtgG2QbaBtsG3AbdBt4G3wbgBuEG4gbjBuQG5QbmBucG6AbpBuoG6wbsBu0G7gbvBvAG8QbyBvMG9Ab1BvYG9wb4BvkG+gb7BvwG/Qb+Bv8HAAcBBwIHAwcEBwUHBgcHBwgHCQcKBwsHDAcNBw4HDwcQBxEHEgcTBxQHFQcWBxcHGAcZBxoHGwccBx0HHgcfByAHIQciByMHJAclByYHJwcoBykHKgcrBywHLQcuBy8HMAcxBzIHMwc0BzUHNgc3BzgHOQc6BzsHPAc9Bz4HPwdAB0EHQgdDB0QHRQdGB0cHSAdJB0oHSwdMB00HTgdPB1AHUQdSB1MHVAdVB1YHVwdYB1kHWgdbB1wHXQdeB18HYAdhB2IHYwdkB2UHZgdnB2gHaQdqB2sHbAdtB24HbwdwB3EHcgdzB3QHdQd2B3cHeAd5B3oHewd8B30Hfgd/B4AHgQeCB4MHhAeFB4YHhweIB4kHigeLB4wHjQeOB48HkAeRB5IHkweUB5UHlgeXB5gHmQeaB5sHnAedB54HnwegB6EHogejB6QHpQemB6cHqAepB6oHqwesB60HrgevB7AHsQeyB7MHtAe1B7YHtwe4B7kHuge7B7wHvQe+B78HwAfBB8IHwwfEB8UHxgfHB8gHyQfKB8sHzAfNB84HzwfQB9EH0gfTB9QH1QfWB9cH2AfZB9oH2wfcB90H3gffB+AH4QfiB+MH5AflB+YH5wfoB+kH6gfrB+wH7QfuB+8H8AfxB/IH8wf0B/UH9gf3B/gH+Qf6B/sH/Af9B/4H/wgACAEIAggDCAQIBQgGCAcICAgJCAoICwgMCA0IDggPCBAIEQgSCBMIFAgVCBYIFwgYCBkIGggbCBwIHQgeCB8IIAghCCIIIwgkCCUIJggnCCgIKQgqCCsILAgtCC4ILwgwCDEIMggzCDQINQg2CDcIOAg5CDoIOwg8CD0IPgg/CEAIQQhCCEMIRAhFCEYIRwhICEkISghLIPsMt/oktwH3ELf5LLcD9xD6BBX+fPmE+nwH/Vj+JxX50gf3xfwzBaawFfvF+DcF+PYGpmIV/dIH+8X4MwVwZhX3xfw3Bfz2Bg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODgABAQEK+B8MJpocGSQS+46LHAVGiwa9Cr0L+ucVAAPoAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAA') format('truetype'); }";
	
	FontLoader.prototype = {
		constructor: FontLoader,
		loadFonts: function() {
			var self = this;
			
			if (this._numberOfFontFamilies === 0) {
				this._finish();
				return;
			}
			
			if (this.timeout !== null) {
				this._timeoutId = window.setTimeout(function timeoutFire() {
					self._finish();
				}, this.timeout);
			}
			
			// Use constant line-height so there won't be changes in height because Adobe Blank uses zero width but not zero height.
			this._testContainer = document.createElement("div");
			this._testContainer.style.cssText = "position:absolute; left:-10000px; top:-10000px; white-space:nowrap; font-size:20px; line-height:20px; visibility:hidden;";
			
			if (FontLoader.testDiv === null) {
				this._runOnce();
			} else {
				this._loadFonts();
			}
		},
		_runOnce: function() {
			var self = this,
				clonedDiv, j,
				adobeBlankFontFaceStyle, adobeBlankDiv,
				adobeBlankFallbackFont = "serif";
			
			// Create testFiv template that will be cloned for each font
			FontLoader.testDiv = document.createElement("div");
			FontLoader.testDiv.style.position = "absolute";
			FontLoader.testDiv.appendChild(document.createTextNode(FontLoader.referenceText));

			if (!FontLoader.useAdobeBlank) {
				// Get default dimensions
				clonedDiv = FontLoader.testDiv.cloneNode(true);
				this._testContainer.appendChild(clonedDiv);
				document.body.appendChild(this._testContainer);

				for (j = 0; j < FontLoader.referenceFontFamilies.length; j++) {
					clonedDiv.style.fontFamily = FontLoader.referenceFontFamilies[j];
					FontLoader.referenceFontFamiliesSizes.push(new Size(clonedDiv.offsetWidth, clonedDiv.offsetHeight));
				}

				this._testContainer.parentNode.removeChild(this._testContainer);
				clonedDiv.parentNode.removeChild(clonedDiv);
				this._loadFonts();
			} else {
				// Add AdobeBlank @font-face
				adobeBlankFontFaceStyle = document.createElement("style");
				adobeBlankFontFaceStyle.setAttribute("type", "text/css");
				adobeBlankFontFaceStyle.appendChild(document.createTextNode(FontLoader.adobeBlankFontFaceRule));
				document.getElementsByTagName("head")[0].appendChild(adobeBlankFontFaceStyle);

				// Get default dimensions
				adobeBlankDiv = /** @type HTMLElement */FontLoader.testDiv.cloneNode(true);
				this._testContainer.appendChild(adobeBlankDiv);
				document.body.appendChild(this._testContainer);

				adobeBlankDiv.style.fontFamily = adobeBlankFallbackFont;

				if (FontLoader.useIntervalChecking) {
					this._testContainer.appendChild(adobeBlankDiv);
					// Start polling element sizes but also do first synchronous check in case all fonts where already loaded.
					this._intervalId = window.setInterval(function intervalFire() {
						self._checkAdobeBlankSize();
					}, this._intervalDelay);
					this._checkAdobeBlankSize();
				} else {
					this._adobeBlankSizeWatcher = new SizeWatcher(adobeBlankDiv, {
						container: this._testContainer,
						delegate: this,
						continuous: true,
						direction: SizeWatcher.directions.decrease,
						dimension: SizeWatcher.dimensions.horizontal
					});
					this._adobeBlankSizeWatcher.prepareForWatch();
					this._adobeBlankSizeWatcher.beginWatching();
				}

				adobeBlankDiv.style.fontFamily = FontLoader.referenceFontFamilies[0] + ", " + adobeBlankFallbackFont;
			}
		},
		_checkAdobeBlankSize: function() {
			var adobeBlankDiv = this._testContainer.firstChild;
			this._adobeBlankLoaded(adobeBlankDiv);
		},
		_adobeBlankLoaded: function(adobeBlankDiv) {
			// Prevent false size change, for example if AdobeBlank height is higher than fallback font.
			if (adobeBlankDiv.offsetWidth !== 0) {
				return;
			}
			
			FontLoader.referenceFontFamiliesSizes.push(new Size(adobeBlankDiv.offsetWidth, adobeBlankDiv.offsetHeight));
			
			if (this._adobeBlankSizeWatcher !== null) {
				// SizeWatcher method
				this._adobeBlankSizeWatcher.endWatching();
				this._adobeBlankSizeWatcher.removeScrollWatchers();
				this._adobeBlankSizeWatcher = null;
			} else {
				// Polling method (IE)
				window.clearInterval(this._intervalId);
				adobeBlankDiv.parentNode.removeChild(adobeBlankDiv);
			}
			
			this._testContainer.parentNode.removeChild(this._testContainer);

			this._loadFonts();
		},
		_loadFonts: function() {
			var i, j, clonedDiv, sizeWatcher, sizeWatchers = [],
				self = this;

			// Add div for each font-family
			for (i = 0; i < this._numberOfFontFamilies; i++) {
				this._fontsMap[this._fontFamiliesArray[i]] = true;

				if (FontLoader.useResizeEvent) {
					for (j = 0; j < FontLoader.referenceFontFamilies.length; j++) {
						clonedDiv = FontLoader.testDiv.cloneNode(true);
						clonedDiv.setAttribute("data-font-family", this._fontFamiliesArray[i]);
						clonedDiv.setAttribute("data-ref-font-family-index", String(j));
						clonedDiv.style.fontFamily = FontLoader.referenceFontFamilies[j];
						this._testContainer.appendChild(clonedDiv);
					}
				} else if (FontLoader.useIntervalChecking) {
					for (j = 0; j < FontLoader.referenceFontFamilies.length; j++) {
						clonedDiv = FontLoader.testDiv.cloneNode(true);
						clonedDiv.setAttribute("data-font-family", this._fontFamiliesArray[i]);
						clonedDiv.setAttribute("data-ref-font-family-index", String(j));
						clonedDiv.style.fontFamily = "'" + this._fontFamiliesArray[i] + "', " + FontLoader.referenceFontFamilies[j];
						this._testContainer.appendChild(clonedDiv);
					}
				} else {
					for (j = 0; j < FontLoader.referenceFontFamilies.length; j++) {
						clonedDiv = FontLoader.testDiv.cloneNode(true);
						clonedDiv.setAttribute("data-font-family", this._fontFamiliesArray[i]);
						clonedDiv.setAttribute("data-ref-font-family-index", String(j));
						clonedDiv.style.fontFamily = FontLoader.referenceFontFamilies[j];
						sizeWatcher = new SizeWatcher(/** @type HTMLElement */clonedDiv, {
							container: this._testContainer,
							delegate: this,
							size: FontLoader.referenceFontFamiliesSizes[j],
							direction: SizeWatcher.directions.increase,
							dimension: SizeWatcher.dimensions.horizontal
						});
						// The prepareForWatch() and beginWatching() methods will be invoked in separate iterations to
						// reduce number of browser's CSS recalculations.
						sizeWatchers.push(sizeWatcher);
					}
				}
			}

			// Append the testContainer after all test elements to minimize DOM insertions
			document.body.appendChild(this._testContainer);

			if (FontLoader.useResizeEvent) {
				for (j = 0; j < this._testContainer.childNodes.length; j++) {
					clonedDiv = this._testContainer.childNodes[j];
					// "resize" event works only with attachEvent
					clonedDiv.attachEvent("onresize", (function(self, clonedDiv) {
						return function() {
							self._elementSizeChanged(clonedDiv);
						}
					})(this, clonedDiv));
				}
				window.setTimeout(function() {
					for (j = 0; j < self._testContainer.childNodes.length; j++) {
						clonedDiv = self._testContainer.childNodes[j];
						clonedDiv.style.fontFamily = "'" + clonedDiv.getAttribute("data-font-family") + "', " + FontLoader.referenceFontFamilies[clonedDiv.getAttribute("data-ref-font-family-index")];
					}
				}, 0);
			} else if (FontLoader.useIntervalChecking) {
				// Start polling element sizes but also do first synchronous check in case all fonts where already loaded.
				this._intervalId = window.setInterval(function intervalFire() {
					self._checkSizes();
				}, this._intervalDelay);
				this._checkSizes();
			} else {
				// We are dividing the prepareForWatch() and beginWatching() methods to optimize browser performance by
				// removing CSS recalculation from each iteration to the end of iterations.
				for (i = 0; i < this._numberOfFontFamilies * FontLoader.referenceFontFamilies.length; i++) {
					sizeWatcher = sizeWatchers[i];
					sizeWatcher.prepareForWatch();
				}
				for (i = 0; i < this._numberOfFontFamilies * FontLoader.referenceFontFamilies.length; i++) {
					sizeWatcher = sizeWatchers[i];
					sizeWatcher.beginWatching();
					// Apply tested font-family
					clonedDiv = sizeWatcher.getWatchedElement();
					clonedDiv.style.fontFamily = "'" + clonedDiv.getAttribute("data-font-family") + "', " + FontLoader.referenceFontFamilies[clonedDiv.getAttribute("data-ref-font-family-index")];
				}
			}
		},
		_checkSizes: function() {
			var i, testDiv, currSize, refSize;
			for (i = this._testContainer.childNodes.length - 1; i >= 0; i--) {
				testDiv = this._testContainer.childNodes[i];
				currSize = new Size(testDiv.offsetWidth, testDiv.offsetHeight);
				refSize = FontLoader.referenceFontFamiliesSizes[testDiv.getAttribute("data-ref-font-family-index")];
				if (!refSize.isEqual(currSize)) {
					// Element dimensions changed, this means its font loaded, remove it from testContainer div
					testDiv.parentNode.removeChild(testDiv);
					this._elementSizeChanged(testDiv);
				}
			}
		},
		_elementSizeChanged: function(element) {
			var fontFamily = element.getAttribute("data-font-family");
			
			if (this._finished) {
				return;
			}
			
			// Check that the font of this element wasn't already marked as loaded by an element with different reference font family. 
			if (typeof this._fontsMap[fontFamily] === "undefined") {
				return;
			}
			
			this._numberOfLoadedFonts++;
			delete this._fontsMap[fontFamily];
			
			if (this.delegate && typeof this.delegate.fontLoaded === "function") {
				this.delegate.fontLoaded(fontFamily);
			}
			
			if (this._numberOfLoadedFonts === this._numberOfFontFamilies) {
				this._finish();
			}
		},
		_finish: function() {
			var callbackParameter,
				fontFamily,
				notLoadedFontFamilies = [];
			
			if (this._finished) {
				return;
			}
			
			this._finished = true;
			
			if (this._adobeBlankSizeWatcher !== null) {
				this._adobeBlankSizeWatcher = null;
			}
			
			if (this._testContainer !== null) {
				this._testContainer.parentNode.removeChild(this._testContainer);
			}
			
			if (this._timeoutId !== null) {
				window.clearTimeout(this._timeoutId);
			}
			
			if (this._intervalId !== null) {
				window.clearInterval(this._intervalId);
			}
			
			if (this._numberOfLoadedFonts < this._numberOfFontFamilies) {
				for (fontFamily in this._fontsMap) {
					if (this._fontsMap.hasOwnProperty(fontFamily)) {
						notLoadedFontFamilies.push(fontFamily);
					}
				}
				callbackParameter = {
					message: "Not all fonts were loaded",
					notLoadedFontFamilies: notLoadedFontFamilies
				};
			} else {
				callbackParameter = null;
			}
			if (this.delegate && typeof this.delegate.fontsLoaded === "function") {
				this.delegate.fontsLoaded(callbackParameter);
			}
		},
		/**
		 * SizeWatcher delegate method
		 * @param {SizeWatcher} sizeWatcher
		 */
		sizeWatcherChangedSize: function(sizeWatcher) {
			var watchedElement = sizeWatcher.getWatchedElement();
			if (sizeWatcher === this._adobeBlankSizeWatcher) {
				this._adobeBlankLoaded(watchedElement);
			} else {
				this._elementSizeChanged(watchedElement);
			}
		}
	};
	
	/**
	 * Size object
	 *
	 * @param width
	 * @param height
	 * @constructor
	 */
	function Size(width, height) {
		this.width = width;
		this.height = height;
	}
	
	/**
	 * Compares receiver object to passed in size object.
	 * 
	 * @param otherSize
	 * @returns {boolean}
	 */
	Size.prototype.isEqual = function(otherSize) {
		return (this.width === otherSize.width && this.height === otherSize.height);
	};
	
	/**
	 * SizeWatcher observes size of an element and notifies when its size is changed. It doesn't use any timeouts
	 * to check the element size, when change in size occurs a callback method immediately invoked.
	 * 
	 * To watch for element's size changes the element, and other required elements are appended to a container element
	 * you specify, and which must be added to the DOM tree before invoking prepareForWatch() method. Your container
	 * element should be positioned outside of client's visible area. Therefore you shouldn't use SizeWatcher to watch
	 * for size changes of elements used for UI.
	 * Such container element could be a simple <div> that is a child of the <body> element:
	 * <div style="position:absolute; left:-10000px; top:-10000px;"></div>
	 * 
	 * You must invoke SizeWatcher's methods in a specific order to establish size change listeners:
	 * 
	 * 1. Create SizeWatcher instance by invoke SizeWatcher constructor passing the element (size of which you want to
	 *    observe), the container element, the delegate object and optional size parameter of type Size which should be
	 *    the pre-calculated initial size of your element.
	 * 4. Invoke prepareForWatch() method. This method will calculate element size if you didn't passed it to the constructor.
	 * 5. Invoke beginWatching() method. This method will set event listeners and invoke your delegate's method once
	 *    element size changes. 
	 * 
	 * Failing to invoke above methods in their predefined order will throw an exception.
	 * 
	 * @param {HTMLElement} element An element, size of which will be observed for changes.
	 * @param {Object}      options
	 * @param {HTMLElement} options.container An element to which special observing elements will be added. Must be in DOM tree
	 *                      when prepareForWatch() method is called.
	 * @param {Object}      options.delegate A delegate object with a sizeWatcherChangedSize method which will be invoked, in
	 *                      context of the delegate object, when change in size occurs. This method is invoked with single
	 *                      parameter which is the current SizeWatcher instance.
	 * @param {Size}        [options.size] The pre-calculated initial size of your element. When passed, the element is not
	 *                      asked for offsetWidth and offsetHeight, which may be useful to reduce browser's CSS
	 *                      recalculations. If you will not pass the size parameter then its size calculation will be
	 *                      deferred to prepareForWatch() method.
	 * @param {Boolean}     [options.continuous=false] A boolean flag indicating if the SizeWatcher will watch only for
	 *                      the first size change (default) or will continuously watch for size changes.
	 * @param {Number}      [options.direction=SizeWatcher.directions.both] The direction of size change that should be
	 *                      watched: SizeWatcher.directions.increase, SizeWatcher.directions.decrease or
	 *                      SizeWatcher.directions.both
	 * @param {Number}      [options.dimension=SizeWatcher.dimensions.both] The dimension of size change that should be
	 *                      watched: SizeWatcher.dimensions.horizontal, SizeWatcher.dimensions.vertical or
	 *                      SizeWatcher.dimensions.both
	 * @constructor
	 */
	function SizeWatcher(element, options) {
		this._element = element;
		this._delegate = options.delegate;
		this._size = null;
		this._continuous = !!options.continuous;
		this._direction = options.direction ? options.direction : SizeWatcher.directions.both;
		this._dimension = options.dimension ? options.dimension : SizeWatcher.dimensions.both;
		this._sizeIncreaseWatcherContentElm = null;
		this._sizeDecreaseWatcherElm = null;
		this._sizeIncreaseWatcherElm = null;
		this._state = SizeWatcher.states.initialized;
		
		this._generateScrollWatchers(options.size);
		this._appendScrollWatchersToElement(options.container);
	}
	
	SizeWatcher.states = {
		initialized: 0,
		generatedScrollWatchers: 1,
		appendedScrollWatchers: 2,
		preparedScrollWatchers: 3,
		watchingForSizeChange: 4
	};

	SizeWatcher.directions = {
		decrease: 1,
		increase: 2,
		both: 3
	};

	SizeWatcher.dimensions = {
		horizontal: 1,
		vertical: 2,
		both: 3
	};
	
	//noinspection JSUnusedLocalSymbols
	SizeWatcher.prototype = {
		constructor: SizeWatcher,
		getWatchedElement: function() {
			return this._element;
		},
		setSize: function(size) {
			this._size = size;
			//noinspection JSBitwiseOperatorUsage
			if (this._direction & SizeWatcher.directions.increase) {
				this._sizeIncreaseWatcherContentElm.style.cssText = "width: " + (size.width + 1) + "px; height: " + (size.height + 1) + "px;";
			}
			//noinspection JSBitwiseOperatorUsage
			if (this._direction & SizeWatcher.directions.decrease) {
				this._sizeDecreaseWatcherElm.style.cssText = "position:absolute; left: 0px; top: 0px; overflow: hidden; width: " + (size.width - 1) + "px; height: " + (size.height - 1) + "px;";
			}
		},
		_generateScrollWatchers: function(size) {

			this._element.style.position = "absolute";
			
			//noinspection JSBitwiseOperatorUsage
			if (this._direction & SizeWatcher.directions.increase) {
				this._sizeIncreaseWatcherContentElm = document.createElement("div");
				
				this._sizeIncreaseWatcherElm = document.createElement("div");
				this._sizeIncreaseWatcherElm.style.cssText = "position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: hidden;";
				this._sizeIncreaseWatcherElm.appendChild(this._sizeIncreaseWatcherContentElm);

				this._element.appendChild(this._sizeIncreaseWatcherElm);
			}

			//noinspection JSBitwiseOperatorUsage
			if (this._direction & SizeWatcher.directions.decrease) {
				this._sizeDecreaseWatcherElm = document.createElement("div");
				this._sizeDecreaseWatcherElm.appendChild(this._element);
			}
			
			if (size) {
				this.setSize(size);
			}
			
			this._state = SizeWatcher.states.generatedScrollWatchers;
		},
		_appendScrollWatchersToElement: function(container) {
			if (this._state !== SizeWatcher.states.generatedScrollWatchers) {
				throw new Error("SizeWatcher._appendScrollWatchersToElement() was invoked before SizeWatcher._generateScrollWatchers()");
			}

			//noinspection JSBitwiseOperatorUsage
			if (this._direction & SizeWatcher.directions.decrease) {
				container.appendChild(this._sizeDecreaseWatcherElm);
			} else {
				container.appendChild(this._element);
			}
			
			this._state = SizeWatcher.states.appendedScrollWatchers;
		},
		removeScrollWatchers: function() {
			//noinspection JSBitwiseOperatorUsage
			if (this._direction & SizeWatcher.directions.decrease) {
				if (this._sizeDecreaseWatcherElm.parentNode) {
					this._sizeDecreaseWatcherElm.parentNode.removeChild(this._sizeDecreaseWatcherElm);
				}
			} else if (this._element.parentNode) {
				this._element.parentNode.removeChild(this._element);
			}
		},
		prepareForWatch: function() {
			var parentNode,
				sizeDecreaseWatcherElmScrolled = true,
				sizeIncreaseWatcherElmScrolled = true;
			
			if (this._state !== SizeWatcher.states.appendedScrollWatchers) {
				throw new Error("SizeWatcher.prepareForWatch() invoked before SizeWatcher._appendScrollWatchersToElement()");
			}
			
			if (this._size === null) {
				this.setSize(new Size(this._element.offsetWidth, this._element.offsetHeight));
			}

			//noinspection JSBitwiseOperatorUsage
			if (this._direction & SizeWatcher.directions.decrease) {
				sizeDecreaseWatcherElmScrolled = this._scrollElementToBottomRight(this._sizeDecreaseWatcherElm);
			}
			//noinspection JSBitwiseOperatorUsage
			if (this._direction & SizeWatcher.directions.increase) {
				sizeIncreaseWatcherElmScrolled = this._scrollElementToBottomRight(this._sizeIncreaseWatcherElm);
			}
			
			// Check if scroll positions updated.
			if (!sizeDecreaseWatcherElmScrolled || !sizeIncreaseWatcherElmScrolled) {
				
				// Traverse tree to the top node to see if element is in the DOM tree.
				parentNode = this._element.parentNode;
				while (parentNode !== window.document && parentNode !== null) {
					parentNode = parentNode.parentNode;
				}
				
				if (parentNode === null) {
					throw new Error("Can't set scroll position of scroll watchers. SizeWatcher is not in the DOM tree.");
				} else if (console && typeof console.warn === "function") {
					console.warn("SizeWatcher can't set scroll position of scroll watchers.");
				}
			}
			
			this._state = SizeWatcher.states.preparedScrollWatchers;
		},
		_scrollElementToBottomRight: function(element) {
			var elementScrolled = true;
			//noinspection JSBitwiseOperatorUsage
			if (this._dimension & SizeWatcher.dimensions.vertical) {
				element.scrollTop = 1;
				elementScrolled = elementScrolled && element.scrollTop === 1;
			}
			//noinspection JSBitwiseOperatorUsage
			if (this._dimension & SizeWatcher.dimensions.horizontal) {
				element.scrollLeft = 1;
				elementScrolled = elementScrolled && element.scrollLeft === 1;
			}
			return elementScrolled;
		},
		beginWatching: function() {
			if (this._state !== SizeWatcher.states.preparedScrollWatchers) {
				throw new Error("SizeWatcher.beginWatching() invoked before SizeWatcher.prepareForWatch()");
			}

			//noinspection JSBitwiseOperatorUsage
			if (this._direction & SizeWatcher.directions.decrease) {
				//noinspection JSValidateTypes
				this._sizeDecreaseWatcherElm.addEventListener("scroll", this, false);
			}
			//noinspection JSBitwiseOperatorUsage
			if (this._direction & SizeWatcher.directions.increase) {
				//noinspection JSValidateTypes
				this._sizeIncreaseWatcherElm.addEventListener("scroll", this, false);
			}
			
			this._state = SizeWatcher.states.watchingForSizeChange;
		},
		endWatching: function() {
			if (this._state !== SizeWatcher.states.watchingForSizeChange) {
				throw new Error("SizeWatcher.endWatching() invoked before SizeWatcher.beginWatching()");
			}

			//noinspection JSBitwiseOperatorUsage
			if (this._direction & SizeWatcher.directions.decrease) {
				//noinspection JSValidateTypes
				this._sizeDecreaseWatcherElm.removeEventListener("scroll", this, false);
			}
			//noinspection JSBitwiseOperatorUsage
			if (this._direction & SizeWatcher.directions.increase) {
				//noinspection JSValidateTypes
				this._sizeIncreaseWatcherElm.removeEventListener("scroll", this, false);
			}
			this._state = SizeWatcher.states.appendedScrollWatchers;
		},
		/**
		 * @private
		 */
		handleEvent: function(event) {
			var newSize, oldSize;
			
			// This is not suppose to happen because when we run endWatching() we remove scroll listeners.
			// But some browsers will fire second scroll event which was pushed into event stack before listener was
			// removed so do this check anyway.
			if (this._state !== SizeWatcher.states.watchingForSizeChange) {
				return;
			}
			
			newSize = new Size(this._element.offsetWidth, this._element.offsetHeight);
			oldSize = this._size;
			
			// Check if element size is changed. How come that element size isn't changed but scroll event fired?
			// This can happen in two cases: when double scroll occurs or immediately after calling prepareForWatch()
			// (event if scroll event listeners attached after it).
			// The double scroll event happens when one size dimension (e.g.:width) is increased and another
			// (e.g.:height) is decreased.
			if (oldSize.isEqual(newSize)) {
				return;
			}
			
			if (this._delegate && typeof this._delegate.sizeWatcherChangedSize === "function") {
				this._delegate.sizeWatcherChangedSize(this);
				
				// Check that endWatching() wasn't invoked from within the delegate.
				if (this._state !== SizeWatcher.states.watchingForSizeChange) {
					return;
				}
			}
			
			if (!this._continuous) {
				this.endWatching();
			} else {
				// Set the new size so in case of double scroll event we won't cause the delegate method to be executed twice
				// and also to update to the new watched size.
				this.setSize(newSize);
				// change state so prepareFowWatch() won't throw exception about wrong order invocation.
				this._state = SizeWatcher.states.appendedScrollWatchers;
				// Run prepareForWatch to reset the scroll watchers, we have already set the size
				this.prepareForWatch();
				// Set state to listeningForSizeChange, there is no need to invoke beginWatching() method as scroll event
				// listeners and callback are already set.
				this._state = SizeWatcher.states.watchingForSizeChange;
				
			}
		}
	};
	
}(window));
},{}]},{},[1])