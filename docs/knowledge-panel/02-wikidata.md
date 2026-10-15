# 2. Wikidata — ítem completo, listo para cargar

Todas las propiedades (`Pxxx`) y todos los valores de ítem (`Qxxx`) de este documento
fueron **verificados contra el endpoint SPARQL de Wikidata el 15/10/2026**. No hay
ningún ID escrito de memoria.

## 2.0 Antes de empezar: dos advertencias honestas

**1. Hacé primero MusicBrainz (paso 3).** Wikidata permite ítems de bandas chicas,
pero un ítem sin ningún ID externo cargado es candidato a que alguien lo proponga
para borrar por notabilidad. Con el MBID cargado y tres referencias de prensa, el
ítem queda sólido. Si invertís el orden, el ítem queda frágil un par de semanas.

**2. Declará el conflicto de interés.** En Wikidata **no** está prohibido que la
banda cargue su propio ítem (a diferencia de Wikipedia). Pero conviene que lo digas
en tu página de usuario: evita discusiones después. Texto listo en 2.6.

## 2.1 Etiquetas, descripciones y alias

| Campo | Idioma | Valor |
|---|---|---|
| Label | es | `Hacia el Ocaso` |
| Label | en | `Hacia el Ocaso` |
| Descripción | es | `grupo argentino de metal alternativo` |
| Descripción | en | `Argentine alternative metal band` |
| Alias | es | `HEO` · `Hacia El Ocaso` |
| Alias | en | `HEO` |

> La descripción en Wikidata va en minúscula y sin punto final. Es la convención.

## 2.2 Declaraciones (statements)

Leyenda de referencias: **R1** = sitio oficial, **R2** = Chaoszine, **R3** = Apple Music,
**R4** = MusicBrainz. El detalle de cada una está en 2.3.

| Propiedad | ID | Valor | Referencia |
|---|---|---|---|
| instancia de | P31 | `Q215380` (musical group) | R1 |
| país de origen | P495 | `Q414` (Argentina) | R1, R2 |
| lugar de formación | P740 | `Q1486` (Buenos Aires) | R1 |
| fecha de fundación | P571 | `2014` (precisión: año) | R1 |
| género | P136 | `Q20378` (alternative metal) | R1 |
| género | P136 | `Q183862` (metalcore) | R2 |
| sitio web oficial | P856 | `https://www.haciaelocaso.com/` | R1 |
| correo electrónico | P968 | `mailto:ocasomcore@gmail.com` | R1 |
| idioma de la obra | P407 | `Q1321` (español) | R1 |
| tiene parte(s) | P527 | integrantes — ver 2.4 | R1 |

### IDs externos (esto es lo que más pesa para el Knowledge Panel)

| Propiedad | ID | Valor |
|---|---|---|
| MusicBrainz artist ID | P434 | `775132f6-8d44-4524-bd3a-4d62f0a1036e` |
| Spotify artist ID | P1902 | `0qWTEFLLXPxzWbTqjg8QXu` |
| Apple Music artist ID | P2850 | `1114769394` |
| Deezer artist ID | P2722 | `10395280` |
| YouTube channel ID | P2397 | `UCIEBdateHdWkVd9UYlqc0tA` |
| YouTube handle | P11245 | `heo.oficial` |
| Instagram username | P2003 | `heo.oficial` |
| Facebook username | P2013 | `heo.oficial` |

**No cargar todavía** (hay que crear o confirmar el perfil primero):
`P1953` Discogs artist ID · `P3192` Last.fm ID · `P7195` Bandsintown artist ID ·
`P4576` TIDAL artist ID · `P2373` Genius artist ID · `P5404` Rate Your Music artist ID ·
`P3283` Bandcamp profile ID · `P18` imagen (requiere subir una foto a Wikimedia Commons
con licencia libre — ver 2.5).

⚠️ **Nunca cargues `P1953` con el valor `7611272`.** Ese Discogs es un homónimo, no la banda.

## 2.3 Referencias — cada dato con su fuente

Wikidata quiere que *cada* statement tenga referencia. Estas cuatro cubren todo.

### R1 — Sitio oficial
```
P854  (reference URL)  https://www.haciaelocaso.com/
P813  (retrieved)      15 de octubre de 2026
```
Vale para: formación, origen, género, integrantes, contacto. Es fuente primaria:
Wikidata la acepta para datos factuales no controvertidos sobre el propio sujeto.

### R2 — Chaoszine (fuente independiente, la más fuerte)
```
P854   (reference URL)      https://chaoszine.net/listen-to-erial-by-hacia-el-ocaso-powerful-sounds-from-argentina/
P1476  (title)              Listen to "Erial" by Hacia el Ocaso: powerful sounds from Argentina  (en)
P577   (publication date)   9 de julio de 2024
P813   (retrieved)          15 de octubre de 2026
```

### R3 — Apple Music (para fechas de lanzamiento)
```
P854  (reference URL)  https://music.apple.com/ar/artist/hacia-el-ocaso/1114769394
P813  (retrieved)      15 de octubre de 2026
```

