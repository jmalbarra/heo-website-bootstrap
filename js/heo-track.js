/*
 * Medición del sitio — un solo lugar.
 *
 * POR QUÉ EXISTE ESTE ARCHIVO
 *
 * Había cuatro pixels de Meta repartidos por el sitio, cada uno viendo una
 * parte del recorrido y ninguno el completo:
 *
 *   799209169403412   home, /union, credencial     ← el que tiene el sitio entero
 *   2233684557132392  spotify.html                 ← campañas viejas
 *   847508594324813   spotify.html (pegado al de arriba, los dos con PageView)
 *   1360622835771508  youtube.html                 ← campañas viejas
 *
 * Una campaña que optimizaba con uno no se enteraba de lo que pasaba en las
 * páginas de los otros. Ahora el recorrido completo lo ve el principal y los
 * IDs viven acá y en ningún otro lado: cambiar uno es cambiar una línea. Por
 * eso tampoco quedan <noscript> con el ID hardcodeado.
 *
 * LOS PIXELS HEREDADOS NO SE TIRAN TODAVÍA
 *
 * Los tres de las campañas viejas siguen cargando y siguen recibiendo PageView,
 * así que sus audiencias no se cortan. Lo que cambia es que los eventos que
 * sirven para optimizar (ViewContent, ClickOut) van sólo al principal, que es
 * el único que ve todo el sitio. Cuando en Events Manager se confirme que los
 * heredados no tienen audiencias vivas, se vacía PIXELS_HEREDADOS y listo.
 *
 * Aclaración por si hay dudas: sacar un pixel de acá no borra nada del lado de
 * Meta. Lo ya registrado queda; lo único que deja de pasar es que entren
 * eventos nuevos.
 *
 * EL PROBLEMA DEL REDIRECT
 *
 * spotify.html y youtube.html redirigían con <meta refresh content="0">. Eso
 * corre una carrera contra el pixel: el navegador se va de la página mientras
 * el beacon todavía está saliendo, y el evento se pierde seguido. Los pixels
 * viejos de esas dos páginas venían midiendo con ese agujero. Por eso acá la
 * navegación no la hace el navegador cuando quiere sino salir(), que manda el
 * evento y recién después se mueve.
 *
 * CÓMO SE USA
 *
 *   <script src="js/heo-track.js"></script>          <!-- en el <head> -->
 *   <a href="..." data-heo-out="spotify">…</a>        <!-- se instrumenta solo -->
 *   HEO.ev('Lead', { content_name: 'union' });        <!-- evento a mano -->
 *
 * QUÉ EVENTOS MANDA
 *
 *   PageView    — a todos los pixels, en toda página que incluya el script.
 *   ViewContent — sólo al principal, donde el HTML declare data-heo-view.
 *   EngagedView — sólo al principal, en las mismas páginas que ViewContent.
 *   ClickOut    — sólo al principal. Evento propio, con destino: 'spotify' | …
 *
 * ClickOut es custom a propósito. En Meta se convierte en Custom Conversion
 * (Events Manager › Custom Conversions › evento ClickOut, destino = spotify) y
 * desde ahí se puede optimizar. Mandarlo como Purchase optimizaría mejor pero
 * ensucia el reporte de ventas de la tienda con streams, que no son plata.
 *
 * Todos menos PageView llevan además utm_source, utm_campaign y utm_content
 * cuando se los puede averiguar, más utm_origen ('url' o 'guardado') que dice
 * de dónde salieron. Con eso el embudo se parte por creativo dentro de Meta,
 * que por su cuenta no mira las UTM. Ver conUtms().
 *
 * POR QUÉ EXISTE EngagedView
 *
 * La primera pauta dejó este número: 545 ViewContent contra 28 ClickOut. El
 * 95% de las visitas cargó la landing y se fue sin tocar nada. Pero ViewContent
 * se dispara al cargar la página, así que mete en la misma bolsa dos cosas que
 * piden arreglos opuestos:
 *
 *   - el que tocó el anuncio sin querer y rebotó en un segundo
 *     → la landing no tiene la culpa; el problema es a quién compra Meta
 *   - el que llegó, miró y no se convenció
 *     → la landing sí tiene la culpa y hay que rehacerla
 *
 * EngagedView separa los dos: se manda cuando la visita acumula VISITA_REAL_MS
 * de página *visible*, o antes si la persona hace algo (scroll, toque, tecla).
 * Mirando ViewContent → EngagedView → ClickOut se ve en qué escalón se cae la
 * gente. Si EngagedView queda muy por debajo de ViewContent, era tráfico
 * accidental; si lo acompaña y el que no sube es ClickOut, es la página.
 *
 * Cuenta tiempo visible y no tiempo de reloj a propósito: una pestaña abierta
 * en segundo plano y nunca mirada no es una visita real.
 */
