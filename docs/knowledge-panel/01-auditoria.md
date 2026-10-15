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

### b) La formación está bien en el sitio y mal en todos lados menos el sitio

**Corregido el 15/10/2026 con datos de la banda.** La formación actual es la que ya
publica el sitio oficial y el presskit:

| Integrante | Instrumento | Desde |
|---|---|---|
| Juan Manuel Albarracín | voz | 2014 ⚠️ confirmar |
| Emiliano Demián Zapiola | guitarra y voces | ⚠️ falta |
| Nelson Javier Fernández | guitarra | ⚠️ falta |
| Poli Abdusetir | bajo y voces | enero 2025 |
| Damián Bonesi | batería | febrero 2024 |

Ex integrantes:

| Integrante | Instrumento | Período |
|---|---|---|
| Pablo Mosca | batería | diciembre 2014 – diciembre 2023 |
| Ramiro Kowalski | bajo | agosto 2018 – diciembre 2025 |

El sitio está bien. **Lo que está mal es todo lo de afuera:**
- Bandsintown: lista a Kowalski (que ya no está) junto a Bonesi.
- Pogopedia: lista a Pablo Mosca (se fue en 2023) y a **Marcos Rocchi** en bajo, que
  no figura en ninguna otra fuente. Probablemente sea el bajista anterior a Kowalski
  (antes de agosto de 2018), pero no lo puedo confirmar.

⚠️ **Hay un solapamiento sin explicar:** según las fechas que pasó la banda, Kowalski
estuvo en bajo hasta diciembre de 2025 y Abdusetir entró en bajo en enero de 2025.
Son doce meses con dos bajistas simultáneos. Puede ser real (transición larga,
sesionista) o puede ser un error de tipeo en alguna de las dos fechas. Hay que
definirlo antes de cargarlo en MusicBrainz, que no admite ambigüedad en las fechas.

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
| [Rompiendo Cadenas](http://rompiendo-cadenas.com/revista/los-discos-que-llegaron-a-nosotros-el-mes-de-julio/) | — | — | Reseña de disco | ⚠️ dominio caído, **pero hay copia archivada** — ver 1.7 |
| [Vientos de Poder](https://vientosdepoder.com/el-metalcore-brillo-en-una-energica-noche-de-la-mano-de-blessthefall/) | Argentina | 25/05/2024 | Crónica del show con Blessthefall (Uniclub, 16/05/2024), por Sergio Silva | ✅ los nombra, con el nombre mal escrito |
| [Mariskal Rock](https://mariskalrock.com/actualidad/los-20-duros-del-08-07-al-14-07-pearl-jam-tarja-turunen-marko-hietala-dream-theater-hammerfall-toto-ice-nine-kills-o-sonata-arctica-en-nuestra-playlist-de-rock-y-metal-en-spotify/) | España | — | Inclusión en playlist "Los 20 duros" | ⚠️ mención de pasada |
| [Herederos de una Pasión](https://youtu.be/M48ZPe6toJ8) | Argentina | 04/05/2022 | **Entrevista a Juanma Albarracín y Nelo Fernández** | ✅ **hallazgo nuevo** |
| [Bolas de Fuego TV](https://youtu.be/-wEqazQm-24?t=348) | Argentina | 15/05/2022 | Entrevista en vivo | ✅ |
| [El Faro Rock](https://youtu.be/a3gw854pL9g) | Argentina | ⚠️ sin fecha | **Episodio 54: entrevista a Rocknosfera y Hacia el Ocaso** | ✅ **hallazgo nuevo** |
| [RPM Legion](https://youtu.be/Ex585zeUTxs) | Argentina | ⚠️ sin fecha | Video sobre la banda | ⚠️ **hallazgo nuevo**, contenido menor |
| [Metal-Daze](https://metaldazeweb.com/recitales/hacia-el-ocaso/) | Argentina | — | Ficha en la sección "recitales" | ⚠️ sin texto editorial |
| El Under Nuestro | Argentina | — | Crónica | ❌ 404 y **sin copia archivada** |

**Lectura honesta:** una sola fuente escrita con cobertura dedicada (Chaoszine),
una reseña escrita recuperable sólo desde el archivo (Rompiendo Cadenas), tres
entrevistas en video de programas argentinos, y dos menciones al pasar. Alcanza de
sobra para Wikidata. Para Wikipedia sigue sin alcanzar, pero están más cerca de lo
que parecía: ver `08-wikipedia.md`.

## 1.7 La reseña de Rompiendo Cadenas se puede recuperar

El dominio `rompiendo-cadenas.com` ya no resuelve, pero **el Internet Archive tiene
una captura del 15/01/2026**:

```
https://web.archive.org/web/20260115020644/http://rompiendo-cadenas.com/revista/los-discos-que-llegaron-a-nosotros-el-mes-de-julio/
```

⚠️ **No pude leer su contenido desde acá**: la política de red de este entorno
bloquea `web.archive.org`. Abrila vos en el navegador y fijate dos cosas:
1. ¿Reseña efectivamente a Hacia el Ocaso, y a qué disco?
2. ¿Qué fecha y qué autor tiene?

Si la reseña está, es una **segunda fuente escrita válida** y cambia la cuenta de
Wikipedia. Pasame lo que diga y actualizo todo.

## 1.8 Más homónimos encontrados

Sumado a los de la sección 8.6 del documento del Knowledge Panel: **`TRSCNDR` es
también el tag de un grafitero**, con varios videos en YouTube. Buscar "TRSCNDR"
a secas no lleva al disco. Al mencionarlo en prensa conviene escribir siempre
*TRSCNDR, de Hacia el Ocaso*.
