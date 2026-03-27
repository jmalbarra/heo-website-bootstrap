/**
 * Fondo tipo lluvia Matrix (misma lógica base que n0m10s/index.html).
 * Requiere en el HTML: #matrix-bg > canvas#matrix-canvas + #matrix-overlay
 */
(function () {
	"use strict";

	var canvas = document.getElementById("matrix-canvas");
	if (!canvas) return;

	var ctx = canvas.getContext("2d");
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var charArray = chars.split("");
	var fontSize = 14;
	var drops = [];
	var columns = 0;
	var matrixInterval;

	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		columns = Math.floor(canvas.width / fontSize);
		drops = [];
		for (var i = 0; i < columns; i++) {
			drops[i] = 1;
		}
	}

	function drawMatrix() {
		ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.font = fontSize + "px JetBrains Mono, monospace";
		for (var i = 0; i < drops.length; i++) {
			var char = charArray[Math.floor(Math.random() * charArray.length)];
			var x = i * fontSize;
			var y = drops[i] * fontSize;
			ctx.fillStyle = "rgba(34, 238, 201, " + (0.3 + Math.random() * 0.7) + ")";
			ctx.fillText(char, x, y);
			if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
			drops[i] += 3;
		}
	}

	resize();
	window.addEventListener("resize", resize);
	matrixInterval = setInterval(drawMatrix, 22);
})();
