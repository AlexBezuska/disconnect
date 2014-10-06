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