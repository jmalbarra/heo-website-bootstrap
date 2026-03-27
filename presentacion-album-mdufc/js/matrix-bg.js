/**
 * Fondo lluvia Matrix — misma lógica que n0m10s/index.html.
 * Requiere: #matrix-bg > canvas#matrix-canvas + #matrix-overlay
 */
(function () {
	"use strict";

	var canvas = document.getElementById("matrix-canvas");
	if (!canvas) return;

	var ctx = canvas.getContext("2d", { alpha: true });
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var charArray = chars.split("");
	var fontSize = 14;
	var drops = [];

	function matrixViewportSize() {
		var vv = window.visualViewport;
		var w = window.innerWidth || document.documentElement.clientWidth || 320;
		var h = window.innerHeight || document.documentElement.clientHeight || 480;
		if (vv) {
			w = Math.max(vv.width, w);
			h = Math.max(vv.height, h);
		}
		return { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) };
	}

	function resizeMatrixCanvas() {
		var size = matrixViewportSize();
		canvas.width = size.w;
		canvas.height = size.h;
		var columns = Math.max(1, Math.floor(canvas.width / fontSize));
		drops = [];
		for (var i = 0; i < columns; i++) {
			drops[i] = 1;
		}
	}

	function drawMatrix() {
		if (!canvas.width || !canvas.height || !drops.length) return;
		ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.font = fontSize + "px JetBrains Mono, monospace";
		var i;
		for (i = 0; i < drops.length; i++) {
			var char = charArray[Math.floor(Math.random() * charArray.length)];
			var x = i * fontSize;
			var y = drops[i] * fontSize;
			ctx.fillStyle = "rgba(34, 238, 201, " + (0.3 + Math.random() * 0.7) + ")";
			ctx.fillText(char, x, y);
			if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
			drops[i] += 3;
		}
	}

	resizeMatrixCanvas();
	setInterval(drawMatrix, 22);
	window.addEventListener("resize", resizeMatrixCanvas);
	if (window.visualViewport) {
		window.visualViewport.addEventListener("resize", resizeMatrixCanvas);
	}
	window.addEventListener("orientationchange", function () {
		setTimeout(resizeMatrixCanvas, 150);
	});
})();
