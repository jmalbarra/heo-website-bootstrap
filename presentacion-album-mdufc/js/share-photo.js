/**
 * Genera una imagen estilo tapa / glitch para compartir en redes.
 * Todo en el cliente (sin subir al servidor).
 */
(function () {
	"use strict";

	var OUT_W = 1080;
	var OUT_H = 1350;
	var ACCENT_R = 34;
	var ACCENT_G = 238;
	var ACCENT_B = 201;

	var canvas = document.getElementById("share-canvas");
	var fileInput = document.getElementById("share-file");
	var previewWrap = document.getElementById("share-preview-wrap");
	var btnShuffle = document.getElementById("btn-shuffle");
	var btnDownload = document.getElementById("btn-download");
	var igLink = document.getElementById("share-ig-link");

	if (!canvas || !fileInput) return;

	var ctx = canvas.getContext("2d", { willReadFrequently: true });
	var userImg = new Image();
	userImg.crossOrigin = "anonymous";
	var logoImg = new Image();
	logoImg.crossOrigin = "anonymous";

	var glitchSeed = Date.now();
	var hasImage = false;
	var butterflyImg = new Image();

	function seededRandom(seed) {
		var s = seed % 2147483647;
		if (s <= 0) s += 2147483646;
		return function () {
			s = (s * 16807) % 2147483647;
			return (s - 1) / 2147483646;
		};
	}

	/** Dibuja la imagen dentro del rectángulo sin deformar (como object-fit: contain). */
	function drawImageContain(img, boxX, boxY, boxW, boxH) {
		var iw = img.naturalWidth;
		var ih = img.naturalHeight;
		if (iw <= 0 || ih <= 0) return;
		var scale = Math.min(boxW / iw, boxH / ih);
		var dw = iw * scale;
		var dh = ih * scale;
		var ox = boxX + (boxW - dw) / 2;
		var oy = boxY + (boxH - dh) / 2;
		ctx.drawImage(img, 0, 0, iw, ih, ox, oy, dw, dh);
	}

	function drawCoverImage(img, w, h) {
		var ir = img.naturalWidth / img.naturalHeight;
		var vr = w / h;
		var sx, sy, sw, sh;
		if (ir > vr) {
			sh = img.naturalHeight;
			sw = sh * vr;
			sx = (img.naturalWidth - sw) / 2;
			sy = 0;
		} else {
			sw = img.naturalWidth;
			sh = sw / vr;
			sx = 0;
			sy = (img.naturalHeight - sh) / 2;
		}
		ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
	}

	function applyAlbumColorGrade(data) {
		var i, r, g, b, lum, t, r2, g2, b2;
		for (i = 0; i < data.length; i += 4) {
			r = data[i];
			g = data[i + 1];
			b = data[i + 2];
			lum = 0.299 * r + 0.587 * g + 0.114 * b;
			t = lum / 255;
			r2 = lum * 0.12 + ACCENT_R * t * 0.55 + t * t * 40;
			g2 = lum * 0.38 + ACCENT_G * t * 0.42;
			b2 = lum * 0.42 + ACCENT_B * t * 0.48;
			data[i] = Math.min(255, r2);
			data[i + 1] = Math.min(255, g2);
			data[i + 2] = Math.min(255, b2);
		}
	}

	function copyStripH(data, width, height, y0, stripH, dx) {
		var rowBytes = width * 4;
		var y, src, dst, x;
		var temp = new Uint8ClampedArray(stripH * rowBytes);
		for (y = 0; y < stripH; y++) {
			if (y0 + y >= height) break;
			temp.set(
				data.subarray((y0 + y) * rowBytes, (y0 + y) * rowBytes + rowBytes),
				y * rowBytes
			);
		}
		for (y = 0; y < stripH; y++) {
			if (y0 + y >= height) break;
			for (x = 0; x < width; x++) {
				src = x * 4;
				var xs = (x + dx) % width;
				if (xs < 0) xs += width;
				dst = xs * 4;
				data[(y0 + y) * rowBytes + src] = temp[y * rowBytes + dst];
				data[(y0 + y) * rowBytes + src + 1] = temp[y * rowBytes + dst + 1];
				data[(y0 + y) * rowBytes + src + 2] = temp[y * rowBytes + dst + 2];
			}
		}
	}

	function rgbShiftStrip(data, width, height, y0, stripH, dr, dg) {
		var rowBytes = width * 4;
		var y, x, i0;
		var copy = new Uint8ClampedArray(data);
		for (y = 0; y < stripH; y++) {
			if (y0 + y >= height) break;
			for (x = 0; x < width; x++) {
				i0 = (y0 + y) * rowBytes + x * 4;
				var xr = Math.max(0, Math.min(width - 1, x + dr));
				var xg = Math.max(0, Math.min(width - 1, x + dg));
				var ir = (y0 + y) * rowBytes + xr * 4;
				var ig = (y0 + y) * rowBytes + xg * 4;
				data[i0] = copy[ir];
				data[i0 + 1] = copy[ig];
				data[i0 + 2] = copy[i0 + 2];
			}
		}
	}

	function applyGlitch(imageData, width, height, seed) {
		var rand = seededRandom(seed);
		var data = imageData.data;
		var n, y0, h, shift, i;

		n = 10 + Math.floor(rand() * 10);
		while (n--) {
			y0 = Math.floor(rand() * (height - 6));
			h = 2 + Math.floor(rand() * 18);
			if (y0 + h > height) h = height - y0;
			shift = Math.floor((rand() - 0.5) * 36);
			if (Math.abs(shift) > 1) copyStripH(data, width, height, y0, h, shift);
		}

		n = 3 + Math.floor(rand() * 5);
		while (n--) {
			y0 = Math.floor(rand() * (height - 4));
			h = 1 + Math.floor(rand() * 6);
			if (y0 + h > height) h = height - y0;
			rgbShiftStrip(data, width, height, y0, h, Math.floor((rand() - 0.5) * 10), Math.floor((rand() - 0.5) * 6));
		}

		for (i = 0; i < data.length; i += 4) {
			if (rand() > 0.997) {
				data[i] ^= 40;
				data[i + 1] ^= 30;
			}
		}

		for (y0 = 0; y0 < height; y0 += 2) {
			for (i = 0; i < width; i++) {
				var idx = (y0 * width + i) * 4;
				data[idx] *= 0.88;
				data[idx + 1] *= 0.9;
				data[idx + 2] *= 0.92;
			}
		}
	}

	function drawButterfly(cx, cy, scale, angle, alpha) {
		if (!butterflyImg.complete || !butterflyImg.naturalWidth) return;
		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate(angle);
		ctx.globalAlpha = alpha;
		var w = 160 * scale;
		var h = 144 * scale;
		ctx.drawImage(butterflyImg, -w / 2, -h / 2, w, h);
		ctx.restore();
	}

	function drawButterflies(seed) {
		var rand = seededRandom(seed + 777);
		var positions = [
			[0.12, 0.18, 0.85],
			[0.82, 0.22, 0.7],
			[0.2, 0.55, 0.65],
			[0.75, 0.5, 0.55],
			[0.45, 0.72, 0.75],
			[0.88, 0.78, 0.6],
			[0.08, 0.85, 0.5]
		];
		var k, px, py, sc, ang;
		for (k = 0; k < positions.length; k++) {
			px = positions[k][0] * OUT_W + (rand() - 0.5) * 40;
			py = positions[k][1] * OUT_H + (rand() - 0.5) * 40;
			sc = positions[k][2] * (0.9 + rand() * 0.35);
			ang = (rand() - 0.5) * 0.85;
			drawButterfly(px, py, sc, ang, 0.75 + rand() * 0.2);
		}
	}

	function drawBranding() {
		var logoSize = 112;
		var pad = 36;
		if (logoImg.complete && logoImg.naturalWidth > 0) {
			ctx.save();
			ctx.globalAlpha = 0.92;
			ctx.shadowColor = "rgba(34, 238, 201, 0.5)";
			ctx.shadowBlur = 24;
			drawImageContain(logoImg, OUT_W - logoSize - pad, pad, logoSize, logoSize);
			ctx.restore();
		}

		ctx.save();
		ctx.font = '500 32px "Space Grotesk", "Geist Mono", sans-serif';
		ctx.fillStyle = "rgba(232, 232, 232, 0.92)";
		ctx.shadowColor = "rgba(0,0,0,0.75)";
		ctx.shadowBlur = 8;
		ctx.shadowOffsetY = 2;
		var text = "@heo.oficial";
		var tw = ctx.measureText(text).width;
		ctx.fillText(text, OUT_W - tw - pad, OUT_H - pad);

		ctx.font = '22px "Geist Mono", monospace';
		ctx.fillStyle = "rgba(34, 238, 201, 0.85)";
		var sub = "Mitos de un futuro cercano";
		var sw = ctx.measureText(sub).width;
		ctx.fillText(sub, OUT_W - sw - pad, OUT_H - pad - 38);
		ctx.restore();
	}

	function render() {
		if (!hasImage || !userImg.complete || userImg.naturalWidth === 0) return;

		canvas.width = OUT_W;
		canvas.height = OUT_H;

		drawCoverImage(userImg, OUT_W, OUT_H);

		var imageData = ctx.getImageData(0, 0, OUT_W, OUT_H);
		applyAlbumColorGrade(imageData.data);
		applyGlitch(imageData, OUT_W, OUT_H, glitchSeed);
		ctx.putImageData(imageData, 0, 0);

		drawButterflies(glitchSeed);

		ctx.save();
		ctx.globalCompositeOperation = "overlay";
		var g = ctx.createLinearGradient(0, 0, OUT_W, OUT_H);
		g.addColorStop(0, "rgba(34, 238, 201, 0.12)");
		g.addColorStop(0.5, "rgba(5, 8, 20, 0.08)");
		g.addColorStop(1, "rgba(20, 60, 90, 0.15)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, OUT_W, OUT_H);
		ctx.restore();

		ctx.save();
		ctx.globalCompositeOperation = "soft-light";
		var g2 = ctx.createRadialGradient(OUT_W * 0.5, OUT_H * 0.15, 0, OUT_W * 0.5, OUT_H * 0.4, OUT_W * 0.7);
		g2.addColorStop(0, "rgba(34, 238, 201, 0.18)");
		g2.addColorStop(1, "transparent");
		ctx.fillStyle = g2;
		ctx.fillRect(0, 0, OUT_W, OUT_H);
		ctx.restore();

		drawBranding();
	}

	function onFile(f) {
		if (!f || !f.type.match(/^image\//)) return;
		var url = URL.createObjectURL(f);
		userImg.onload = function () {
			URL.revokeObjectURL(url);
			hasImage = true;
			glitchSeed = Date.now();
			previewWrap.classList.remove("hidden");
			render();
		};
		userImg.onerror = function () {
			URL.revokeObjectURL(url);
			hasImage = false;
		};
		userImg.src = url;
	}

	fileInput.addEventListener("change", function () {
		var f = fileInput.files && fileInput.files[0];
		onFile(f);
	});

	if (btnShuffle) {
		btnShuffle.addEventListener("click", function () {
			glitchSeed = Date.now();
			render();
		});
	}

	if (btnDownload) {
		btnDownload.addEventListener("click", function () {
			if (!hasImage) return;
			canvas.toBlob(function (blob) {
				if (!blob) return;
				var a = document.createElement("a");
				a.href = URL.createObjectURL(blob);
				a.download = "hacia-el-ocaso-mitos.png";
				a.click();
				setTimeout(function () {
					URL.revokeObjectURL(a.href);
				}, 400);
			}, "image/png");
		});
	}

	logoImg.onload = function () {
		if (hasImage) render();
	};
	logoImg.src = "../images/ojo-goth-blanco.png";

	(function loadButterflyImg() {
		var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180">'
			+ '<defs>'
			+ '<radialGradient id="gl" cx="52" cy="70" r="75" gradientUnits="userSpaceOnUse">'
			+ '<stop offset="0%" stop-color="#b8daff"/>'
			+ '<stop offset="40%" stop-color="#4488ff"/>'
			+ '<stop offset="100%" stop-color="#0f2db0"/>'
			+ '</radialGradient>'
			+ '<radialGradient id="gr" cx="148" cy="70" r="75" gradientUnits="userSpaceOnUse">'
			+ '<stop offset="0%" stop-color="#b8daff"/>'
			+ '<stop offset="40%" stop-color="#4488ff"/>'
			+ '<stop offset="100%" stop-color="#0f2db0"/>'
			+ '</radialGradient>'
			+ '</defs>'
			/* Ala sup izq */
			+ '<path d="M97,72 C80,50 45,22 22,42 C8,58 14,92 40,108 C60,118 82,112 97,105 Z" fill="url(#gl)" opacity="0.92"/>'
			+ '<path d="M97,72 C80,50 45,22 22,42 C8,58 14,92 40,108 C60,118 82,112 97,105 Z" fill="white" opacity="0.10"/>'
			/* Ala sup der */
			+ '<path d="M103,72 C120,50 155,22 178,42 C192,58 186,92 160,108 C140,118 118,112 103,105 Z" fill="url(#gr)" opacity="0.92"/>'
			+ '<path d="M103,72 C120,50 155,22 178,42 C192,58 186,92 160,108 C140,118 118,112 103,105 Z" fill="white" opacity="0.10"/>'
			/* Ala inf izq */
			+ '<path d="M95,105 C75,112 42,118 38,140 C34,158 58,164 78,156 C92,150 95,132 95,118 Z" fill="#1e5ce8" opacity="0.85"/>'
			/* Ala inf der */
			+ '<path d="M105,105 C125,112 158,118 162,140 C166,158 142,164 122,156 C108,150 105,132 105,118 Z" fill="#1e5ce8" opacity="0.85"/>'
			/* Venas ala izq */
			+ '<g stroke="#071a60" stroke-width="0.9" stroke-opacity="0.32" fill="none">'
			+ '<line x1="97" y1="83" x2="22" y2="50"/>'
			+ '<line x1="97" y1="89" x2="28" y2="97"/>'
			+ '<line x1="97" y1="96" x2="55" y2="112"/>'
			+ '</g>'
			/* Venas ala der */
			+ '<g stroke="#071a60" stroke-width="0.9" stroke-opacity="0.32" fill="none">'
			+ '<line x1="103" y1="83" x2="178" y2="50"/>'
			+ '<line x1="103" y1="89" x2="172" y2="97"/>'
			+ '<line x1="103" y1="96" x2="145" y2="112"/>'
			+ '</g>'
			/* Cuerpo */
			+ '<ellipse cx="100" cy="113" rx="3.5" ry="21" fill="#05101e" opacity="0.88"/>'
			+ '<ellipse cx="100" cy="87" rx="4.5" ry="7" fill="#05101e" opacity="0.88"/>'
			+ '<circle cx="100" cy="76" r="4" fill="#05101e" opacity="0.88"/>'
			/* Antenas */
			+ '<path d="M98,73 Q76,44 64,16" stroke="#05101e" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.82"/>'
			+ '<path d="M102,73 Q124,44 136,16" stroke="#05101e" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.82"/>'
			+ '<ellipse cx="63" cy="15" rx="4.5" ry="3" fill="#05101e" opacity="0.82"/>'
			+ '<ellipse cx="137" cy="15" rx="4.5" ry="3" fill="#05101e" opacity="0.82"/>'
			+ '</svg>';
		var blob = new Blob([svg], { type: "image/svg+xml" });
		var url = URL.createObjectURL(blob);
		butterflyImg.onload = function () {
			URL.revokeObjectURL(url);
			if (hasImage) render();
		};
		butterflyImg.src = url;
	}());

	if (igLink) {
		igLink.href = "https://www.instagram.com/heo.oficial/";
	}
})();
