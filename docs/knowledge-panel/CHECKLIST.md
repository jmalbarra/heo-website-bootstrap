# Hacia el Ocaso — Knowledge Panel y presencia en bases de datos

**Estado general al 15/10/2026.** Este archivo es el tablero. Los detalles de cada
paso están en los documentos numerados.

| # | Paso | Documento | Estado |
|---|---|---|---|
| 1 | Auditoría inicial | [`01-auditoria.md`](01-auditoria.md) | ✅ **hecho** |
| 2 | Wikidata | [`02-wikidata.md`](02-wikidata.md) | 🟡 listo para cargar — **falta un dato** |
| 3 | MusicBrainz | [`03-musicbrainz.md`](03-musicbrainz.md) | 🟡 listo para cargar — **falta un dato** |
| 4 | Perfiles verificados | [`04-perfiles-verificados.md`](04-perfiles-verificados.md) | 🟡 checklist armada — **necesito tu estado** |
| 5 | Sitio + JSON-LD | este archivo, §5 | ✅ **código hecho**, falta deploy |
| 6 | Bio oficial | [`05-bio-oficial.md`](05-bio-oficial.md) | ✅ **hecho** (corta, larga, inglés) |
| 7 | Prensa | [`06-prensa.md`](06-prensa.md) | ✅ lista + mails redactados |
| 8 | Knowledge Panel | [`07-knowledge-panel.md`](07-knowledge-panel.md) | ⏳ depende de 2-7 |
| 9 | Wikipedia | [`08-wikipedia.md`](08-wikipedia.md) | ❌ **no cumplen todavía** — ver documento |

---

## 🔴 Bloqueantes — esto frena los pasos 2, 3, 5 y 6

| # | Falta | Para qué |
|---|---|---|
| 1 | **Instrumento de Ramiro Kowalski** | Wikidata, MusicBrainz, JSON-LD, bio, presskit |
| 2 | **Instrumento de Pablo Mosca** | ídem |
| 3 | **¿Cuándo entraron Kowalski y Mosca? ¿Cuándo salieron Bonesi y Abdusetir?** | MusicBrainz (relaciones con fecha). Sin esto quedan dos formaciones conviviendo en internet. |

## 🟠 Datos que me faltan (no bloquean, pero mejoran todo)

| Dato | Para qué | Dónde lo sacás |
|---|---|---|
| Mes exacto de formación en 2014 | precisión en Wikidata y MusicBrainz | ustedes |
| UPC de TRSCNDR y de Amanecer | MusicBrainz | panel de CD Baby |
| ISRCs de todos los temas | MusicBrainz | panel de CD Baby |
| IDs de Spotify de los 6 singles | MusicBrainz, JSON-LD | la discografía de Spotify |
| Fecha exacta de la presentación en La Tangente | bio larga | ustedes |
| ¿Existe Bandcamp de la banda? | perfiles | ustedes |
| Estado de Spotify for Artists / Apple for Artists | paso 4 | sus cuentas |
| Código de verificación de Google Search Console | paso 8 | Search Console |
| ¿*Enterrandote* va con tilde? | corregir en CD Baby y MusicBrainz | ustedes |
| ¿Tienen fotos propias que puedan liberar CC BY-SA? | imagen en Wikidata | ustedes |

---

## 5. Sitio oficial + JSON-LD — qué se hizo

No hizo falta proponer hosting: **el sitio ya existe** (`haciaelocaso.com`, este repo),
con bio, discografía, links, presskit y tienda. Lo que faltaba eran los datos
estructurados, que es lo que leen los buscadores.

Cambios aplicados en `index.html`:

1. **`<link rel="canonical">`** apuntando a `https://www.haciaelocaso.com/`.
   No lo tenía. Sin canonical, Google puede tratar `haciaelocaso.com`,
   `www.haciaelocaso.com` y las variantes con parámetros como páginas distintas.
2. **Bloque JSON-LD `@graph`** con:
   - `MusicGroup` — nombre, alias (HEO), descripción, géneros, fundación 2014,
     lugar de formación Buenos Aires, logo, imagen, mail de contacto, los 5
     integrantes, los 3 álbumes y **9 `sameAs`** (Spotify, Apple, YouTube ×2,
     Instagram, Facebook, Deezer, MusicBrainz, Linktree).
   - `MusicAlbum` ×3 con fecha, cantidad de tracks y sus propios `sameAs`.
   - `WebSite` enlazado al `MusicGroup` como publisher.

