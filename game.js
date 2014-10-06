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
		"theher-idle": {
			"strip": "img/theher.png",
			"frames": 1,
			"msPerFrame": 200
		},
		"theher-walk-down": {
			"strip": "img/theher.png",
			"frames": 1,
			"msPerFrame": 400
		},
		"theher-walk-left": {
			"strip": "img/theher.png",
			"frames": 1,
			"msPerFrame": 400
		},
		"theher-walk-right": {
			"strip": "img/theher.png",
			"frames": 1,
			"msPerFrame": 400
		},
		"npc": {
			"strip": "img/npc.png",
			"frames": 1,
			"msPerFrame": 400
		},
	}
};

var debug = false;

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

// var cpuUp = false;
// var cpuRight = false;
// var cpuLeft = false;
// var cpuDown = false;
var cpuMoving = false;

var game = new Splat.Game(canvas, manifest);

function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) | 0;
	var y = offsetY | 0;
	context.fillText(text, x, y);
}

function findRayLength(ray) {
	var start = {
		x: ray.startX,
		y: ray.startY
	};
	var end = {
		x: ray.endX,
		y: ray.endY
	};
	var a = end.x - start.x;
	var b = end.y - start.y;
	var csq = (a * a) + (b * b);
	return Math.floor(Math.sqrt(csq));
}

function getCenter(entity) {
	var centerX = entity.x + (entity.width / 2);
	var centerY = entity.y + (entity.height / 2);
	return {
		x: centerX,
		y: centerY
	};
}

function makeRay(entity, otherEntity) {
	var ray = {
		startX: entity.x,
		startY: entity.y,
		endX: otherEntity.x,
		endY: otherEntity.y
	};
	return ray;
}

function drawLine(context, ray, width, color) {
	context.strokeStyle = color;
	context.lineWidth = width;
	context.beginPath();
	context.moveTo(ray.startX, ray.startY);
	context.lineTo(ray.endX, ray.endY);
	context.stroke();
}

function calulateDarkness(distance) {
	var opacity = 1 - (distance / 1000);
	if (opacity < 0.00001) {
		opacity = 0.00001;
	}
	if (opacity > 1) {
		opacity = 1;
	}
	return "rgba(0,0,0," + opacity + ")";
}

var directions = ["left", "right", "up", "down", "nomove"];

function randomPicker(array) {
	var cpuPick = Math.floor(Math.random() * array.length);
	return array[cpuPick];
}

// x, y, width, height
var floorObsticles = [
	new Splat.Entity(568, 0, 20, canvas.height)
];

var randomPick = "right";


var npcCount = 100;

setInterval(function() {
	randomPick = randomPicker(directions);
}, 2000);

var npcTimer = [];

function runNpcTimer(timer) {
	console.log("running timer", timer);
	timer = randomPicker(directions);
}
setInterval(function() {
	for (var p = 0; p < npcCount; p++) {
		var timeframe = Math.floor(Math.random() * 2000) + 500;
		setInterval(runNpcTimer(npcTimer[p]), timeframe);
	}
}, 500);



function createNPCs(quantity, array) {
	for (var n = 0; n < quantity; n++) {
		var generateX = Math.floor(Math.random() * canvas.width) + (canvas.width / 2);
		var generateY = Math.floor(Math.random() * canvas.height);
		var npcSprite = game.animations.get("npc");
		array.push(new Splat.AnimatedEntity(generateX, generateY, npcSprite.width, npcSprite.height, npcSprite, 0, 0));
	}
}

