/*
 * Popup de la Unión.
 *
 * Invita a sumarse a la Unión mientras la persona navega el sitio. El alta va
 * al mismo endpoint que la página /union, con source="popup", así en el panel
 * se puede medir cuánta gente entra por este canal frente al disco, el setlist
 * y la mesa de merch.
 *
 * Reglas para no ser molesto (que es lo que arruina un popup):
 *  - No salta al entrar: espera a que la persona esté enganchada (unos segundos
 *    o que scrollee una parte de la página), lo que pase primero.
 *  - Se muestra una sola vez por carga.
 *  - Si ya se unió desde este dispositivo, no aparece nunca más.
 *  - Si lo cierra sin unirse, no vuelve a molestar por unas semanas.
 *  - Se cierra con la X, con Escape o tocando afuera, y no bloquea la navegación.
 *  - En el celular sube desde abajo; en desktop es un modal centrado.
 *
 * Es autocontenido: crea su propio HTML y sus estilos, no depende del CSS del
 * sitio. Para usarlo en una página alcanza con incluir este script.
 */
(function () {
	"use strict";

	var JOIN_URL = 'https://nomios-ai-jmalbarras-projects.vercel.app/union/join';

	// Cuándo aparece y cada cuánto insistir.
	var DELAY_MS = 18000;        // fallback por tiempo
	var SCROLL_TRIGGER = 0.40;   // o cuando scrollea el 40% de la página
	var SUPPRESS_DAYS = 21;      // si lo cierra, no vuelve por este tiempo

	var K_CODE = 'heo_union_code';       // lo comparte con /union: quien ya está adentro
	var K_OFF = 'heo_union_popup_off';   // hasta cuándo no mostrarlo de nuevo

	var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	var reduce = false;
	try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) {}

	function ls(get, key, val) {
		// localStorage envuelto: en incógnito o con storage bloqueado tira, y el
		// popup tiene que seguir andando igual.
		try {
			if (get) return window.localStorage.getItem(key);
			window.localStorage.setItem(key, val);
		} catch (_) { return null; }
	}

	function noMostrar() {
		// En la propia /union no tiene sentido (ya vinieron a anotarse).
		if (/\/union(\/|$)/.test(window.location.pathname)) return true;
		if (ls(true, K_CODE)) return true;                 // ya es miembro
		var off = parseInt(ls(true, K_OFF) || '0', 10);
		if (off && Date.now() < off) return true;          // lo cerró hace poco
		return false;
	}

	if (noMostrar()) return;

	/* ---------- Estilos ---------- */
	var css = '' +
		'#heo-up-back{position:fixed;inset:0;z-index:99999;display:flex;align-items:flex-end;justify-content:center;' +
		'background:rgba(3,3,6,.72);opacity:0;transition:opacity .28s ease;padding:0;}' +
		'#heo-up-back.on{opacity:1;}' +
		'#heo-up{width:100%;max-width:460px;background:#050507;color:#eaeaea;border:1px solid #14554a;' +
		'border-radius:14px 14px 0 0;box-shadow:0 -12px 40px rgba(0,0,0,.55);padding:26px 22px 22px;' +
		'font-family:"Geist Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;' +
		'transform:translateY(24px);transition:transform .3s ease;position:relative;}' +
		'#heo-up-back.on #heo-up{transform:translateY(0);}' +
		'@media(min-width:600px){#heo-up-back{align-items:center;padding:16px;}#heo-up{border-radius:14px;}}' +
		'#heo-up-x{position:absolute;top:12px;right:14px;background:none;border:0;color:#8a8a8a;font-size:22px;' +
		'line-height:1;cursor:pointer;padding:4px;}' +
		'#heo-up-x:hover{color:#fff;}' +
		'#heo-up .kick{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#22eec9;margin:0 0 12px;}' +
		'#heo-up h2{font-size:21px;line-height:1.3;color:#fff;margin:0 0 8px;font-weight:700;}' +
		'#heo-up p.sub{font-size:13.5px;line-height:1.6;color:#b4b4b4;margin:0 0 18px;}' +
		'#heo-up label{display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8a8a8a;margin:0 0 5px;}' +
		'#heo-up input[type=text],#heo-up input[type=email]{width:100%;box-sizing:border-box;background:#0a1613;' +
		'border:1px solid #14554a;border-radius:7px;color:#fff;font:inherit;font-size:15px;padding:11px 12px;margin:0 0 13px;}' +
		'#heo-up input:focus{outline:none;border-color:#22eec9;}' +
		'#heo-up button.go{width:100%;background:#22eec9;color:#050507;border:0;border-radius:7px;font:inherit;' +
		'font-size:15px;font-weight:700;padding:13px;cursor:pointer;}' +
		'#heo-up button.go:disabled{opacity:.6;cursor:default;}' +
		'#heo-up .fine{font-size:11px;line-height:1.6;color:#6e6e6e;margin:13px 0 0;}' +
		'#heo-up .fine a{color:#22eec9;}' +
		'#heo-up label.chk{display:flex;gap:9px;align-items:flex-start;text-transform:none;letter-spacing:0;' +
		'font-size:12px;line-height:1.5;color:#b4b4b4;margin:0 0 15px;cursor:pointer;}' +
		'#heo-up label.chk input{margin:1px 0 0;flex:0 0 auto;width:16px;height:16px;accent-color:#22eec9;cursor:pointer;}' +
		'#heo-up label.chk a{color:#22eec9;}' +
		'#heo-up .err{font-size:12.5px;color:#ff6b6b;margin:0 0 12px;min-height:1px;}' +
		'#heo-up .done h2{color:#22eec9;}' +
		'#heo-up .num{font-size:30px;font-weight:700;color:#22eec9;margin:6px 0 0;}';
	var st = document.createElement('style');
	st.textContent = css;
	document.head.appendChild(st);

	/* ---------- HTML ---------- */
	var back = document.createElement('div');
	back.id = 'heo-up-back';
	back.setAttribute('role', 'dialog');
	back.setAttribute('aria-modal', 'true');
	back.setAttribute('aria-label', 'Sumate a la Unión');
	back.innerHTML =
		'<div id="heo-up">' +
			'<button id="heo-up-x" type="button" aria-label="Cerrar">&times;</button>' +
			'<div id="heo-up-form">' +
				'<p class="kick">Hacia el Ocaso</p>' +
				'<h2>Sos parte de la banda. Hacelo oficial.</h2>' +
				'<p class="sub">Sumate a la Unión y recibí tu número de miembro. Te escribimos cuando haya shows, lanzamientos y cosas que no salen en redes.</p>' +
				'<p class="err" id="heo-up-err" hidden></p>' +
				'<label for="heo-up-name">Nombre</label>' +
				'<input type="text" id="heo-up-name" autocomplete="name" maxlength="64">' +
				'<label for="heo-up-mail">Email</label>' +
				'<input type="email" id="heo-up-mail" autocomplete="email" inputmode="email" maxlength="128">' +
				'<label class="chk"><input type="checkbox" id="heo-up-terms"> Acepto recibir novedades por mail y los <a href="/union/" target="_blank" rel="noopener">términos</a>.</label>' +
				'<button type="button" class="go" id="heo-up-go">Cuenten conmigo</button>' +
				'<p class="fine">Te podés dar de baja cuando quieras respondiendo cualquier mail.</p>' +
			'</div>' +
		'</div>';

	var el = {};
	function cerrar(recordar) {
		back.classList.remove('on');
		if (recordar) ls(false, K_OFF, String(Date.now() + SUPPRESS_DAYS * 864e5));
		setTimeout(function () { if (back.parentNode) back.parentNode.removeChild(back); }, reduce ? 0 : 320);
		document.removeEventListener('keydown', onEsc);
	}
	function onEsc(e) { if (e.key === 'Escape') cerrar(true); }

	function showError(msg) {
		el.err.textContent = msg;
		el.err.hidden = false;
	}

	function pad(n) { n = parseInt(n, 10) || 0; return (n < 1000 ? ('0000' + n).slice(-4) : String(n)); }

	function gracias(data) {
		var wrap = document.getElementById('heo-up-form');
		var num = (data && data.number) ? '<p class="num">Nº ' + pad(data.number) + '</p>' : '';
		wrap.className = 'done';
		wrap.innerHTML =
			'<p class="kick">Hacia el Ocaso</p>' +
			'<h2>Listo, sos parte de la Unión.</h2>' + num +
			'<p class="sub" style="margin-top:12px;">Te llega un mail con tu credencial. Si no aparece, mirá en spam. Ahora seguí, que hay más.</p>';
		setTimeout(function () { cerrar(false); }, 2600);
	}

	function enviar() {
		el.err.hidden = true;
		var name = el.name.value.trim();
		var email = el.mail.value.trim().toLowerCase();
		if (!name) { showError('Nos falta tu nombre.'); el.name.focus(); return; }
		if (!EMAIL_RE.test(email)) { showError('Ese email no parece válido.'); el.mail.focus(); return; }
		if (!el.terms.checked) { showError('Necesitamos que aceptes los términos.'); el.terms.focus(); return; }

		el.go.disabled = true;
		el.go.textContent = 'Un segundo…';

		fetch(JOIN_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: name, email: email, source: 'popup' })
		}).then(function (res) {
			return res.json().then(function (data) { return { ok: res.ok, data: data }; });
		}).then(function (r) {
			if (!r.ok || !r.data.ok) {
				throw new Error(r.data && r.data.error ? r.data.error : 'No pudimos completar el alta.');
			}
			try { if (r.data.code) ls(false, K_CODE, r.data.code); } catch (_) {}
			gracias(r.data);
		}).catch(function (err) {
			showError(err.message || 'La señal no llegó. Probá de nuevo en un momento.');
			el.go.disabled = false;
			el.go.textContent = 'Cuenten conmigo';
		});
	}

	var mostrado = false;
	function mostrar() {
		if (mostrado || noMostrar()) return;
		mostrado = true;
		document.body.appendChild(back);
		el.err = document.getElementById('heo-up-err');
		el.name = document.getElementById('heo-up-name');
		el.mail = document.getElementById('heo-up-mail');
		el.terms = document.getElementById('heo-up-terms');
		el.go = document.getElementById('heo-up-go');
		document.getElementById('heo-up-x').addEventListener('click', function () { cerrar(true); });
		back.addEventListener('click', function (e) { if (e.target === back) cerrar(true); });
		el.go.addEventListener('click', enviar);
		el.mail.addEventListener('keydown', function (e) { if (e.key === 'Enter') enviar(); });
		document.addEventListener('keydown', onEsc);
		// forzar reflow para que la transición corra
		void back.offsetWidth;
		back.classList.add('on');
		try { el.name.focus(); } catch (_) {}
	}

	/* ---------- Disparadores: tiempo o scroll, lo que pase primero ---------- */
	var t = setTimeout(mostrar, DELAY_MS);
	function onScroll() {
		var h = document.documentElement;
		var alcanzado = (h.scrollTop + window.innerHeight) / (h.scrollHeight || 1);
		if (alcanzado >= SCROLL_TRIGGER) {
			clearTimeout(t);
			window.removeEventListener('scroll', onScroll);
			mostrar();
		}
	}
	window.addEventListener('scroll', onScroll, { passive: true });
})();
