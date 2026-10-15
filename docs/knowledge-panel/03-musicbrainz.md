# 3. MusicBrainz — datos listos para cargar

**El artista ya existe.** No crees uno nuevo: editá este.

**MBID:** `775132f6-8d44-4524-bd3a-4d62f0a1036e`
**URL:** <https://musicbrainz.org/artist/775132f6-8d44-4524-bd3a-4d62f0a1036e>

Hoy ese ítem tiene: nombre, tipo Group, país Argentina, una descripción corta y
cuatro links. **Cero lanzamientos.** Hay que completarlo.

> MusicBrainz es editable por cualquiera con cuenta y las ediciones de artistas
> nuevos entran directo (no hay cola de votación para agregar releases). Es la base
> que alimenta Last.fm, Tidal, Roon, Plex y buena parte de lo que Google cruza.

## 3.1 Corrección urgente: link de Instagram roto

En *Edit → Relationships* hay cargado:

```
https://www.instagram.com/heo.oficia/      ← ROTO, le falta la "l"
```

Corregilo a:

```
https://www.instagram.com/heo.oficial/
```

Edit note sugerida: `Fixing typo in Instagram URL (was heo.oficia, correct is heo.oficial).`

## 3.2 Datos del artista

Entrá a <https://musicbrainz.org/artist/775132f6-8d44-4524-bd3a-4d62f0a1036e/edit>

| Campo | Valor a cargar | Estado actual |
|---|---|---|
| Name | `Hacia el Ocaso` | ✅ ya está |
| Sort name | `Hacia el Ocaso` | ✅ ya está |
| Type | `Group` | ✅ ya está |
| Area | `Buenos Aires` → elegí la de **Argentina**, MBID `2bd8607d-56fe-4fa1-96e3-3badd6a98588` | ❌ hoy dice sólo "Argentina" |
| Begin area | `Buenos Aires` (misma) | ❌ vacío |
| Begin date | `2014` ⚠️ confirmar mes si lo sabés | ❌ vacío |
| Ended | desmarcado | ✅ |
| Disambiguation | `Argentine alternative metal band` | ✅ ya está |

⚠️ Hay dos ciudades llamadas "Buenos Aires" en MusicBrainz. La otra
(`6e917012-…`) es de **Puntarenas, Costa Rica**. No te equivoques de ítem.

## 3.3 Relaciones de URL del artista

| Tipo de relación | URL | Estado |
|---|---|---|
| official homepage | `https://www.haciaelocaso.com/` | ❌ **falta** |
| streaming (free) | `https://open.spotify.com/artist/0qWTEFLLXPxzWbTqjg8QXu` | ✅ |
| streaming | `https://music.apple.com/ar/artist/hacia-el-ocaso/1114769394` | ❌ falta |
| streaming | `https://www.deezer.com/artist/10395280` | ❌ falta |
| youtube | `https://www.youtube.com/channel/UCIEBdateHdWkVd9UYlqc0tA` | ✅ |
| social network | `https://www.instagram.com/heo.oficial/` | ⚠️ corregir |
| social network | `https://www.facebook.com/heo.oficial` | ✅ |
| other databases | `https://www.songkick.com/artists/8767954-hacia-el-ocaso` | ❌ falta |
| other databases | `https://www.wikidata.org/wiki/QBANDA` | ⏳ cuando exista el QID |

## 3.4 Integrantes

A diferencia de Wikidata, en MusicBrainz **sí conviene** cargar a cada integrante como
artista tipo `Person` y vincularlo con la relación **"member of band"**. No hay criterio
de notabilidad y es exactamente para lo que sirve la base. Además es lo único que le
explica a las bases externas por qué hay tres formaciones distintas dando vueltas.

Por cada persona: *Add artist* → Type `Person`, Area `Buenos Aires` (AR), y después
desde la página de la banda *Relationships → Add relationship → member of band*.

### Formación actual

| Persona | Instrumento en la relación | Begin | End |
|---|---|---|---|
| Juan Manuel Albarracín | lead vocals | 2014 ⚠️ confirmar | — |
| Emiliano Demián Zapiola | guitar, vocals | ⚠️ falta | — |
| Nelson Javier Fernández | guitar | ⚠️ falta | — |
| Poli Abdusetir | bass guitar, vocals | 2025-01 | — |
| Damián Bonesi | drums (drum set) | 2024-02 | — |

### Ex integrantes

| Persona | Instrumento | Begin | End |
|---|---|---|---|
| Pablo Mosca | drums (drum set) | 2014-12 | 2023-12 |
| Ramiro Kowalski | bass guitar | 2018-08 | 2025-12 |
| Marcos Rocchi | bass guitar ⚠️ sin confirmar | ⚠️ | ⚠️ |

⚠️ **Antes de cargar:** las fechas de Kowalski (bajo hasta 2025-12) y Abdusetir
(bajo desde 2025-01) se solapan doce meses. MusicBrainz lo acepta, pero si fue un
error de tipeo conviene arreglarlo ahora y no después.

⚠️ **Marcos Rocchi** sale sólo de Pogopedia. No lo cargues hasta confirmar si existió
como bajista (probablemente antes de agosto de 2018).

## 3.5 Lanzamientos a cargar

Nueve en total. Para cada uno: *Add Release* desde la página del artista.

**Valores comunes a todos** (salvo que se indique lo contrario):

```
Release group type   : Album / EP / Single, según corresponda
Artist               : Hacia el Ocaso
Status               : Official
Language             : Spanish
Script               : Latin
Release country      : Argentina (AR)
Format               : Digital Media
Packaging            : None
Label                : [no label]  ← la banda se autoedita; CD Baby es el distribuidor,
                       no el sello. No cargues "CD Baby" como label.
```

