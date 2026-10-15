# Hacia el Ocaso — Knowledge Panel y presencia en bases de datos

**Estado general al 15/10/2026.** Este archivo es el tablero. Los detalles de cada
paso están en los documentos numerados.

| # | Paso | Documento | Estado |
|---|---|---|---|
| 1 | Auditoría inicial | [`01-auditoria.md`](01-auditoria.md) | ✅ **hecho** |
| 2 | Wikidata | [`02-wikidata.md`](02-wikidata.md) | ✅ **listo para cargar** |
| 3 | MusicBrainz | [`03-musicbrainz.md`](03-musicbrainz.md) | ✅ **listo para cargar** |
| 4 | Perfiles verificados | [`04-perfiles-verificados.md`](04-perfiles-verificados.md) | 🟡 checklist armada — **necesito tu estado** |
| 5 | Sitio + JSON-LD | este archivo, §5 | ✅ **código hecho**, falta deploy |
| 6 | Bio oficial | [`05-bio-oficial.md`](05-bio-oficial.md) | ✅ **hecho** (corta, larga, inglés) |
| 7 | Prensa | [`06-prensa.md`](06-prensa.md) | ✅ lista + mails redactados |
| 8 | Knowledge Panel | [`07-knowledge-panel.md`](07-knowledge-panel.md) | ⏳ depende de 2-7 |
| 9 | Wikipedia | [`08-wikipedia.md`](08-wikipedia.md) | ❌ **no cumplen todavía**, pero más cerca de lo que parecía |

---

## 🔴 Bloqueantes — resueltos el 15/10/2026

Los tres bloqueantes de instrumentos y fechas están resueltos. Quedan dos cosas
por aclarar, que no frenan la carga pero conviene definir antes:

| # | A definir | Por qué importa |
|---|---|---|
| 1 | **El solapamiento de bajistas.** Kowalski figura en bajo hasta diciembre de 2025 y Abdusetir desde enero de 2025: doce meses con dos bajistas. | MusicBrainz y Wikidata guardan fechas exactas. Si es un error de tipeo, arreglalo antes de cargar; si fue real, lo cargamos así y listo. |
| 2 | **¿Existió Marcos Rocchi en bajo?** Aparece sólo en Pogopedia. | Si fue el bajista anterior a Kowalski (antes de agosto de 2018), hay que cargarlo. Si no, hay que pedirle a Pogopedia que lo saque. |

### Formación confirmada

**Actual:**

| Integrante | Instrumento | Desde |
|---|---|---|
| Juan Manuel Albarracín | voz | 2014 ⚠️ confirmar |
| Emiliano Demián Zapiola | guitarra y voces | ⚠️ falta |
| Nelson Javier Fernández | guitarra | ⚠️ falta |
| Poli Abdusetir | bajo y voces | enero 2025 |
| Damián Bonesi | batería | febrero 2024 |

**Ex integrantes:**

| Integrante | Instrumento | Período |
|---|---|---|
| Pablo Mosca | batería | diciembre 2014 – diciembre 2023 |
| Ramiro Kowalski | bajo | agosto 2018 – diciembre 2025 |

Ya está aplicada en el JSON-LD de `index.html` (con `OrganizationRole`, rol y fecha
de ingreso para los actuales, y `alumni` con período cerrado para los dos que se
fueron). El sitio y el presskit ya la tenían bien.

## 🟠 Datos que me faltan (no bloquean, pero mejoran todo)

