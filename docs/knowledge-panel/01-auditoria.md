# 1. Auditoría inicial — qué existe hoy de Hacia el Ocaso

Relevamiento hecho el **15/10/2026**. Todo lo que figura acá fue consultado contra
la fuente, no de memoria. Lo que no se pudo verificar está marcado.

## 1.1 Resumen en una línea

La banda existe bien en las plataformas de streaming (Spotify, Apple, Deezer, YouTube)
y tiene sitio propio, pero **no existe en ninguna base de datos estructurada que Google
use para armar un Knowledge Panel**: no hay ítem de Wikidata, MusicBrainz está casi vacío
y con un link roto, y no hay Discogs. Ese es exactamente el agujero que hay que tapar.

## 1.2 Dónde sí está la banda

| Plataforma | Estado | ID / URL | Notas |
|---|---|---|---|
| Spotify | ✅ activo | `0qWTEFLLXPxzWbTqjg8QXu` | [artista](https://open.spotify.com/artist/0qWTEFLLXPxzWbTqjg8QXu) |
| Apple Music | ✅ activo | `1114769394` | [artista](https://music.apple.com/ar/artist/hacia-el-ocaso/1114769394) · género primario: Metal |
| Deezer | ✅ activo | `10395280` | 7 lanzamientos, 47 fans al 15/10/2026 |
| YouTube | ✅ activo | `UCIEBdateHdWkVd9UYlqc0tA` | handle `@heo.oficial` |
| Instagram | ✅ activo | `@heo.oficial` | |
| Facebook | ✅ activo | `facebook.com/heo.oficial` | |
| Sitio oficial | ✅ activo | haciaelocaso.com | con presskit, tienda y experiencias |
| Linktree | ✅ activo | `linktr.ee/haciaelocaso` | |
| MusicBrainz | ⚠️ existe pero vacío | `775132f6-8d44-4524-bd3a-4d62f0a1036e` | ver 1.4 |
| Bandsintown | ⚠️ existe, no verificable desde acá | varios eventos indexados | bloquea scraping (403) |
| Pogopedia | ⚠️ existe, desactualizado | pogopedia.com.ar/bandas/hacia-el-ocaso | el sitio devolvió 521 al consultarlo |
| Last.fm | ⚠️ existe, no verificable desde acá | last.fm/music/Hacia+el+Ocaso | bloquea scraping (Cloudflare) |

## 1.3 Dónde NO está (y debería)

| Base | Estado | Por qué importa |
|---|---|---|
| **Wikidata** | ❌ no existe ítem | Es la fuente nº1 que Google consume para Knowledge Panels. Prioridad máxima. |
| **MusicBrainz (lanzamientos)** | ❌ cero releases cargados | Alimenta Wikidata, Last.fm, Roon, Plex, Tidal y agregadores. |
| **Discogs** | ❌ la banda no está | Ojo: existe un `Hacia El Ocaso` (artista 7611272) que **no es la banda** — aparece sólo en un compilado llamado *The Fencepost Reclamation Project Volume 6* (2019). Es un homónimo. No reclamar ese perfil: hay que crear uno nuevo. |
| **Encyclopaedia Metallum** | ❌ no está | Metallum rechaza metalcore / metal alternativo por política. No insistir, no es una vía. |
| **Wikipedia** | ❌ no hay artículo | Ver documento `08-wikipedia.md`. |
| **JSON-LD en el sitio** | ❌ no había nada | Resuelto en esta tanda: ver `index.html`. |

## 1.4 Problemas concretos encontrados

### a) MusicBrainz: link de Instagram roto
El ítem de MusicBrainz tiene cargado `https://www.instagram.com/heo.oficia/`
(**falta la "l" final**). Ese link no resuelve a la cuenta real. Un `sameAs` roto en
MusicBrainz se propaga a todo lo que consume MusicBrainz.

Además el ítem no tiene: año de formación, ciudad (sólo "Argentina"), integrantes,
ni **un solo lanzamiento**. Hoy MusicBrainz dice que la banda existe y nada más.

### b) La formación publicada está vieja
El presskit del sitio (`presskit.html`) y la bio pública listan:
Juanma Albarracín, Démian Zapiola, Nelo Fernández, **Poli Abdusetir (bajo)** y
**Damián Bonesi (batería)**.

La formación actual que me pasaste es: Albarracín, Zapiola, Fernández,
**Ramiro Kowalski** y **Pablo Mosca**.

Y afuera el dato está partido en tres versiones distintas:
- Bandsintown: Albarracín, Zapiola, Fernández, **Bonesi**, **Kowalski** (mezcla vieja y nueva)
- Pogopedia: Albarracín, Zapiola, **Mosca**, **Marcos Rocchi** (una cuarta versión)
- Sitio oficial: la formación vieja

**Esto es un problema real para el Knowledge Panel.** Google cruza fuentes; cuando no
coinciden, o no arma el panel o lo arma con datos viejos. Unificar la formación es
bloqueante para los pasos 2, 3 y 5.

### c) El nombre aparece mal escrito en prensa
Vientos de Poder publica "**Hacía** el Ocaso" (con tilde). Es un medio real con nota
real, pero la grafía mal escrita diluye la señal del nombre.

### d) Dos links de prensa del presskit están muertos
- `rompiendo-cadenas.com` → el dominio ya no resuelve (DNS caído).
- `elundernuestropren.wixsite.com/eunwz/post/in-your-hands-y-hacia-el-ocaso-hacen-suyo-colegiales` → **404**.

Hay que sacarlos del presskit o reemplazarlos por una copia archivada
(web.archive.org) antes de mandarle el presskit a un medio.

### e) Fecha de "Cae el Velo" inconsistente
El presskit la fecha en **2026**. Apple Music y Deezer la publican el **30/10/2025**.
La fecha real de distribución es 30/10/2025.

### f) El sitio no declaraba canonical ni datos estructurados
`index.html` no tenía `<link rel="canonical">` ni JSON-LD. Ya está corregido.

## 1.5 Discografía real, verificada contra Apple Music y Deezer

| Fecha | Lanzamiento | Tipo | Tracks |
|---|---|---|---|
| 18/05/2016 | Amanecer | EP | 6 |
| 30/08/2018 | Hoy Te Busqué | Single | 1 |
| 09/10/2018 | Lágrimas | Single | 1 |
| 07/05/2020 | En las Sombras | Single | 1 |
| 12/07/2020 | TRSCNDR | Álbum | 10 |
| 18/05/2023 | Erial | Single | 1 |
| 02/05/2024 | Cifra | Single | 1 |
| 30/10/2025 | Cae El Velo | Single | 1 |
| 17/09/2026 | Mitos De Un Futuro Cercano | Álbum | 12 |

Copyright que declara Apple: `℗ 2026 Hacia el Ocaso` (MDUFC) y `℗ 2020 Hacia el Ocaso`
(TRSCNDR) → la banda figura como su propio sello. Eso sirve para cargar
"self-released" en MusicBrainz y Wikidata.

⚠️ Discrepancia menor: Deezer fecha *Amanecer* el 01/01/2016 y Apple el 18/05/2016.
Apple suele tener la fecha real de distribución; Deezer rellena con 01/01 cuando le
falta el dato. Vamos con **18/05/2016**, pero confirmalo contra tu panel de CD Baby.

⚠️ El presskit lista además un demo *El Peso del Mundo* (2015) que no está en
ninguna plataforma. Si no está distribuido, no va a Wikidata ni a MusicBrainz como
release oficial (sí puede ir a MusicBrainz como demo si existe físicamente).

## 1.6 Prensa existente, verificada link por link

| Medio | País | Fecha | Tipo | Estado |
|---|---|---|---|---|
| [Chaoszine](https://chaoszine.net/listen-to-erial-by-hacia-el-ocaso-powerful-sounds-from-argentina/) | Finlandia | 09/07/2024 | Nota dedicada sobre *Erial*, por Hernan Osuna | ✅ **la mejor referencia que tienen** |
| [Vientos de Poder](https://vientosdepoder.com/el-metalcore-brillo-en-una-energica-noche-de-la-mano-de-blessthefall/) | Argentina | 25/05/2024 | Crónica de show (telonearon a Blessthefall), por Sergio Silva | ✅ sirve, pero escribe mal el nombre |
| [Mariskal Rock](https://mariskalrock.com/actualidad/los-20-duros-del-08-07-al-14-07-pearl-jam-tarja-turunen-marko-hietala-dream-theater-hammerfall-toto-ice-nine-kills-o-sonata-arctica-en-nuestra-playlist-de-rock-y-metal-en-spotify/) | España | — | Inclusión en playlist "Los 20 duros" | ⚠️ mención de pasada, no es cobertura |
| [Bolas de Fuego TV](https://youtu.be/-wEqazQm-24?t=348) | Argentina | 15/05/2022 | Entrevista en vivo | ⚠️ video, no texto; sirve como color, no como fuente fuerte |
| Rompiendo Cadenas | — | — | Reseña | ❌ dominio caído |
| El Under Nuestro | Argentina | — | Crónica | ❌ 404 |

**Lectura honesta:** hay **una** fuente independiente con cobertura dedicada
(Chaoszine) y **una** crónica argentina que los nombra al pasar. Alcanza de sobra
para Wikidata. No alcanza para Wikipedia (ver `08-wikipedia.md`).
