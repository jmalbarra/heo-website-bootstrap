# 6. Bio oficial — versión corta y versión larga

Reglas que seguí: **ningún dato inventado**. Todo lo que está acá sale del sitio
oficial, de Apple Music / Deezer, o de la prensa verificada en `01-auditoria.md`.
Lo que necesita confirmación tuya está marcado con ⚠️.

Usá siempre estos textos. Una bio distinta en cada plataforma es exactamente lo
que impide que Google consolide un panel.

---

## 6.1 Versión corta (293 caracteres)

Para: Spotify, Apple Music, Instagram (recortada), YouTube, gacetillas.

```
Hacia el Ocaso es una banda de metal alternativo de Buenos Aires, activa desde
2014. Cruza metal moderno, rock y emo en canciones sobre la lucha interna, la
identidad y la crítica social. Publicó el EP Amanecer (2016), el álbum TRSCNDR
(2020) y el álbum conceptual Mitos De Un Futuro Cercano (2026).
```

### Versión ultra corta (148 caracteres) — para bio de Instagram
```
Metal alternativo desde Buenos Aires · desde 2014
Nuevo álbum: Mitos De Un Futuro Cercano
ocasomcore@gmail.com
haciaelocaso.com
```

### Una línea (para listados y agendas)
```
Hacia el Ocaso — metal alternativo, Buenos Aires (AR), desde 2014.
```

---

## 6.2 Versión larga

Para: presskit, sitio oficial, Bandcamp, envíos a prensa, Wikipedia (si algún día
la escribe un tercero).

```
Hacia el Ocaso es una banda argentina de metal alternativo formada en Buenos
Aires en 2014. Influenciada por el post-hardcore, el metalcore y el deathcore
anglosajón, construyó un sonido propio que cruza metal moderno, rock y emo, con
letras sobre la lucha interna, la búsqueda de identidad, la crítica social y el
deseo de conexión.

Su primer material de estudio fue el EP Amanecer, publicado en mayo de 2016. En
julio de 2020 editó TRSCNDR ("trascender"), su primer álbum de larga duración,
diez canciones donde el metal se cruza con rock, pop, trap y EDM.

Entre 2023 y 2025 la banda publicó los singles Erial, Cifra y Cae el Velo, que
anticiparon su etapa más ambiciosa. Erial tuvo cobertura del webzine finlandés
Chaoszine y la banda fue incluida en "Los 20 duros", la playlist de rock y metal
de la revista española Mariskal Rock. En mayo de 2024 telonearon a Blessthefall
en Buenos Aires.

En septiembre de 2026 publicó Mitos De Un Futuro Cercano, un álbum conceptual de
doce canciones donde la humanidad le confiesa a la Tierra su propio final, la
tecnología promete paraísos que se pagan con el alma y, entre máquinas y corazón
humano, todavía queda lugar para despertar. El disco llega acompañado de un
ecosistema propio: letras sincronizadas en vivo, una IA entrenada con las letras
del álbum y una identidad audiovisual desarrollada a medida.

La banda se mueve con regularidad por salas de la escena porteña y presentó
Mitos De Un Futuro Cercano en La Tangente, en la Ciudad de Buenos Aires.

Formación: Juan Manuel Albarracín (voz), Emiliano Demián Zapiola (guitarra y
voces), Nelson Javier Fernández (guitarra), Poli Abdusetir (bajo y voces) y
Damián Bonesi (batería).

Contacto: ocasomcore@gmail.com · haciaelocaso.com
```

---

## 6.3 Versión en inglés (para prensa internacional tipo Chaoszine)

```
Hacia el Ocaso is an Argentine alternative metal band formed in Buenos Aires in
2014. Drawing on post-hardcore, metalcore and deathcore, the band blends modern
metal, rock and emo into songs about inner conflict, identity, social criticism
and the need for connection.

The band debuted with the EP Amanecer (2016) and released its first full-length,
TRSCNDR, in July 2020. The singles Erial (2023), Cifra (2024) and Cae el Velo
(2025) led to Mitos De Un Futuro Cercano, a twelve-track concept album released
in September 2026, built around humanity confessing its own end to the Earth and
the price of a technological paradise. The record comes with its own interactive
ecosystem: live-synced lyrics, an AI trained on the album's lyrics, and a
purpose-built audiovisual identity.

Hacia el Ocaso plays regularly in Buenos Aires venues and opened for Blessthefall
in May 2024.

Contact: ocasomcore@gmail.com · haciaelocaso.com
```

---

## 6.4 Qué saqué a propósito y por qué

| Dato | Por qué no está |
|---|---|
| "metalcore moderno" como género principal | El sitio ya decidió decir **metal alternativo** (commit `18fb720`). Mantengo esa línea. Metalcore queda como género secundario en Wikidata y en los tags. |
| Demo *El Peso del Mundo* (2015) | No está publicado en ninguna plataforma. No lo puedo verificar. |
| Fecha exacta de la presentación en La Tangente | El presskit dice "mayo 2026" sin día. Puse sólo el lugar. ⚠️ Pasame la fecha exacta y la agrego. |
| "Niceto", "Uniclub", "Frida Club" como salas habituales | Aparecen en listados de Bandsintown que no pude verificar directamente. Dejé la formulación genérica. |
| Cantidad de oyentes / seguidores | Cambia todo el tiempo y envejece mal en una bio. |
| Los ex integrantes (Pablo Mosca, Ramiro Kowalski) | Una bio oficial lista la formación actual. Los ex integrantes van en MusicBrainz y en el JSON-LD del sitio, que es donde sirven para desambiguar. |

## 6.5 Dónde va cada versión

| Lugar | Versión | Límite aproximado |
|---|---|---|
| Spotify for Artists | corta | 1.500 caracteres (entra la larga también) |
| Apple Music for Artists | larga | sin límite estricto |
| YouTube "Acerca de" | corta | 1.000 |
| Instagram | ultra corta | 150 |
| Facebook | corta | — |
| Presskit / sitio | larga | — |
| Mail a prensa | corta + link al presskit | — |
| Bandsintown / Songkick | corta | — |
