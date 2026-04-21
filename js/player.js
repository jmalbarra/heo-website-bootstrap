(function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════════════
     TRACK LIST
     Reemplazá los src por las rutas reales a tus MP3.
     Ejemplo: src: "audio/01-intro.mp3"
  ═══════════════════════════════════════════════════════════════ */
  var TRACKS = [
    { title: "Demo I",   src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Demo II",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Demo III", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "Demo IV",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "Demo V",   src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  ];

  var ALBUM_TITLE  = "Mitos De Un Futuro Cercano";
  var ALBUM_ARTIST = "Hacia el Ocaso";
  var ALBUM_ART    = "images/album-cover.jpg"; /* tapa del disco */

  /* ═══════════════════════════════════════════════════════════════
     STATE
  ═══════════════════════════════════════════════════════════════ */
  var idx      = 0;
  var playing  = false;
  var audioCtx = null;
  var analyser = null;
  var freqData = null;
  var animId   = null;

  /* ═══════════════════════════════════════════════════════════════
     ELEMENTS
  ═══════════════════════════════════════════════════════════════ */
  var audio    = document.getElementById("wp-audio");
  var vizEl    = document.getElementById("wp-viz");
  var vCtx     = vizEl ? vizEl.getContext("2d") : null;
  var marquee  = document.getElementById("wp-marquee");
  var elElap   = document.getElementById("wp-elapsed");
  var elTotal  = document.getElementById("wp-total");
  var elTrackN = document.getElementById("wp-trackn");
  var seekBar  = document.getElementById("wp-seek");
  var seekFill = document.getElementById("wp-seek-fill");
  var plList   = document.getElementById("wp-playlist");
  var plCount  = document.getElementById("wp-pl-count");
  var btnPlay  = document.getElementById("wp-play");
  var btnStop  = document.getElementById("wp-stop");
  var btnPrev  = document.getElementById("wp-prev");
  var btnNext  = document.getElementById("wp-next");
  var volRange = document.getElementById("wp-vol");

  /* ═══════════════════════════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════════════════════════ */
  function fmt(s) {
    if (!isFinite(s) || s < 0) return "0:00";
    var m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ":" + (sec < 10 ? "0" : "") + sec;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function setPlayState(p) {
    playing = p;
    if (btnPlay) {
      btnPlay.querySelector(".ic-play").hidden  =  p;
      btnPlay.querySelector(".ic-pause").hidden = !p;
      btnPlay.setAttribute("aria-label", p ? "Pausar" : "Reproducir");
    }
    if (navigator.mediaSession) {
      navigator.mediaSession.playbackState = p ? "playing" : "paused";
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     WEB AUDIO + VISUALIZER
  ═══════════════════════════════════════════════════════════════ */
  function initWebAudio() {
    if (audioCtx) {
      if (audioCtx.state === "suspended") audioCtx.resume();
      return;
    }
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var src = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      freqData = new Uint8Array(analyser.frequencyBinCount); /* 64 bins */
      src.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch (e) {
      audioCtx = null;
    }
  }

  function resizeViz() {
    if (!vizEl) return;
    var w = vizEl.parentElement ? vizEl.parentElement.clientWidth - 24 : 300;
    if (w > 0) vizEl.width = w;
  }

  function drawViz() {
    if (!vCtx) return;
    var W = vizEl.width, H = vizEl.height;

    vCtx.fillStyle = "#030604";
    vCtx.fillRect(0, 0, W, H);

    if (analyser && playing) {
      analyser.getByteFrequencyData(freqData);
      var bins = freqData.length;
      var barW = Math.max(1, Math.floor(W / bins) - 1);
      for (var i = 0; i < bins; i++) {
        var v  = freqData[i] / 255;
        var bh = Math.max(2, Math.floor(v * H));
        var x  = Math.floor(i * (W / bins));
        /* bar */
        vCtx.fillStyle = "rgba(34,238,201," + (0.22 + v * 0.78).toFixed(2) + ")";
        vCtx.fillRect(x, H - bh, barW, bh);
        /* peak pixel */
        if (bh > 3) {
          vCtx.fillStyle = "rgba(200,255,245,0.55)";
          vCtx.fillRect(x, H - bh, barW, 1);
        }
      }
    } else {
      /* idle: flat line */
      vCtx.strokeStyle = "rgba(34,238,201,0.16)";
      vCtx.lineWidth = 1;
      vCtx.beginPath();
      vCtx.moveTo(0, Math.floor(H / 2));
      vCtx.lineTo(W, Math.floor(H / 2));
      vCtx.stroke();
    }

    animId = requestAnimationFrame(drawViz);
  }

  function startViz() { if (!animId) drawViz(); }
  function stopViz()  { if (animId) { cancelAnimationFrame(animId); animId = null; } }

  /* ═══════════════════════════════════════════════════════════════
     MEDIA SESSION — lock screen controls
  ═══════════════════════════════════════════════════════════════ */
  function updateMediaSession() {
    if (!navigator.mediaSession) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title:   TRACKS[idx].title,
      artist:  ALBUM_ARTIST,
      album:   ALBUM_TITLE,
      artwork: [{ src: ALBUM_ART, sizes: "512x512", type: "image/jpeg" }],
    });
  }

  function setupMediaSession() {
    if (!navigator.mediaSession) return;
    navigator.mediaSession.setActionHandler("play",          function () { doPlay(); });
    navigator.mediaSession.setActionHandler("pause",         function () { doPause(); });
    navigator.mediaSession.setActionHandler("previoustrack", function () { goPrev(); });
    navigator.mediaSession.setActionHandler("nexttrack",     function () { goNext(); });
    try {
      navigator.mediaSession.setActionHandler("seekto", function (e) {
        if (e.seekTime !== undefined) audio.currentTime = e.seekTime;
      });
      navigator.mediaSession.setActionHandler("seekforward", function (e) {
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + (e.seekOffset || 10));
      });
      navigator.mediaSession.setActionHandler("seekbackward", function (e) {
        audio.currentTime = Math.max(0, audio.currentTime - (e.seekOffset || 10));
      });
    } catch (e) {}
  }

  /* ═══════════════════════════════════════════════════════════════
     PLAYBACK
  ═══════════════════════════════════════════════════════════════ */
  function loadTrack(i, autoplay) {
    idx = i;
    audio.src = TRACKS[i].src;
    audio.load();
    updateUI();
    updateMediaSession();
    if (autoplay) {
      audio.addEventListener("canplay", function h() {
        audio.removeEventListener("canplay", h);
        doPlay();
      });
    }
  }

  function doPlay() {
    initWebAudio();
    audio.play()
      .then(function () {
        setPlayState(true);
        startViz();
      })
      .catch(function (e) {
        console.warn("[player] play failed:", e.message);
      });
  }

  function doPause() {
    audio.pause();
    setPlayState(false);
  }

  function doStop() {
    audio.pause();
    audio.currentTime = 0;
    setPlayState(false);
    updateProgress(0);
    if (elElap) elElap.textContent = "0:00";
  }

  function goPrev() {
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    loadTrack((idx - 1 + TRACKS.length) % TRACKS.length, playing);
  }

  function goNext() {
    loadTrack((idx + 1) % TRACKS.length, playing);
  }

  /* ═══════════════════════════════════════════════════════════════
     UI
  ═══════════════════════════════════════════════════════════════ */
  function updateProgress(pct) {
    if (seekFill) seekFill.style.width = (Math.min(1, pct) * 100).toFixed(2) + "%";
    if (seekBar)  seekBar.setAttribute("aria-valuenow", Math.round(pct * 100));
  }

  function setMarquee(text) {
    if (!marquee) return;
    /* duplicate for seamless loop */
    var t = text + " ▶ " + text + " ▶ ";
    marquee.textContent = t;
    /* reset animation */
    marquee.style.animation = "none";
    void marquee.offsetWidth;
    marquee.style.animation = "";
  }

  function updateUI() {
    var track = TRACKS[idx];
    setMarquee(ALBUM_ARTIST.toUpperCase() + "  —  " + track.title.toUpperCase());
    if (elTrackN) {
      elTrackN.textContent =
        String(idx + 1).padStart(2, "0") + " ⁄ " + String(TRACKS.length).padStart(2, "0");
    }
    if (elElap)  elElap.textContent  = "0:00";
    if (elTotal) elTotal.textContent = "–:––";
    updateProgress(0);

    /* playlist highlight */
    if (plList) {
      Array.prototype.forEach.call(
        plList.querySelectorAll(".wp-pl-item"),
        function (li, i) {
          li.classList.toggle("is-active", i === idx);
          li.setAttribute("aria-selected", i === idx ? "true" : "false");
          if (i === idx) li.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      );
    }
  }

  function buildPlaylist() {
    if (!plList) return;
    plList.innerHTML = "";
    TRACKS.forEach(function (track, i) {
      var li = document.createElement("li");
      li.className = "wp-pl-item" + (i === idx ? " is-active" : "");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", i === idx ? "true" : "false");
      li.innerHTML =
        '<span class="wp-pl-num">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="wp-pl-title">' + esc(track.title) + "</span>" +
        '<span class="wp-pl-dur">'   + (track.duration ? fmt(track.duration) : "—") + "</span>";
      li.addEventListener("click", function () { loadTrack(i, true); });
      plList.appendChild(li);
    });
    if (plCount) plCount.textContent = TRACKS.length + " TEMAS";
  }

  /* ═══════════════════════════════════════════════════════════════
     AUDIO EVENTS
  ═══════════════════════════════════════════════════════════════ */
  audio.addEventListener("timeupdate", function () {
    if (!audio.duration) return;
    updateProgress(audio.currentTime / audio.duration);
    if (elElap) elElap.textContent = fmt(audio.currentTime);
    if (navigator.mediaSession && navigator.mediaSession.setPositionState) {
      try {
        navigator.mediaSession.setPositionState({
          duration:     audio.duration,
          playbackRate: audio.playbackRate,
          position:     audio.currentTime,
        });
      } catch (e) {}
    }
  });

  audio.addEventListener("loadedmetadata", function () {
    if (elTotal) elTotal.textContent = fmt(audio.duration);
  });

  audio.addEventListener("ended", goNext);

  audio.addEventListener("error", function () {
    console.warn("[player] Error al cargar:", TRACKS[idx] && TRACKS[idx].src);
    setPlayState(false);
    stopViz();
  });

  /* ═══════════════════════════════════════════════════════════════
     SEEK
  ═══════════════════════════════════════════════════════════════ */
  function seekFromEvent(e) {
    if (!seekBar || !audio.duration) return;
    var rect = seekBar.getBoundingClientRect();
    var cx   = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    var pct  = Math.max(0, Math.min(1, (cx - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
    updateProgress(pct);
  }

  if (seekBar) {
    seekBar.addEventListener("click", seekFromEvent);
    seekBar.addEventListener("touchend", function (e) {
      e.preventDefault();
      seekFromEvent(e);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     KEYBOARD
  ═══════════════════════════════════════════════════════════════ */
  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT") return;
    switch (e.code) {
      case "Space":
        e.preventDefault();
        playing ? doPause() : doPlay();
        break;
      case "ArrowRight":
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
        break;
      case "ArrowLeft":
        audio.currentTime = Math.max(0, audio.currentTime - 5);
        break;
    }
  });

  /* ═══════════════════════════════════════════════════════════════
     VOLUME
  ═══════════════════════════════════════════════════════════════ */
  if (volRange) {
    audio.volume = volRange.value / 100;
    volRange.addEventListener("input", function () {
      audio.volume = this.value / 100;
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     RESIZE
  ═══════════════════════════════════════════════════════════════ */
  window.addEventListener("resize", resizeViz);

  /* ═══════════════════════════════════════════════════════════════
     BUTTON EVENTS
  ═══════════════════════════════════════════════════════════════ */
  if (btnPlay) btnPlay.addEventListener("click", function () { playing ? doPause() : doPlay(); });
  if (btnStop) btnStop.addEventListener("click", doStop);
  if (btnPrev) btnPrev.addEventListener("click", goPrev);
  if (btnNext) btnNext.addEventListener("click", goNext);

  /* ═══════════════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════════════ */
  function init() {
    setupMediaSession();
    resizeViz();
    buildPlaylist();
    loadTrack(0, false);
    startViz();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