Pendiente en el código:
- [ ] Agregar el QID de Wikidata al `sameAs` (cuando exista)
- [ ] Agregar el meta de verificación de Google Search Console (cuando lo tengas)
- [ ] Actualizar la formación en el JSON-LD con los instrumentos que faltan
- [ ] Actualizar la formación en la sección "Nosotros" de `index.html` y en `presskit.html`
- [ ] Arreglar los 2 links de prensa muertos del presskit
- [ ] Corregir la fecha de *Cae el Velo* (2025, no 2026) en el presskit
- [ ] Deploy y validación en <https://search.google.com/test/rich-results>

---

## Orden recomendado de ejecución

El orden de tu pedido es el correcto salvo por una cosa: **hacé MusicBrainz antes
que Wikidata.** Un ítem de Wikidata con MBID cargado es mucho más difícil de
cuestionar que uno sin ningún ID externo.

```
1. Definir los dos instrumentos que faltan          ← 5 minutos, desbloquea todo
2. Actualizar formación en sitio + presskit         ← código, lo hago yo
3. MusicBrainz: corregir IG, completar artista,
   cargar los 9 releases                            ← 2-3 horas tuyas
4. Wikidata: batch de QuickStatements               ← 20 minutos
5. Deploy del sitio + Search Console + validar      ← 30 minutos
6. Reclamar Spotify for Artists y Apple for Artists ← trámite, días
7. Consultar a CD Baby por el OAC de YouTube        ← trámite, hasta 6 semanas
8. Enviar prensa (empezando por los que ya cubrieron) ← 1 tarde
9. Chequear el panel una vez por mes
10. Wikipedia: recién con 3 fuentes independientes
```

---

## Registro de prensa conseguida

Cada nota nueva va acá. Esto es lo que después se convierte en las referencias
del artículo de Wikipedia.

| # | Medio | País | Fecha | Autor | Tipo | Link | ¿Sirve para Wikipedia? |
|---|---|---|---|---|---|---|---|
| 1 | Chaoszine | FI | 09/07/2024 | Hernan Osuna | nota dedicada sobre *Erial* | [link](https://chaoszine.net/listen-to-erial-by-hacia-el-ocaso-powerful-sounds-from-argentina/) | ✅ sí |
| 2 | Vientos de Poder | AR | 25/05/2024 | Sergio Silva | crónica de show | [link](https://vientosdepoder.com/el-metalcore-brillo-en-una-energica-noche-de-la-mano-de-blessthefall/) | ❌ mención al pasar |
| 3 | Mariskal Rock | ES | — | — | inclusión en playlist | [link](https://mariskalrock.com/actualidad/los-20-duros-del-08-07-al-14-07-pearl-jam-tarja-turunen-marko-hietala-dream-theater-hammerfall-toto-ice-nine-kills-o-sonata-arctica-en-nuestra-playlist-de-rock-y-metal-en-spotify/) | ❌ trivial |
| 4 | Bolas de Fuego TV | AR | 15/05/2022 | Gier | entrevista en video | [link](https://youtu.be/-wEqazQm-24?t=348) | ⚠️ cuenta poco |
| | | | | | | | |

**Cuenta para Wikipedia: 1 de 3.**

---

## Datos de referencia (copiar y pegar)

```
Nombre          : Hacia el Ocaso
Alias           : HEO
Género          : metal alternativo (secundario: metalcore)
Origen          : Buenos Aires, Argentina
Activos desde   : 2014
Mail            : ocasomcore@gmail.com
Sitio           : https://www.haciaelocaso.com/

Spotify artist  : 0qWTEFLLXPxzWbTqjg8QXu
Apple artist    : 1114769394
Deezer artist   : 10395280
YouTube channel : UCIEBdateHdWkVd9UYlqc0tA   (@heo.oficial)
MusicBrainz     : 775132f6-8d44-4524-bd3a-4d62f0a1036e
Instagram       : heo.oficial
Facebook        : heo.oficial
Wikidata        : (pendiente)

Discografía:
  2016-05-18  Amanecer                      EP      6 tracks
  2018-08-30  Hoy Te Busqué                 Single
  2018-10-09  Lágrimas                      Single
  2020-05-07  En las Sombras                Single
  2020-07-12  TRSCNDR                       Álbum  10 tracks
  2023-05-18  Erial                         Single
  2024-05-02  Cifra                         Single
  2025-10-30  Cae El Velo                   Single
  2026-09-17  Mitos De Un Futuro Cercano    Álbum  12 tracks  UPC 885000433313
```