### R4 — MusicBrainz
```
P854  (reference URL)  https://musicbrainz.org/artist/775132f6-8d44-4524-bd3a-4d62f0a1036e
P813  (retrieved)      15 de octubre de 2026
```

### R5 — Vientos de Poder (crónica argentina, de refuerzo)
```
P854   (reference URL)      https://vientosdepoder.com/el-metalcore-brillo-en-una-energica-noche-de-la-mano-de-blessthefall/
P1476  (title)              El Metalcore brilló en una enérgica noche, de la mano de Blessthefall  (es)
P577   (publication date)   25 de mayo de 2024
P813   (retrieved)          15 de octubre de 2026
```

## 2.4 Integrantes (P527) — FALTAN DATOS

Cada integrante necesita **su propio ítem de Wikidata** para poder enlazarse con P527.
Crear un ítem por persona sólo porque está en una banda chica es discutible y puede
terminar borrado. **Recomendación: no crees ítems para las personas todavía.**
Cargá los integrantes recién cuando la banda tenga más cobertura, o dejalos sólo en
el JSON-LD del sitio (donde no hay criterio de notabilidad).

Si igual querés cargarlos, el modelado correcto es:

```
P527 (tiene parte) → [ítem de la persona]
   qualifier P1303 (instrumento) → Q17172850 (voice) / Q6607 (guitar) /
                                   Q46185 (bass guitar) / Q128309 (drum kit)
   qualifier P580 (start time)   → fecha de ingreso
   qualifier P582 (end time)     → sólo para los que se fueron
```

Formación a cargar, con lo que falta marcado:

| Persona | Instrumento (QID) | Desde | Estado del dato |
|---|---|---|---|
| Juan Manuel Albarracín | voz → `Q17172850` | 2014 ⚠️ confirmar | OK |
| Emiliano Demián Zapiola | guitarra y voz → `Q6607` + `Q17172850` | ⚠️ falta | OK |
| Nelson Javier Fernández | guitarra → `Q6607` | ⚠️ falta | OK |
| **Ramiro Kowalski** | ❓ **FALTA** | ⚠️ falta | **bloqueante** |
| **Pablo Mosca** | ❓ **FALTA** | ⚠️ falta | **bloqueante** |
| Poli Abdusetir (ex) | bajo → `Q46185` | hasta ⚠️ falta | ex integrante |
| Damián Bonesi (ex) | batería → `Q128309` | hasta ⚠️ falta | ex integrante |

## 2.5 Imagen (P18)

Para que el Knowledge Panel muestre foto de banda conviene tener una en Wikimedia Commons.
Requisito: tenés que ser el titular de los derechos de la foto (o tener la autorización
escrita del fotógrafo) y liberarla bajo **CC BY-SA 4.0**. Eso es irrevocable: la foto
queda reutilizable por cualquiera, incluso comercialmente, citando autoría.

Si no te cierra liberar una foto así, **no la subas**. El panel igual se arma; Google
puede tomar la imagen del perfil verificado de Spotify o YouTube.

## 2.6 Declaración de conflicto de interés (pegar en tu página de usuario)

```
Soy Juan Manuel Albarracín, integrante de la banda Hacia el Ocaso. Edito el ítem
de la banda y los de sus lanzamientos. Me limito a cargar datos factuales
verificables con fuentes publicadas (fechas de lanzamiento, IDs de plataformas,
formación) y no cargo valoraciones ni material promocional.
```

## 2.7 Carga rápida con QuickStatements (opción recomendada)

1. Creá tu cuenta en wikidata.org y hacé **al menos 10 ediciones manuales menores**
   en cualquier ítem para quedar *autoconfirmed*. QuickStatements no funciona bien sin eso.
2. Entrá a <https://quickstatements.toolforge.org/> y autorizá la herramienta con tu cuenta.
3. **New batch → Import V1 commands** y pegá esto tal cual:

```
CREATE
LAST|Les|"Hacia el Ocaso"
LAST|Len|"Hacia el Ocaso"
LAST|Des|"grupo argentino de metal alternativo"
LAST|Den|"Argentine alternative metal band"
LAST|Ases|"HEO"
LAST|Aen|"HEO"
LAST|P31|Q215380|S854|"https://www.haciaelocaso.com/"|S813|+2026-10-15T00:00:00Z/11
LAST|P495|Q414|S854|"https://www.haciaelocaso.com/"|S813|+2026-10-15T00:00:00Z/11
LAST|P740|Q1486|S854|"https://www.haciaelocaso.com/"|S813|+2026-10-15T00:00:00Z/11
LAST|P571|+2014-00-00T00:00:00Z/9|S854|"https://www.haciaelocaso.com/"|S813|+2026-10-15T00:00:00Z/11
LAST|P136|Q20378|S854|"https://www.haciaelocaso.com/"|S813|+2026-10-15T00:00:00Z/11
LAST|P136|Q183862|S854|"https://chaoszine.net/listen-to-erial-by-hacia-el-ocaso-powerful-sounds-from-argentina/"|S813|+2026-10-15T00:00:00Z/11
LAST|P407|Q1321|S854|"https://www.haciaelocaso.com/"|S813|+2026-10-15T00:00:00Z/11
LAST|P856|"https://www.haciaelocaso.com/"
LAST|P968|"mailto:ocasomcore@gmail.com"|S854|"https://www.haciaelocaso.com/presskit.html"|S813|+2026-10-15T00:00:00Z/11
LAST|P434|"775132f6-8d44-4524-bd3a-4d62f0a1036e"
LAST|P1902|"0qWTEFLLXPxzWbTqjg8QXu"
LAST|P2850|"1114769394"
LAST|P2722|"10395280"
LAST|P2397|"UCIEBdateHdWkVd9UYlqc0tA"
LAST|P11245|"heo.oficial"
LAST|P2003|"heo.oficial"
LAST|P2013|"heo.oficial"
```