> MusicBrainz tiene una relación específica para el distribuidor. Si querés dejarlo
> asentado, usá la relación de release **"distributed by"** → `CD Baby`.

---

### 1) Mitos De Un Futuro Cercano — Álbum
```
Fecha      : 2026-09-17
Barcode    : 885000433313
Tipo       : Album
```
Tracklist (pegá esto en el *track parser* de MusicBrainz, acepta este formato tal cual):
```
1. Intronicte (1:32)
2. Erial (3:41)
3. Parias (2:55)
4. Mitos De Un Futuro Cercano (4:28)
5. Cifra (3:06)
6. Gaia (2:25)
7. Sicofante (2:58)
8. Anamnesis (1:13)
9. Lo Que Siento (3:17)
10. Cae El Velo (3:41)
11. Conexión (3:20)
12. Haciaelocaso.com/union (1:36)
```

### 2) TRSCNDR — Álbum
```
Fecha      : 2020-07-12
Barcode    : ⚠️ FALTA (buscalo en CD Baby)
Tipo       : Album
```
```
1. Alētheia (2:20)
2. Espejos (2:41)
3. Hoy Te Busqué (3:31)
4. Infierno (3:44)
5. Lágrimas (2:45)
6. Áskesis (1:47)
7. En las Sombras (3:40)
8. Más Allá de Mis Ojos (4:00)
9. Ataraxia (2:48)
10. Trascender (2:44)
```
> El título en Apple y Deezer figura como `Trscndr`. El título oficial de la banda es
> `TRSCNDR`. Cargá `TRSCNDR` en MusicBrainz y, si querés, agregá un alias `Trscndr`.

### 3) Amanecer — EP
```
Fecha      : 2016-05-18
Barcode    : ⚠️ FALTA
Tipo       : EP
```
```
1. Track 1 (3:34)
2. Hermanos (2:48)
3. El Peso Del Mundo (3:48)
4. Orgullo (4:16)
5. Soltaste a Las Bestias (4:10)
6. Enterrandote (4:36)
```
> ⚠️ El track 6 figura en plataformas como `Enterrandote`, sin tilde. Si el título
> correcto es `Enterrándote`, este es el momento de arreglarlo (y de corregirlo
> también en CD Baby, que es lo que alimenta a las plataformas).
> Deezer fecha este EP el 01/01/2016 y Apple el 18/05/2016. Confirmá en CD Baby.

### 4) Cae El Velo — Single
```
Fecha : 2025-10-30   ← ojo: el presskit dice 2026, está mal
1. Cae El Velo (3:37)
```

### 5) Cifra — Single
```
Fecha : 2024-05-02
1. Cifra (3:05)
```

### 6) Erial — Single
```
Fecha : 2023-05-18
1. Erial (3:45)
```

### 7) En las Sombras — Single
```
Fecha : 2020-05-07
1. En las Sombras (3:44)
```

### 8) Hoy Te Busqué — Single
```
Fecha : 2018-08-30
1. Hoy Te Busqué (3:32)
```

### 9) Lágrimas — Single
```
Fecha : 2018-10-09
1. Lágrimas (2:47)
```

### No cargar (todavía)
- **El Peso del Mundo (2015, demo)**: no está en ninguna plataforma. Si existe como
  material físico o digital publicado, se puede cargar como release tipo `Demo`.
  Si nunca se distribuyó, no va.

## 3.6 Después de cargar: enlazar cada release a su streaming

Por cada release, en *Relationships* agregá:
`free streaming` → la URL de Spotify del álbum, y `streaming` → la de Apple y Deezer.

| Release | Spotify | Apple | Deezer |
|---|---|---|---|
| MDUFC | `78mapk8m7x0773C0wxsSwy` | `6811223490` | `1076741532` |
| TRSCNDR | `3JY6VlXseXt9KfxXYojHXW` | `1518270361` | `154511902` |
| Amanecer | `1wbRI0DA5Bmfn3LaHNG7xO` | `1114769389` | `13155754` |
| Cae El Velo | ⚠️ falta | `1843542550` | `830989571` |
| Cifra | ⚠️ falta | `1739634644` | `569472811` |
| Erial | ⚠️ falta | `1683600559` | `432922327` |
| En las Sombras | ⚠️ falta | `1504371660` | `138282282` |
| Hoy Te Busqué | ⚠️ falta | `1434528893` | — |
| Lágrimas | ⚠️ falta | `1438808762` | — |

Los IDs de Spotify de los singles los sacás entrando a cada single desde
<https://open.spotify.com/artist/0qWTEFLLXPxzWbTqjg8QXu/discography/single>
y copiando la URL. Pasámelos y actualizo la tabla.

## 3.7 ISRCs

MusicBrainz guarda ISRC por track y es uno de los datos que más ayuda a que las
plataformas crucen bien el catálogo. **Los ISRCs están en tu panel de CD Baby**
(por release, en la ficha de cada tema). Pasámelos y armo la tabla completa
lista para el *ISRC submission* de MusicBrainz.

## 3.8 Checklist de este paso

- [ ] Cuenta de MusicBrainz creada
- [ ] Instagram corregido en el artista
- [ ] Area / Begin area / Begin date cargados
- [ ] official homepage + Apple + Deezer agregados
- [ ] 5 integrantes actuales cargados como Person + member of band
- [ ] 2 ex integrantes cargados con fecha de salida
- [ ] 9 releases cargados
- [ ] Relaciones de streaming por release
- [ ] ISRCs cargados *(necesito los datos de CD Baby)*
- [ ] Wikidata link agregado una vez que exista el QID
