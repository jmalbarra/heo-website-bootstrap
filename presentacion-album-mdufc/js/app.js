(function () {
	"use strict";

	var POLL_MS = 3000;
	var STORAGE_DEV = "presentacion_mdufc_dev_index";
	var API_STATE = "api/state.php";

	var MSG_FUTURO =
		"Nomios está descifrando el mensaje…";

	var state = {
		setlist: null,
		currentIndex: 0,
		devMode: false,
		pollTimer: null,
		lastError: null,
	};

	function $(sel, root) {
		return (root || document).querySelector(sel);
	}

	function isDevMode() {
		try {
			var p = new URLSearchParams(window.location.search);
			if (p.get("dev") === "1") return true;
		} catch (e) {}
		return false;
	}

	function getSongIndexById(id) {
		if (!state.setlist || !state.setlist.songs) return -1;
		for (var i = 0; i < state.setlist.songs.length; i++) {
			if (state.setlist.songs[i].id === id) return i;
		}
		return -1;
	}

	function isUnlocked(songIndex) {
		return songIndex <= state.currentIndex;
	}

	function parseHash() {
		var h = window.location.hash.replace(/^#/, "");
		if (!h || h === "/" || h === "list") return { view: "list" };
		var parts = h.split("/");
		if (parts[0] === "song" && parts[1]) {
			return { view: "detail", id: decodeURIComponent(parts[1]) };
		}
		return { view: "list" };
	}

	function setHashList() {
		window.location.hash = "";
	}

	function setHashSong(id) {
		window.location.hash = "song/" + encodeURIComponent(id);
	}

	function isPausa(song) {
		return song && song.kind === "pausa";
	}

	/** Último ítem que no es pausa, en o antes del cursor del operador (para “Ahora” / pasado). */
	function lastNonPausaIndexAtOrBefore(cursor) {
		var songs = state.setlist && state.setlist.songs ? state.setlist.songs : [];
		var i = Math.min(Math.max(0, cursor), songs.length - 1);
		while (i >= 0 && isPausa(songs[i])) i--;
		return i;
	}

	function fetchState() {
		if (state.devMode) {
			var raw = localStorage.getItem(STORAGE_DEV);
			var n = raw === null ? 0 : parseInt(raw, 10);
			if (isNaN(n)) n = 0;
			state.currentIndex = n;
			state.lastError = null;
			render();
			return;
		}

		fetch(API_STATE, { cache: "no-store" })
			.then(function (r) {
				if (!r.ok) throw new Error("HTTP " + r.status);
				return r.json();
			})
			.then(function (data) {
				var idx = parseInt(data.currentIndex, 10);
				if (isNaN(idx)) idx = 0;
				state.currentIndex = idx;
				state.lastError = null;
				render();
			})
			.catch(function () {
				state.lastError = "No se pudo sincronizar. Reintentando…";
				render();
			});
	}

	function startPolling() {
		if (state.pollTimer) clearInterval(state.pollTimer);
		fetchState();
		if (!state.devMode) {
			state.pollTimer = setInterval(fetchState, POLL_MS);
		}
	}

	function renderList() {
		var listEl = $("#view-list");
		var detailEl = $("#view-detail");
		if (!listEl || !detailEl) return;
		listEl.classList.remove("hidden");
		detailEl.classList.add("hidden");

		var meta = state.setlist.meta || {};
		$("#meta-title").textContent = meta.title || "Setlist";
		$("#meta-subtitle").textContent = meta.subtitle || "";
		$("#meta-event").textContent = meta.eventLine || "";

		var ul = $("#track-list");
		ul.innerHTML = "";
		var songs = state.setlist.songs || [];
		var lastSongIdx = lastNonPausaIndexAtOrBefore(state.currentIndex);

		songs.forEach(function (song, index) {
			if (isPausa(song)) return;

			var li = document.createElement("li");
			var btn = document.createElement("button");
			btn.type = "button";
			btn.className = "track-item";

			var lockedFuture = index > state.currentIndex;

			if (lastSongIdx >= 0) {
				if (index < lastSongIdx) btn.classList.add("track-item--past");
				else if (index === lastSongIdx) btn.classList.add("track-item--current");
				else btn.classList.add("track-item--locked");
			} else {
				if (index < state.currentIndex) btn.classList.add("track-item--past");
				else if (index > state.currentIndex) btn.classList.add("track-item--locked");
				else btn.classList.add("track-item--locked");
			}

			var row = document.createElement("div");
			row.className = "track-row";

			var title = document.createElement("span");
			title.className = "track-title";
			if (lockedFuture) {
				title.classList.add("track-title--pending");
				title.textContent = MSG_FUTURO;
			} else {
				title.textContent = song.title || "Sin título";
			}

			var badge = document.createElement("span");
			badge.className = "track-badge";
			if (lastSongIdx >= 0) {
				if (index < lastSongIdx) badge.textContent = "Listo";
				else if (index === lastSongIdx) badge.textContent = "Ahora";
				else badge.textContent = "···";
			} else {
				if (index < state.currentIndex) badge.textContent = "Listo";
				else if (index > state.currentIndex) badge.textContent = "···";
				else badge.textContent = "···";
			}

			row.appendChild(title);
			row.appendChild(badge);
			btn.appendChild(row);

			if (isUnlocked(index)) {
				btn.addEventListener("click", function () {
					setHashSong(song.id);
				});
			} else {
				btn.setAttribute("disabled", "disabled");
				btn.setAttribute("aria-disabled", "true");
				btn.setAttribute(
					"aria-label",
					"Información aún no disponible. Nomios está descifrando el mensaje."
				);
			}

			li.appendChild(btn);
			ul.appendChild(li);
		});

		var statusEl = $("#status-bar");
		if (state.devMode) {
			statusEl.textContent = "Modo desarrollo: índice en este navegador (localStorage).";
			statusEl.classList.remove("status-bar--error");
		} else if (state.lastError) {
			statusEl.textContent = state.lastError;
			statusEl.classList.add("status-bar--error");
		} else {
			statusEl.textContent = "Sincronizado · actualización cada " + POLL_MS / 1000 + " s";
			statusEl.classList.remove("status-bar--error");
		}

	}

	function renderDetail(id) {
		var listEl = $("#view-list");
		var detailEl = $("#view-detail");
		if (!listEl || !detailEl) return;

		var idx = getSongIndexById(id);
		var song = idx >= 0 ? state.setlist.songs[idx] : null;

		if (!song || !isUnlocked(idx)) {
			setHashList();
			return;
		}

		if (isPausa(song)) {
			setHashList();
			return;
		}

		listEl.classList.add("hidden");
		detailEl.classList.remove("hidden");

		$("#detail-title").textContent = song.title || "";
		$("#about-text").textContent = song.about || "";
		var lyricsEl = $("#lyrics-text");
		lyricsEl.textContent = song.lyrics || "";

		$("#btn-back").onclick = function () {
			setHashList();
		};

	}

	function render() {
		if (!state.setlist) return;
		var songs = state.setlist.songs || [];
		var max = Math.max(0, songs.length - 1);
		state.currentIndex = Math.min(Math.max(0, state.currentIndex), max);
		var route = parseHash();
		if (route.view === "detail" && route.id) {
			renderDetail(route.id);
		} else {
			renderList();
		}
	}

	function init() {
		state.devMode = isDevMode();

		fetch("data/setlist.json", { cache: "no-store" })
			.then(function (r) {
				if (!r.ok) throw new Error("setlist");
				return r.json();
			})
			.then(function (data) {
				state.setlist = data;
				window.addEventListener("hashchange", render);
				startPolling();
				render();
			})
			.catch(function () {
				$("#meta-title").textContent = "Error";
				$("#meta-subtitle").textContent = "No se pudo cargar la lista.";
			});

		if (state.devMode) {
			var b = document.createElement("div");
			b.className = "dev-banner";
			b.textContent = "Dev · ?dev=1 — índice solo en este dispositivo";
			document.body.appendChild(b);
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