4. **Run**. Anotá el QID que devuelve (va a ser algo tipo `Q1340…`) y pegámelo:
   lo necesito para el `sameAs` del sitio y para los ítems de los discos.

### Si preferís cargarlo a mano
`wikidata.org` → *Crear un elemento nuevo* → completás label y descripción en es y en →
*Añadir declaración* → escribís el nombre de la propiedad (ej: "instance of"), elegís el
valor, y en cada declaración hacés clic en **"+ añadir referencia"** → propiedad
`reference URL` + `retrieved`. Repetís con la tabla de 2.2. Tarda unos 40 minutos.

## 2.8 Después del ítem de la banda: los ítems de los discos

Una vez creado el ítem de la banda (lo llamo `QBANDA`), creá uno por álbum. Esto
refuerza mucho el panel porque Google arma la fila "Álbumes".

Todos los IDs de abajo están verificados: `Q482994` = album, `Q169930` = extended play,
`P175` = performer, `P577` = publication date, `P2205` = Spotify album ID,
`P2281` = Apple Music album ID, `P436` = MusicBrainz release group ID.

**Reemplazá `QBANDA` por el QID real de la banda antes de correr cada batch.**

**Mitos De Un Futuro Cercano**
```
CREATE
LAST|Les|"Mitos De Un Futuro Cercano"
LAST|Len|"Mitos De Un Futuro Cercano"
LAST|Des|"álbum de Hacia el Ocaso de 2026"
LAST|Den|"2026 album by Hacia el Ocaso"
LAST|P31|Q482994
LAST|P175|QBANDA
LAST|P577|+2026-09-17T00:00:00Z/11|S854|"https://music.apple.com/ar/album/mitos-de-un-futuro-cercano/6811223490"|S813|+2026-10-15T00:00:00Z/11
LAST|P136|Q20378
LAST|P407|Q1321
LAST|P2205|"78mapk8m7x0773C0wxsSwy"
LAST|P2281|"6811223490"
```

**TRSCNDR**
```
CREATE
LAST|Les|"TRSCNDR"
LAST|Len|"TRSCNDR"
LAST|Des|"álbum de Hacia el Ocaso de 2020"
LAST|Den|"2020 album by Hacia el Ocaso"
LAST|P31|Q482994
LAST|P175|QBANDA
LAST|P577|+2020-07-12T00:00:00Z/11|S854|"https://music.apple.com/ar/album/trscndr/1518270361"|S813|+2026-10-15T00:00:00Z/11
LAST|P136|Q20378
LAST|P407|Q1321
LAST|P2205|"3JY6VlXseXt9KfxXYojHXW"
LAST|P2281|"1518270361"
```

**Amanecer (EP)**
```
CREATE
LAST|Les|"Amanecer"
LAST|Len|"Amanecer"
LAST|Des|"EP de Hacia el Ocaso de 2016"
LAST|Den|"2016 EP by Hacia el Ocaso"
LAST|P31|Q169930
LAST|P175|QBANDA
LAST|P577|+2016-05-18T00:00:00Z/11|S854|"https://music.apple.com/ar/album/amanecer-ep/1114769389"|S813|+2026-10-15T00:00:00Z/11
LAST|P136|Q20378
LAST|P407|Q1321
LAST|P2205|"1wbRI0DA5Bmfn3LaHNG7xO"
LAST|P2281|"1114769389"
```

Cuando los release groups existan en MusicBrainz (paso 3), agregá a cada ítem
`P436` con el MBID del release group. Y en el ítem de la banda, agregá
`P527` → cada álbum no hace falta: la relación la establece `P175` desde el álbum.

## 2.9 Checklist de este paso

- [ ] Instrumentos de Kowalski y Mosca definidos *(bloqueante)*
- [ ] Cuenta de Wikidata creada y autoconfirmada
- [ ] Declaración de COI en la página de usuario
- [ ] MusicBrainz completo (paso 3) — hacelo antes
- [ ] Batch de 2.7 corrido → **QID = ________**
- [ ] QID agregado al `sameAs` del JSON-LD del sitio
- [ ] Ítems de los 3 discos creados
- [ ] `P1953` / `P3192` / `P7195` cargados cuando existan esos perfiles