(function (window, document) {
	"use strict";

	/* ── Lo único que se toca ──────────────────────────────────────────── */

	// El principal: el único que ve el sitio entero. Es también el que ya hace
	// advanced matching con el mail hasheado en el alta de la Unión.
	var PIXEL_PRINCIPAL = '799209169403412';

	// Los de las campañas viejas. Sólo reciben PageView, para no cortarles las
	// audiencias mientras no esté confirmado si tienen algo vivo adentro.
	// Vaciar este array (var PIXELS_HEREDADOS = [];) los deja de cargar.
	var PIXELS_HEREDADOS = [
		'2233684557132392',  // spotify.html
		'847508594324813',   // spotify.html — estaba pegado al anterior
		'1360622835771508'   // youtube.html
	];

	// GA4: si algún día se crea la propiedad, va acá el G-XXXXXXX y se carga
	// solo. Vacío no pide nada a Google. El pixel dice qué anuncio trajo a la
	// gente; GA4 dice qué hizo en el sitio y respeta las UTM, que Meta ignora.
	var GA4_ID = '';

	// Cuánto esperamos al beacon antes de cambiar de página. 300 ms no se
	// notan y alcanzan para que el pedido salga; el timeout de salir() cubre el
	// caso en que fbevents no cargue nunca (bloqueador, red caída).
	var ESPERA_BEACON_MS = 300;
	var ESPERA_MAXIMA_MS = 1200;

	// Página visible que hace falta acumular para contar la visita como real.
	// Tres segundos es poco para leer la página pero mucho para un rebote: el
	// toque accidental se va bastante antes. Subirlo acá sube el listón.
	var VISITA_REAL_MS = 3000;

	/* ── Modo ──────────────────────────────────────────────────────────── */

	// <script src="js/heo-track.js">                      → modo normal
	// <script src="js/heo-track.js" data-heo-modo="redirect"> → modo redirect
	//
	// En modo redirect no se carga fbevents.js ni se manda PageView. Esas
	// páginas se van del navegador en menos de un segundo: para cuando el
	// archivo de Meta terminó de bajar, el evento que estaba en la cola ya no
	// tiene desde dónde salir. Ahí medimos con beacon() y nada más.
	var esteScript = document.currentScript ||
		document.querySelector('script[src*="heo-track"]');
	var MODO = (esteScript && esteScript.getAttribute('data-heo-modo')) || 'normal';
	var MODO_REDIRECT = MODO === 'redirect';

	/* ── Meta Pixel ────────────────────────────────────────────────────── */

	var TODOS = [PIXEL_PRINCIPAL].concat(PIXELS_HEREDADOS);

	if (!MODO_REDIRECT) {
		!function (f, b, e, v, n, t, s) {
			if (f.fbq) return; n = f.fbq = function () {
				n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
			};
			if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
			n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
			s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
		}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

		for (var i = 0; i < TODOS.length; i++) window.fbq('init', TODOS[i]);

		// fbq('track') sin ID va a todos los inicializados: un PageView por pixel,
		// que es justo lo que mantiene vivas las audiencias de los heredados.
		window.fbq('track', 'PageView');
	}

	/* ── GA4 (opcional) ────────────────────────────────────────────────── */

	window.dataLayer = window.dataLayer || [];
	function gtag() { window.dataLayer.push(arguments); }

	if (GA4_ID) {
		var g = document.createElement('script');
		g.async = true;
		g.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID);
		document.head.appendChild(g);
		gtag('js', new Date());
		gtag('config', GA4_ID);
	}

	/* ── UTMs ──────────────────────────────────────────────────────────── */

	// Meta no guarda las UTM: si la persona entra por el anuncio, se va a
	// Spotify y vuelve otro día por Instagram, el segundo visitante parece
	// orgánico. Guardamos el primer contacto para poder atribuir un alta de la
	// Unión a la campaña que la trajo. Se lee con HEO.utms().
	var K_UTM = 'heo_first_touch';

	function leerUtmsDeLaUrl() {
		var p;
		try { p = new URLSearchParams(window.location.search); } catch (_) { return null; }
		var campos = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
		var salida = null;
		for (var i = 0; i < campos.length; i++) {
			var v = p.get(campos[i]);
			if (v) { salida = salida || {}; salida[campos[i]] = v.slice(0, 120); }
		}
		// fbclid solo no alcanza para saber qué anuncio fue, pero sirve para
		// distinguir "vino de un anuncio" de "vino de un link suelto".
		if (p.get('fbclid')) { salida = salida || {}; salida.fbclid = '1'; }
		return salida;
	}

	function guardarPrimerContacto() {
		var nuevas = leerUtmsDeLaUrl();
		if (!nuevas) return;
		try {
			if (window.localStorage.getItem(K_UTM)) return;  // el primero manda
			nuevas.ts = new Date().toISOString();
			window.localStorage.setItem(K_UTM, JSON.stringify(nuevas));
		} catch (_) {}
	}

	function utms() {
		try { return JSON.parse(window.localStorage.getItem(K_UTM) || 'null'); }
		catch (_) { return null; }
	}

	guardarPrimerContacto();

	// Le pega a cada evento de dónde vino la persona.
	//
	// Esto existe porque la atribución por creativo no tenía dónde aterrizar:
	// los anuncios de la primera pauta llevaban utm_content=video-1..4, pero
	// Meta ignora las UTM y GA4 todavía no está conectado, así que se podía
	// saber qué video traía clicks baratos y no cuál traía gente que después
	// hacía algo. Mandándolas como parámetro del evento, el embudo
	// ViewContent → EngagedView → ClickOut se puede partir por video.
	//
	// Prioriza las UTM de la URL actual: si llegó del anuncio recién, son
	// exactas. Si no hay, cae al primer contacto guardado, que es lo único que
	// queda cuando la persona vuelve días después por otro lado. utm_origen
	// dice cuál de las dos se usó, para que el dato se lea sin adivinar.
	var CAMPOS_EVENTO = ['utm_source', 'utm_campaign', 'utm_content'];

	function conUtms(params) {
		var salida = {};
		for (var k in params) {
			if (Object.prototype.hasOwnProperty.call(params, k)) salida[k] = params[k];
		}

		var u = leerUtmsDeLaUrl();
		var origen = 'url';
		if (!u) { u = utms(); origen = 'guardado'; }
		if (!u) return salida;

		for (var i = 0; i < CAMPOS_EVENTO.length; i++) {
			var c = CAMPOS_EVENTO[i];
			if (u[c] && salida[c] == null) salida[c] = u[c];
		}
		if (salida.utm_origen == null) salida.utm_origen = origen;
		return salida;
	}

	/* ── Eventos ───────────────────────────────────────────────────────── */

	var ESTANDAR = { PageView: 1, ViewContent: 1, Lead: 1, CompleteRegistration: 1, Contact: 1, Search: 1, AddToCart: 1, InitiateCheckout: 1, Purchase: 1, Subscribe: 1 };

	function ev(nombre, params) {
		params = conUtms(params || {});
		try {
			if (MODO_REDIRECT) throw new Error('sin fbevents');
			// trackSingle* en vez de track: todo lo que no sea PageView va sólo al
			// principal. Si fuera a todos, los heredados quedarían con eventos de
			// páginas que nunca midieron y sus números pasados no se podrían leer.
			window.fbq(
				ESTANDAR[nombre] ? 'trackSingle' : 'trackSingleCustom',
				PIXEL_PRINCIPAL, nombre, params
			);
		} catch (_) {}
		try {
			// En GA4 los nombres van en snake_case: ClickOut → click_out.
			gtag('event', nombre.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase(), params);
		} catch (_) {}
	}

	/* ── Salida a otra plataforma ──────────────────────────────────────── */

	// Manda ClickOut y después navega. Si la navegación fuera inmediata el
	// beacon quedaría a mitad de camino: es exactamente lo que pasaba con el
	// <meta refresh content="0"> de las páginas de redirect.
	//
	// nuevaPestaña evita el problema de raíz porque esta página no se descarga,
	// pero en el celular conviene que no: al abrir Spotify en una pestaña nueva
	// el sistema a veces no le pasa el link a la app instalada.
	function salir(destino, url, opciones) {
		opciones = opciones || {};

		ev('ClickOut', {
			destino: destino,
			content_name: opciones.contenido || 'mitos-de-un-futuro-cercano',
			content_type: 'album'
		});

		// Pestaña nueva: se abre en el acto. Un window.open diferido por
		// setTimeout ya perdió el gesto del usuario y Safari lo trata como popup
		// y lo bloquea. No hace falta esperar igual: esta página no se descarga,
		// así que el beacon sale tranquilo mientras la otra pestaña carga.
		if (opciones.nuevaPestaña) {
			window.open(url, '_blank', 'noopener');
			return;
		}

		// Misma pestaña: acá sí hay que esperar, porque navegar descarga la
		// página y se lleva el beacon a medio camino.
		var listo = false;
		function irse() {
			if (listo) return;
			listo = true;
			window.location.href = url;
		}

		window.setTimeout(irse, ESPERA_BEACON_MS);
		window.setTimeout(irse, ESPERA_MAXIMA_MS);  // red de contención
	}

	/* ── Redirect medido ───────────────────────────────────────────────── */

	// Un pedido directo al endpoint de Meta, el mismo que usa el <noscript> que
	// da el propio Events Manager. No depende de que fbevents.js haya cargado,
	// que es lo que lo hace servible en una página que se va enseguida.
	//
	// El callback corre con load o con error, y las dos cosas sirven: un
	// bloqueador de publicidad devuelve error, pero para entonces el pedido ya
	// salió o ya sabemos que no va a salir. Lo que nos importa es no navegar
	// antes de tener una respuesta.
	function beacon(pixel, evento, cd, listo) {
		var u = 'https://www.facebook.com/tr/?id=' + encodeURIComponent(pixel) +
			'&ev=' + encodeURIComponent(evento) +
			'&dl=' + encodeURIComponent(window.location.href);

		if (document.referrer) u += '&rl=' + encodeURIComponent(document.referrer);

		if (cd) {
			for (var k in cd) {
				if (Object.prototype.hasOwnProperty.call(cd, k) && cd[k] != null) {
					u += '&cd[' + encodeURIComponent(k) + ']=' + encodeURIComponent(cd[k]);
				}
			}
		}

		try {
			var img = new window.Image(1, 1);
			img.onload = img.onerror = listo;
			img.src = u;
		} catch (_) {
			listo();
		}
	}

	// Para spotify.html y youtube.html. Antes redirigían con
	// <meta refresh content="0">, que le corre una carrera al pixel y la gana
	// casi siempre: el navegador se iba de la página con el evento a medio
	// salir. De ahí que los números de esas dos páginas nunca cerraran.
	//
	// Acá el orden está al revés: primero salen los eventos, y la navegación
	// espera a que terminen o a que se venza ESPERA_MAXIMA_MS.
	function redirigir(destino, url) {
		var faltan = TODOS.length;
		var yaFue = false;

		function irse() {
			if (yaFue) return;
			yaFue = true;
			window.location.replace(url);
		}

		function uno() { if (--faltan <= 0) irse(); }

		// ClickOut al principal: es el evento que dice que esta persona se fue a
		// escuchar. A los heredados les mandamos el PageView que venían
		// recibiendo, para no cortarles la serie de golpe.
		// conUtms también acá: estas páginas pueden recibir la pauta de forma
		// directa, y si lo hacen son el único lugar donde queda registro de
		// qué anuncio trajo a la persona.
		beacon(PIXEL_PRINCIPAL, 'ClickOut', conUtms({
			destino: destino,
			content_name: 'mitos-de-un-futuro-cercano',
			content_type: 'album'
		}), uno);

		for (var j = 0; j < PIXELS_HEREDADOS.length; j++) {
			beacon(PIXELS_HEREDADOS[j], 'PageView', null, uno);
		}

		window.setTimeout(irse, ESPERA_MAXIMA_MS);
	}

	/* ── Visita real ───────────────────────────────────────────────────── */

	// Manda EngagedView una sola vez, cuando la visita deja de parecer un
	// rebote: o acumuló VISITA_REAL_MS de página visible, o la persona hizo
	// algo antes. Cualquiera de las dos alcanza — quien scrollea a los 800 ms
	// ya demostró que está mirando.
	//
	// El reloj se frena cuando la pestaña deja de estar visible y sigue cuando
	// vuelve. Sin eso una pestaña abierta en segundo plano y nunca mirada
	// llegaría sola a los tres segundos y contaría como visita real.
	function medirVisitaReal(marca) {
		var SENALES = ['scroll', 'pointerdown', 'keydown'];
		var yaFue = false;
		var acumulado = 0;   // ms visibles ya contados
		var desde = null;    // cuándo empezó el tramo visible en curso
		var timer = null;

		function olvidar() {
			if (timer) { window.clearTimeout(timer); timer = null; }
			document.removeEventListener('visibilitychange', alCambiar);
			for (var i = 0; i < SENALES.length; i++) {
				window.removeEventListener(SENALES[i], disparar, true);
			}
		}

		function disparar() {
			if (yaFue) return;
			yaFue = true;
			olvidar();
			ev('EngagedView', {
				content_name: marca.getAttribute('data-heo-content'),
				content_type: 'album'
			});
		}

		function arrancarReloj() {
			if (yaFue || timer) return;
			desde = Date.now();
			timer = window.setTimeout(disparar, Math.max(0, VISITA_REAL_MS - acumulado));
		}

		function pararReloj() {
			if (timer) { window.clearTimeout(timer); timer = null; }
			if (desde) { acumulado += Date.now() - desde; desde = null; }
		}

		function alCambiar() {
			if (document.visibilityState === 'visible') arrancarReloj();
			else pararReloj();
		}

		document.addEventListener('visibilitychange', alCambiar);

		// En captura, para enterarnos aunque algo más detenga la propagación.
		// disparar() no cancela nada ni toca el evento, así que no se mete en
		// el camino del handler de ClickOut que vive en los <a>.
		for (var i = 0; i < SENALES.length; i++) {
			window.addEventListener(SENALES[i], disparar, true);
		}

		if (document.visibilityState === 'visible') arrancarReloj();
	}

	/* ── Auto-cableado ─────────────────────────────────────────────────── */

	// <a href="…" data-heo-out="spotify">           → navega la misma pestaña
	// <a href="…" data-heo-out="tienda" target="_blank"> → pestaña nueva
	function cablear() {
		var enlaces = document.querySelectorAll('[data-heo-out]');
		for (var i = 0; i < enlaces.length; i++) {
			enlaces[i].addEventListener('click', function (e) {
				var a = e.currentTarget;
				// Click con Ctrl/Cmd o botón del medio: el navegador abre la
				// pestaña él mismo, esta página no se va y el evento sale solo.
				if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
					ev('ClickOut', {
						destino: a.getAttribute('data-heo-out'),
						content_name: a.getAttribute('data-heo-content') || 'mitos-de-un-futuro-cercano',
						content_type: 'album'
					});
					return;
				}
				e.preventDefault();
				salir(a.getAttribute('data-heo-out'), a.href, {
					nuevaPestaña: a.target === '_blank',
					contenido: a.getAttribute('data-heo-content') || null
				});
			});
		}

		// ViewContent sólo donde el HTML lo pida. En el home no va: ahí la
		// visita es PageView y nada más.
		//
		// EngagedView va junto con ViewContent y no tiene atributo propio: la
		// página que quiere saber cuánta gente la vio quiere saber también a
		// cuánta de esa gente le importó. Los dos juntos son el par que sirve.
		var marca = document.querySelector('[data-heo-content]');
		if (marca && marca.hasAttribute('data-heo-view')) {
			ev('ViewContent', {
				content_name: marca.getAttribute('data-heo-content'),
				content_type: 'album'
			});
			medirVisitaReal(marca);
		}
	}

	if (!MODO_REDIRECT) {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', cablear);
		} else {
			cablear();
		}
	}

	/* ── API ───────────────────────────────────────────────────────────── */

	window.HEO = {
		pixelId: PIXEL_PRINCIPAL,
		pixelsHeredados: PIXELS_HEREDADOS.slice(),
		ev: ev,
		salir: salir,
		redirigir: redirigir,
		utms: utms
	};

})(window, document);
