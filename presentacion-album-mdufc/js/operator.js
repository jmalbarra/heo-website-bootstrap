(function () {
	"use strict";

	var API_SET = "api/set.php";
	var STORAGE_SECRET = "presentacion_mdufc_operator_secret";
	var STORAGE_DEV = "presentacion_mdufc_dev_index";

	function $(sel) {
		return document.querySelector(sel);
	}

	function isDevMode() {
		try {
			return new URLSearchParams(window.location.search).get("dev") === "1";
		} catch (e) {
			return false;
		}
	}

	var state = {
		setlist: null,
		currentIndex: 0,
		devMode: false,
	};

	function loadSetlist() {
		return fetch("data/setlist.json", { cache: "no-store" }).then(function (r) {
			if (!r.ok) throw new Error("setlist");
			return r.json();
		});
	}

	function fetchState() {
		if (state.devMode) {
			var raw = localStorage.getItem(STORAGE_DEV);
			var n = raw === null ? 0 : parseInt(raw, 10);
			if (isNaN(n)) n = 0;
			return Promise.resolve({ currentIndex: n });
		}
		return fetch("api/state.php", { cache: "no-store" }).then(function (r) {
			if (!r.ok) throw new Error("state");
			return r.json();
		});
	}

	function maxIndex() {
		var n = (state.setlist && state.setlist.songs && state.setlist.songs.length) || 0;
		return Math.max(0, n - 1);
	}

	function updatePreview() {
		var songs = (state.setlist && state.setlist.songs) || [];
		var el = $("#preview-song");
		if (!el) return;
		var s = songs[state.currentIndex];
		el.textContent = s ? s.title : "—";
		$("#preview-index").textContent = String(state.currentIndex + 1) + " / " + songs.length;
	}

	function setStatus(msg, isErr) {
		var bar = $("#operator-status");
		if (!bar) return;
		bar.textContent = msg;
		bar.classList.toggle("status-bar--error", !!isErr);
	}

	function sendAction(action) {
		if (state.devMode) {
			var max = maxIndex();
			var raw = localStorage.getItem(STORAGE_DEV);
			var idx = raw === null ? 0 : parseInt(raw, 10);
			if (isNaN(idx)) idx = 0;
			if (action === "next") idx = Math.min(max, idx + 1);
			else if (action === "prev") idx = Math.max(0, idx - 1);
			else if (action === "reset") idx = 0;
			localStorage.setItem(STORAGE_DEV, String(idx));
			state.currentIndex = idx;
			updatePreview();
			setStatus("Modo dev · índice local " + idx, false);
			return;
		}

		var secret = ($("#operator-secret") && $("#operator-secret").value) || "";
		if (!secret.trim()) {
			setStatus("Ingresá el secreto del operador (config.php en el servidor).", true);
			return;
		}

		setStatus("Enviando…", false);

		fetch(API_SET, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ secret: secret, action: action }),
		})
			.then(function (r) {
				return r.json().then(function (data) {
					return { ok: r.ok, status: r.status, data: data };
				});
			})
			.then(function (res) {
				if (!res.ok || !res.data.ok) {
					var err = (res.data && res.data.error) || "Error " + res.status;
					throw new Error(err);
				}
				state.currentIndex = res.data.currentIndex;
				try {
					sessionStorage.setItem(STORAGE_SECRET, secret);
				} catch (e) {}
				updatePreview();
				setStatus("Listo · índice " + state.currentIndex, false);
			})
			.catch(function (e) {
				setStatus(e.message || "Falló la petición.", true);
			});
	}

	function syncFromServer() {
		if (state.devMode) {
			fetchState()
				.then(function (data) {
					var idx = parseInt(data.currentIndex, 10);
					if (isNaN(idx)) idx = 0;
					state.currentIndex = Math.min(Math.max(0, idx), maxIndex());
					updatePreview();
					setStatus("Dev · índice " + state.currentIndex, false);
				})
				.catch(function () {});
			return;
		}
		fetchState()
			.then(function (data) {
				var idx = parseInt(data.currentIndex, 10);
				if (isNaN(idx)) idx = 0;
				state.currentIndex = Math.min(Math.max(0, idx), maxIndex());
				updatePreview();
				setStatus("Estado remoto: índice " + state.currentIndex, false);
			})
			.catch(function () {
				setStatus("No se pudo leer api/state.php (¿servidor PHP local?)", true);
			});
	}

	function init() {
		state.devMode = isDevMode();
		if (state.devMode) {
			var b = document.createElement("div");
			b.className = "dev-banner";
			b.textContent = "Dev · ?dev=1 — mismo localStorage que el público";
			document.body.appendChild(b);
			var sec = $("#operator-secret");
			if (sec) {
				sec.disabled = true;
				sec.placeholder = "No usado en modo dev";
			}
		}

		var saved = "";
		try {
			saved = sessionStorage.getItem(STORAGE_SECRET) || "";
		} catch (e) {}
		if (saved && $("#operator-secret") && !state.devMode) $("#operator-secret").value = saved;

		loadSetlist()
			.then(function (data) {
				state.setlist = data;
				return fetchState();
			})
			.then(function (data) {
				var idx = parseInt(data.currentIndex, 10);
				if (isNaN(idx)) idx = 0;
				state.currentIndex = Math.min(Math.max(0, idx), maxIndex());
				updatePreview();
				setStatus("Conectado.", false);
			})
			.catch(function () {
				setStatus("Revisá data/setlist.json y que PHP esté activo.", true);
			});

		$("#btn-next").addEventListener("click", function () {
			sendAction("next");
		});
		$("#btn-prev").addEventListener("click", function () {
			sendAction("prev");
		});
		$("#btn-reset").addEventListener("click", function () {
			if (window.confirm("¿Volver al inicio del set (índice 0)?")) sendAction("reset");
		});
		$("#btn-refresh").addEventListener("click", syncFromServer);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