function checkAllObsticles(obsticleArray, entity) {
	for (var i = 0; i < obsticleArray.length; i++) {
		var entityLeft = entity.x;
		var entityRight = entity.x + entity.width;
		if (entity.collides(obsticleArray[i])) {
			if (entityRight > obsticleArray[i].x) {
				entity.x = entity.x - 5;
			}
			if (entityLeft > (obsticleArray[i].x + obsticleArray[i].width)) {
				entity.x = (entity.x + entity.width) - 5;
			}

		}
	}
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// initialization
	this.timers.expire = new Splat.Timer(undefined, 1, function() {
		game.scenes.switchTo("game");
	});
	this.timers.expire.start();
}, function() {
	// simulation
}, function(context) {
	// draw
	context.fillStyle = brown;
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "white";
	context.font = "20px helvetica";
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

		//theher
		this.theHerIdle = game.animations.get("theher-idle");
		this.theHerWalkDown = game.animations.get("theher-walk-down");
		this.theHerWalkLeft = game.animations.get("theher-walk-left");
		this.theHerWalkRight = game.animations.get("theher-walk-right");
		this.theHer = new Splat.AnimatedEntity(863, 293, this.theHerIdle.width, this.theHerIdle.height, this.theHerIdle, 0, 0);
		this.npcArray = [];

		createNPCs(npcCount, this.npcArray);
	}, function(elapsedMillis) {
		// simulation

		//Playerinputs
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
		checkAllObsticles(floorObsticles, this.player);

		// What to do with random moves
		// if (randomPick === "left") {
		// 	cpuLeft = true;
		// 	cpuRight = false;
		// 	cpuUp = false;
		// 	cpuDown = false;
		// } else if (randomPick === "right") {
		// 	cpuLeft = false;
		// 	cpuRight = true;
		// 	cpuUp = false;
		// 	cpuDown = false;
		// } else if (randomPick === "up") {
		// 	cpuLeft = false;
		// 	cpuRight = false;
		// 	cpuUp = true;
		// 	cpuDown = false;
		// } else if (randomPick === "down") {
		// 	cpuLeft = false;
		// 	cpuRight = false;
		// 	cpuUp = false;
		// 	cpuDown = true;
		// } else {
		// 	cpuLeft = false;
		// 	cpuRight = false;
		// 	cpuUp = false;
		// 	cpuDown = false;
		// }
		//theher
		this.theHerWalkDown.move(elapsedMillis);
		this.theHerWalkLeft.move(elapsedMillis);
		this.theHerWalkRight.move(elapsedMillis);
		//CPU inputs
		if (randomPick === "left") {
			this.theHer.vx = -playerXSpeed;
			this.theHer.vy = 0;
			cpuMoving = true;
			this.theHer.facing = "left";
		} else if (randomPick === "right") {
			this.theHer.vx = playerXSpeed;
			this.theHer.vy = 0;
			cpuMoving = true;
			this.theHer.facing = "right";
		} else if (randomPick === "up") {
			this.theHer.vy = -playerYSpeed;
			this.theHer.vx = 0;
			cpuMoving = true;
			this.theHer.facing = "up";
		} else if (randomPick === "down") {
			this.theHer.vy = playerYSpeed;
			this.theHer.vx = 0;
			cpuMoving = true;
			this.theHer.facing = "down";
		} else {
			cpuMoving = false;
		}

		if (cpuMoving) {
			if (this.theHer.facing === "left") {
				this.theHer.sprite = this.theHerWalkLeft;
			} else if (this.theHer.facing === "right") {
				this.theHer.sprite = this.theHerWalkRight;
			} else {
				this.theHer.sprite = this.theHerWalkDown;
			}
			this.theHer.x += this.theHer.vx;
			this.theHer.y += this.theHer.vy;
		} else {
			this.theHer.sprite = this.theHerIdle;
		}

		// Bounds checking for theHer
		if (this.theHer.x < bounds.left) {
			this.theHer.x = bounds.left;
		}
		if (this.theHer.x + this.theHer.width > bounds.right) {
			this.theHer.x = bounds.right - this.theHer.width;
		}
		if (this.theHer.y < bounds.top) {
			this.theHer.y = bounds.top;
		}
		if (this.theHer.y + this.theHer.height > bounds.bottom) {
			this.theHer.y = bounds.bottom - this.theHer.height;
		}

		// player obsticle check
		checkAllObsticles(floorObsticles, this.theHer);

		// caculate start and end of line between players
		this.ray = makeRay(getCenter(this.player), getCenter(this.theHer));
		this.rayLength = findRayLength(this.ray);
		this.darkLevel = calulateDarkness(this.rayLength);


		//npcs move

		for (var c = 0; c < this.npcArray.length; c++) {
			if (npcTimer[c] === "left") {
				this.npcArray[c].vx = -playerXSpeed;
				this.npcArray[c].vy = 0;
				this.npcArray[c].moving = true;
				this.npcArray[c].facing = "left";
			} else if (npcTimer[c] === "right") {
				this.npcArray[c].vx = playerXSpeed;
				this.npcArray[c].vy = 0;
				this.npcArray[c].moving = true;
				this.npcArray[c].facing = "right";
			} else if (npcTimer[c] === "up") {
				this.npcArray[c].vy = -playerYSpeed;
				this.npcArray[c].vx = 0;
				this.npcArray[c].moving = true;
				this.npcArray[c].facing = "up";
			} else if (npcTimer[c] === "down") {
				this.npcArray[c].vy = playerYSpeed;
				this.npcArray[c].vx = 0;
				this.npcArray[c].moving = true;
				this.npcArray[c].facing = "down";
			} else {
				this.npcArray[c].moving = false;
			}

			if (this.npcArray[c].moving) {
				this.npcArray[c].x += this.npcArray[c].vx;
				this.npcArray[c].y += this.npcArray[c].vy;
			}
		}



	},
	function(context) {
		// draw background
		context.fillStyle = green;
		context.fillRect(0, 0, canvas.width / 2, canvas.height);
		context.fillStyle = coral;
		context.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);

		//draw players
		this.theHer.draw(context);
		this.player.draw(context);

		for (var n = 0; n < this.npcArray.length; n++) {
			this.npcArray[n].draw(context);
		}

		if (debug === true) {
			//draw barrier (debug)
			context.strokeStyle = "white";
			for (var i = 0; i < floorObsticles.length; i++) {
				context.strokeRect(floorObsticles[i].x, floorObsticles[i].y, floorObsticles[i].width, floorObsticles[i].height);
			}

			//draw line between players
			drawLine(context, this.ray, 1, "rgba(255,255,255,.5)");

			//draw distace number
			context.fillStyle = "white";
			context.font = "15px helvetica";
			centerText(context, "Dis:" + this.rayLength, 0, 10);
		}

		//Darken right side based on distance
		context.fillStyle = this.darkLevel;
		context.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);

	}));

game.scenes.switchTo("loading");