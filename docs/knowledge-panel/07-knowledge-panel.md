# 8. Knowledge Panel — cómo aparece, cómo se reclama, cómo se verifica

## 8.1 Lo primero: no se pide, se gana

No existe un formulario para "solicitar un Knowledge Panel". Google lo genera solo
cuando su grafo de entidades tiene suficiente confianza en que la entidad existe,
es distinguible de sus homónimos, y los datos coinciden entre fuentes.

Por eso el orden de este plan es el que es: Wikidata → MusicBrainz → perfiles
reclamados → JSON-LD → prensa. **El panel es la consecuencia, no el trámite.**

Plazo realista desde que terminás los pasos 2 a 7: **entre 1 y 6 meses.** No es
lineal y no hay forma de apurarlo.

## 8.2 Cómo saber si ya apareció

Buscá en Google, con la sesión iniciada y también en incógnito:

```
Hacia el Ocaso
Hacia el Ocaso banda
Hacia el Ocaso metal
```

Tres resultados posibles:

| Qué ves | Qué significa |
|---|---|
| Nada a la derecha (o abajo en mobile) | Todavía no hay panel. Seguí con el plan. |
| Un recuadro con foto, género, integrantes, discos | **Hay panel.** Pasá a 8.3. |
| Un recuadro de *otra* cosa llamada "Hacia el Ocaso" | Problema de desambiguación. Ver 8.5. |

⚠️ Esto no lo puedo verificar yo: los resultados de Google varían por país,
sesión e historial. Chequealo vos y contame qué ves.

## 8.3 Cómo reclamarlo (cuando aparezca)

1. Iniciá sesión en Google con la cuenta de la banda (la de `ocasomcore@gmail.com`
   o la que administre el canal de YouTube).
2. Buscá "Hacia el Ocaso" hasta que aparezca el panel.
3. Al final del panel va a haber un enlace tipo **"Reclamar este panel de conocimiento"**
   / *"Claim this knowledge panel"*. Hacé clic.
4. Google te va a pedir que demuestres que representás a la entidad. Lo hace
   pidiéndote que inicies sesión en **una propiedad oficial que ya esté enlazada
   en el panel**. Las vías posibles:
   - El canal de YouTube (`@heo.oficial`) — la más directa si ya lo tenés en el panel.
   - El sitio oficial, verificado en **Google Search Console** (ver 8.4).
   - Una cuenta social oficial enlazada.
5. Una vez verificado quedás como **representante autorizado**. Eso te habilita a
   **sugerir cambios** en el panel: foto, descripción, datos. No te da control
   directo: Google revisa cada cambio y puede rechazarlo.

⚠️ El nombre exacto del botón y los pasos cambian seguido. Si no lo encontrás,
sacá una captura de lo que ves y la reviso.

## 8.4 Preparar Google Search Console (hacelo ya, no esperes al panel)

Esta es la vía de verificación más confiable y además te sirve para ver si Google
está leyendo bien el JSON-LD nuevo.

1. Entrá a <https://search.google.com/search-console> con la cuenta de la banda.
2. *Agregar propiedad* → **Prefijo de URL** → `https://www.haciaelocaso.com/`
3. Método de verificación: **etiqueta HTML**. Google te va a dar una línea así:
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXX">
   ```
4. **Pasámela** y la agrego a `index.html` en el `<head>`, al lado del canonical.
   Hacés deploy, volvés a Search Console y le das *Verificar*.

Una vez verificado:
- *Inspección de URL* → pegás `https://www.haciaelocaso.com/` → **Solicitar indexación**.
  Esto fuerza a Google a releer la página con el JSON-LD nuevo.
- *Mejoras* → ahí vas a ver si detecta los datos estructurados.

## 8.5 Validar el JSON-LD (hacelo apenas esté deployado)

El `index.html` ahora tiene un bloque `MusicGroup` con la discografía y los
`sameAs` de todos los perfiles. Verificalo en:

- **Prueba de resultados enriquecidos de Google:**
  <https://search.google.com/test/rich-results> → pegás `https://www.haciaelocaso.com/`
- **Validador de schema.org:** <https://validator.schema.org/>

Qué tiene que dar: `MusicGroup` detectado, sin errores. Los "avisos" sobre
propiedades opcionales se pueden ignorar.

⚠️ Cuando tengas el QID de Wikidata, hay que agregarlo al array `sameAs`:
```json
"https://www.wikidata.org/wiki/QBANDA"
```
Pasámelo y lo agrego.

## 8.6 El problema de los homónimos

Hay por lo menos cuatro cosas llamadas "Hacia el Ocaso" dando vueltas:

1. La banda.
2. Una canción de **Palmer** (indie pop/rock, 2018) en Bandcamp.
3. Un single del sello **minima** (art rock, 2018) en Bandcamp.
4. Un artista homónimo en **Discogs** (`7611272`), que aparece en el compilado
   *The Fencepost Reclamation Project Volume 6*.

Más un libro académico español, *Hacia el ocaso de un mito*, que sí tiene ítems en
Wikidata (`Q125341579`, `Q125341591`).

Esto es exactamente por lo que la desambiguación importa:
- La descripción de Wikidata tiene que decir **"grupo argentino de metal alternativo"**,
  bien específica.
- La *disambiguation* de MusicBrainz ya dice "Argentine alternative metal band". Bien.
- El JSON-LD declara `foundingLocation` Buenos Aires y `genre`. Bien.
- Y hay que pelear la grafía: `Hacía el Ocaso` (con tilde, como lo escribió
  Vientos de Poder) es, para una máquina, otra entidad.

## 8.7 Checklist de este paso

- [ ] Search Console: propiedad agregada
- [ ] Meta tag de verificación en `index.html` *(necesito el código)*
- [ ] Propiedad verificada
- [ ] Indexación solicitada para la home
- [ ] JSON-LD validado en Rich Results Test, sin errores
- [ ] QID de Wikidata agregado al `sameAs`
- [ ] Búsqueda mensual en incógnito para detectar cuándo aparece el panel
- [ ] Panel reclamado
- [ ] Datos del panel revisados y corregidos
