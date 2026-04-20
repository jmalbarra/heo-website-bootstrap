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

	var activeFx = { tint: true, glitch: true, vignette: true, chroma: false, particles: false, crt: false, ascii: false };

	/* Patrón de fósforos RGB para el efecto CRT (se crea una sola vez) */
	var crtPattern = null;
	function getCRTPattern() {
		if (crtPattern) return crtPattern;
		var pat = document.createElement("canvas");
		pat.width = 3;
		pat.height = 1;
		var pc = pat.getContext("2d");
		pc.fillStyle = "#ff0000"; pc.fillRect(0, 0, 1, 1);
		pc.fillStyle = "#00ff00"; pc.fillRect(1, 0, 1, 1);
		pc.fillStyle = "#0000ff"; pc.fillRect(2, 0, 1, 1);
		crtPattern = ctx.createPattern(pat, "repeat");
		return crtPattern;
	}

	function seededRandom(seed) {
		var s = seed % 2147483647;
		if (s <= 0) s += 2147483646;
		return function () {
			s = (s * 16807) % 2147483647;
			return (s - 1) / 2147483646;
		};
	}

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
		var y, src, x;
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
				var dst = xs * 4;
				data[(y0 + y) * rowBytes + src]     = temp[y * rowBytes + dst];
				data[(y0 + y) * rowBytes + src + 1] = temp[y * rowBytes + dst + 1];
				data[(y0 + y) * rowBytes + src + 2] = temp[y * rowBytes + dst + 2];
			}
		}
	}

	/* Solo desplazamiento de píxeles — sin cambio de color */
	function applyGlitch(imageData, width, height, seed) {
		var rand = seededRandom(seed);
		var data = imageData.data;
		var n, y0, h, shift;

		/* Bloques grandes y llamativos */
		n = 3 + Math.floor(rand() * 4);
		while (n--) {
			y0 = Math.floor(rand() * (height - 30));
			h = 40 + Math.floor(rand() * 100);
			if (y0 + h > height) h = height - y0;
			shift = Math.floor((rand() - 0.5) * 200);
			if (Math.abs(shift) > 10) copyStripH(data, width, height, y0, h, shift);
		}

		/* Bloques medianos de relleno */
		n = 4 + Math.floor(rand() * 4);
		while (n--) {
			y0 = Math.floor(rand() * (height - 10));
			h = 10 + Math.floor(rand() * 35);
			if (y0 + h > height) h = height - y0;
			shift = Math.floor((rand() - 0.5) * 100);
			if (Math.abs(shift) > 4) copyStripH(data, width, height, y0, h, shift);
		}
	}

	function applyChromaAberration(data, width, height) {
		var copy = new Uint8ClampedArray(data);
		var offset = Math.floor(width * 0.009);
		var i, x, y, xr, xb, ir, ib;
		for (y = 0; y < height; y++) {
			for (x = 0; x < width; x++) {
				i = (y * width + x) * 4;
				xr = Math.min(width - 1, x + offset);
				xb = Math.max(0, x - offset);
				ir = (y * width + xr) * 4;
				ib = (y * width + xb) * 4;
				data[i]     = copy[ir];
				data[i + 2] = copy[ib + 2];
			}
		}
	}

	function applyVignette() {
		ctx.save();
		ctx.globalCompositeOperation = "multiply";
		var g = ctx.createRadialGradient(OUT_W * 0.5, OUT_H * 0.42, OUT_H * 0.12, OUT_W * 0.5, OUT_H * 0.5, OUT_W * 0.86);
		g.addColorStop(0, "rgba(255,255,255,1)");
		g.addColorStop(0.45, "rgba(210,210,210,1)");
		g.addColorStop(1, "rgba(0,0,0,1)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, OUT_W, OUT_H);
		ctx.restore();
	}

	function drawParticles(seed) {
		var rand = seededRandom(seed + 999);
		var count = 70;
		var k, px, py, radius, alpha;
		ctx.save();
		for (k = 0; k < count; k++) {
			px = rand() * OUT_W;
			py = rand() * OUT_H;
			radius = 1 + rand() * 3.5;
			alpha = 0.18 + rand() * 0.52;
			ctx.beginPath();
			ctx.arc(px, py, radius, 0, Math.PI * 2);
			if (rand() > 0.65) {
				ctx.fillStyle = "rgba(255,255,255," + alpha.toFixed(2) + ")";
			} else {
				ctx.fillStyle = "rgba(" + ACCENT_R + "," + ACCENT_G + "," + ACCENT_B + "," + alpha.toFixed(2) + ")";
			}
			ctx.fill();
		}
		ctx.strokeStyle = "rgba(" + ACCENT_R + "," + ACCENT_G + "," + ACCENT_B + ",0.28)";
		ctx.lineWidth = 0.8;
		for (k = 0; k < 10; k++) {
			px = rand() * OUT_W;
			py = rand() * OUT_H;
			var len = 18 + rand() * 70;
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.lineTo(px + len * (rand() - 0.5), py + len * (rand() - 0.5));
			ctx.stroke();
		}
		ctx.restore();
	}

	function drawCRT() {
		ctx.save();

		/* Líneas de escaneo: 1px oscuro cada 3 filas */
		ctx.globalCompositeOperation = "multiply";
		ctx.fillStyle = "rgba(0,0,0,0.48)";
		for (var y = 0; y < OUT_H; y += 3) {
			ctx.fillRect(0, y, OUT_W, 1);
		}

		/* Fósforos RGB: columnas tenues R-G-B repetidas */
		var pat = getCRTPattern();
		if (pat) {
			ctx.globalCompositeOperation = "screen";
			ctx.globalAlpha = 0.022;
			ctx.fillStyle = pat;
			ctx.fillRect(0, 0, OUT_W, OUT_H);
		}

		/* Grano estático */
		ctx.globalCompositeOperation = "source-over";
		ctx.globalAlpha = 1;
		for (var i = 0; i < 1600; i++) {
			ctx.fillStyle = "rgba(255,255,255," + (Math.random() * 0.12).toFixed(3) + ")";
			ctx.fillRect(
				Math.floor(Math.random() * OUT_W),
				Math.floor(Math.random() * OUT_H),
				1, 1
			);
		}

		ctx.restore();
	}

	function drawASCII() {
		var cellW = 8;
		var cellH = 10;
		var cols = Math.floor(OUT_W / cellW);
		var rows = Math.floor(OUT_H / cellH);
		var chars = " .,:;=+*#%@";
		var last = chars.length - 1;

		/* Samplear el canvas procesado a resolución de grilla */
		var off = document.createElement("canvas");
		off.width = cols;
		off.height = rows;
		var offCtx = off.getContext("2d");
		offCtx.drawImage(canvas, 0, 0, cols, rows);
		var pixels = offCtx.getImageData(0, 0, cols, rows).data;

		/* Redibujar como caracteres coloreados sobre negro */
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, OUT_W, OUT_H);
		ctx.font = cellH + 'px "Geist Mono", monospace';
		ctx.textBaseline = "top";

		var row, col, i, r, g, b, lum, ch;
		for (row = 0; row < rows; row++) {
			for (col = 0; col < cols; col++) {
				i = (row * cols + col) * 4;
				r = pixels[i];
				g = pixels[i + 1];
				b = pixels[i + 2];
				lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
				ch = chars[Math.round(lum * last)];
				if (ch === " ") continue;
				ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
				ctx.fillText(ch, col * cellW, row * cellH);
			}
		}
	}

	function drawBranding() {
		var logoSize = 112;
		var pad = 56;
		if (logoImg.complete && logoImg.naturalWidth > 0) {
			ctx.save();
			ctx.globalAlpha = 0.92;
			ctx.shadowColor = "rgba(34, 238, 201, 0.5)";
			ctx.shadowBlur = 24;
			drawImageContain(logoImg, OUT_W - logoSize - pad, pad, logoSize, logoSize);
			ctx.restore();
		}

		ctx.save();
		ctx.font = '700 30px "Orbitron", "Space Grotesk", sans-serif';
		ctx.fillStyle = "rgba(232, 232, 232, 0.92)";
		ctx.shadowColor = "rgba(0,0,0,0.75)";
		ctx.shadowBlur = 8;
		ctx.shadowOffsetY = 2;
		var text = "@HEO.OFICIAL";
		var tw = ctx.measureText(text).width;
		ctx.fillText(text, OUT_W - tw - pad, OUT_H - pad - 10);

		ctx.font = '600 19px "Orbitron", "Space Grotesk", sans-serif';
		ctx.fillStyle = "rgba(34, 238, 201, 0.88)";
		var sub = "Mitos De Un Futuro Cercano";
		var sw = ctx.measureText(sub).width;
		ctx.fillText(sub, OUT_W - sw - pad, OUT_H - pad - 52);
		ctx.restore();
	}

	function render() {
		if (!hasImage || !userImg.complete || userImg.naturalWidth === 0) return;

		canvas.width = OUT_W;
		canvas.height = OUT_H;

		drawCoverImage(userImg, OUT_W, OUT_H);

		var imageData = ctx.getImageData(0, 0, OUT_W, OUT_H);
		if (activeFx.tint)   applyAlbumColorGrade(imageData.data);
		if (activeFx.glitch) applyGlitch(imageData, OUT_W, OUT_H, glitchSeed);
		if (activeFx.chroma) applyChromaAberration(imageData.data, OUT_W, OUT_H);
		ctx.putImageData(imageData, 0, 0);

		if (activeFx.vignette)  applyVignette();
		if (activeFx.crt)       drawCRT();
		if (activeFx.particles) drawParticles(glitchSeed);
		if (activeFx.ascii)     drawASCII();

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

	var fxPills = document.querySelectorAll(".fx-pill[data-fx]");
	Array.prototype.forEach.call(fxPills, function (btn) {
		btn.addEventListener("click", function () {
			var fx = btn.getAttribute("data-fx");
			if (!(fx in activeFx)) return;
			activeFx[fx] = !activeFx[fx];
			btn.classList.toggle("is-active", activeFx[fx]);
			render();
		});
	});

	logoImg.onload = function () {
		if (hasImage) render();
	};
	logoImg.src = "../images/ojo-goth-blanco.png";

	if (igLink) {
		igLink.href = "https://www.instagram.com/heo.oficial/";
	}
})();