| Dato | Para qué | Dónde lo sacás |
|---|---|---|
| **Qué dice la reseña archivada de Rompiendo Cadenas** | podría ser la segunda fuente escrita para Wikipedia | [captura del Internet Archive](https://web.archive.org/web/20260115020644/http://rompiendo-cadenas.com/revista/los-discos-que-llegaron-a-nosotros-el-mes-de-julio/) — no la puedo abrir desde acá |
| Fecha de ingreso de Zapiola y Fernández | MusicBrainz, Wikidata, JSON-LD | ustedes |
| Mes exacto de formación en 2014 | precisión en Wikidata y MusicBrainz | ustedes |
| UPC de TRSCNDR y de Amanecer | MusicBrainz | panel de CD Baby |
| ISRCs de todos los temas | MusicBrainz | panel de CD Baby |
| IDs de Spotify de los 6 singles | MusicBrainz, JSON-LD | la discografía de Spotify |
| Fecha exacta de la presentación en La Tangente | bio larga | ustedes |
| Fecha del Episodio 54 de El Faro Rock | registro de prensa | el video |
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
     integrantes, los 3 álbumes y **10 `sameAs`** (Spotify, Apple, YouTube ×2,
     Instagram, Facebook, Deezer, MusicBrainz, Songkick, Linktree).
   - `MusicAlbum` ×3 con fecha, cantidad de tracks y sus propios `sameAs`.
   - `WebSite` enlazado al `MusicGroup` como publisher.

Pendiente en el código:
- [ ] Agregar el QID de Wikidata al `sameAs` (cuando exista)
- [ ] Agregar el meta de verificación de Google Search Console (cuando lo tengas)
- [x] ~~Formación en el JSON-LD~~ — hecho, con roles, fechas de ingreso y ex integrantes
- [x] ~~Formación en el sitio y el presskit~~ — ya estaban correctas
- [ ] Arreglar los 2 links de prensa muertos del presskit
- [ ] Corregir la fecha de *Cae el Velo* (2025, no 2026) en el presskit
- [ ] Deploy y validación en <https://search.google.com/test/rich-results>

---

## Orden recomendado de ejecución

El orden de tu pedido es el correcto salvo por una cosa: **hacé MusicBrainz antes
que Wikidata.** Un ítem de Wikidata con MBID cargado es mucho más difícil de
cuestionar que uno sin ningún ID externo.

```
1. ✅ Formación definida y aplicada al JSON-LD
2. Resolver el solapamiento de bajistas              ← 2 minutos
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
| 2 | Rompiendo Cadenas | — | — | — | reseña de disco (sólo en el archivo) | [captura](https://web.archive.org/web/20260115020644/http://rompiendo-cadenas.com/revista/los-discos-que-llegaron-a-nosotros-el-mes-de-julio/) | ⚠️ **a verificar** |
| 3 | Herederos de una Pasión | AR | 04/05/2022 | — | entrevista a Juanma y Nelo | [link](https://youtu.be/M48ZPe6toJ8) | ⚠️ entrevista |
| 4 | Bolas de Fuego TV | AR | 15/05/2022 | Gier | entrevista en vivo | [link](https://youtu.be/-wEqazQm-24?t=348) | ⚠️ entrevista |
| 5 | El Faro Rock | AR | ⚠️ sin fecha | Sebastián Furrer | entrevista, Episodio 54 | [link](https://youtu.be/a3gw854pL9g) | ⚠️ entrevista |
| 6 | Vientos de Poder | AR | 25/05/2024 | Sergio Silva | crónica de show | [link](https://vientosdepoder.com/el-metalcore-brillo-en-una-energica-noche-de-la-mano-de-blessthefall/) | ❌ mención al pasar |
| 7 | Mariskal Rock | ES | — | — | inclusión en playlist | [link](https://mariskalrock.com/actualidad/los-20-duros-del-08-07-al-14-07-pearl-jam-tarja-turunen-marko-hietala-dream-theater-hammerfall-toto-ice-nine-kills-o-sonata-arctica-en-nuestra-playlist-de-rock-y-metal-en-spotify/) | ❌ trivial |
| 8 | RPM Legion | AR | ⚠️ sin fecha | — | video sobre la banda | [link](https://youtu.be/Ex585zeUTxs) | ❌ menor |
| | | | | | | | |

**Cuenta para Wikipedia: 1 confirmada de 3, más 1 pendiente de verificar y 3 entrevistas.**

---

## Datos de referencia (copiar y pegar)

```
Nombre          : Hacia el Ocaso
Alias           : HEO
Género          : metal alternativo (secundario: metalcore)
Origen          : Buenos Aires, Argentina
Activos desde   : 2014
Mail            : ocasomcore@gmail.com
Formación       : Albarracín (voz), Zapiola (guit/voces), Fernández (guit),
                  Abdusetir (bajo/voces, desde 01/2025), Bonesi (batería, desde 02/2024)
Ex integrantes  : Pablo Mosca (batería, 12/2014-12/2023)
                  Ramiro Kowalski (bajo, 08/2018-12/2025)
Sitio           : https://www.haciaelocaso.com/

Spotify artist  : 0qWTEFLLXPxzWbTqjg8QXu
Apple artist    : 1114769394
Deezer artist   : 10395280
YouTube channel : UCIEBdateHdWkVd9UYlqc0tA   (@heo.oficial)
MusicBrainz     : 775132f6-8d44-4524-bd3a-4d62f0a1036e
Songkick artist : 8767954
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
