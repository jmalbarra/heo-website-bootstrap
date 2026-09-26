#!/usr/bin/env python3
"""Generate setlist_cupula.pdf — banda, La Cúpula 26/09/2026, tinta invertida (fondo blanco).

Mismos temas que Niceto 23/08/2026 (show con Renacer Del Tiempo).
"""

import base64, io, pathlib
from PIL import Image
from weasyprint import HTML, CSS

ROOT = pathlib.Path(__file__).parent
LOGO = ROOT.parent / "images" / "ojo-goth-blanco.png"
OUT  = ROOT / "setlist_cupula.pdf"

# kind: "song" (numerado) | "interlude" (centrado, sin numerar)
ITEMS = [
    ("Nomios v2 (intro)",           "interlude"),
    ("Espejos",                     "song"),
    ("Cae el Velo",                 "song"),
    ("Intro Mitos",                 "interlude"),
    ("Mitos De Un Futuro Cercano",  "song"),
    ("Erial",                       "song"),
    ("Cifra",                       "song"),
    ("Parias",                      "song"),
    ("Lágrimas (corto)",            "song"),
    ("Más Allá De Mis Ojos",        "song"),
]


def logo_data_uri(path):
    """El logo original es blanco sobre transparente: lo invertimos a negro
    para que se vea sobre fondo blanco (y gaste menos tinta)."""
    im = Image.open(path).convert("RGBA")
    r, g, b, a = im.split()
    inverted = Image.merge("RGBA", (
        r.point(lambda v: 255 - v),
        g.point(lambda v: 255 - v),
        b.point(lambda v: 255 - v),
        a,
    ))
    buf = io.BytesIO()
    inverted.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


logo_src = logo_data_uri(LOGO)

song_num = 0
rows_html = []

for title, kind in ITEMS:
    if kind == "interlude":
        row = f"""
        <div class="row row--interlude">
          <span class="interlude-title">{title}</span>
        </div>"""
    else:
        song_num += 1
        row = f"""
        <div class="row row--song">
          <span class="num">{song_num:02d}</span>
          <span class="title-wrap">
            <span class="song-title">{title}</span>
          </span>
        </div>"""
    rows_html.append(row)

html_src = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  @page {{
    size: A4 portrait;
    margin: 0;
  }}

  * {{ box-sizing: border-box; margin: 0; padding: 0; }}

  body {{
    background: #ffffff;
    color: #0a0a0c;
    font-family: 'Share Tech Mono', monospace;
    width: 210mm;
    height: 297mm;
    display: flex;
    flex-direction: column;
    padding: 12mm 16mm 10mm 16mm;
  }}

  /* ── HEADER ── */
  .header {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(10,10,12,0.35);
    margin-bottom: 6px;
    flex-shrink: 0;
  }}
  .header__logo {{
    height: 46px;
    width: auto;
  }}
  .header__band {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.35em;
    color: #0a0a0c;
    text-transform: uppercase;
  }}
  .header__album {{
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 18px;
    letter-spacing: 0.08em;
    color: #0a0a0c;
    text-align: center;
  }}
  .header__event {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    line-height: 1.5;
    letter-spacing: 0.08em;
    color: rgba(10,10,12,0.75);
    text-align: center;
    text-transform: uppercase;
  }}
  .header__venue {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.22em;
    color: rgba(10,10,12,0.6);
    text-transform: uppercase;
  }}

  /* ── LIST ── */
  .list {{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }}

  /* ── SONG ROW ── */
  .row--song {{
    display: flex;
    align-items: baseline;
    gap: 14px;
    padding: 2px 0;
  }}
  .num {{
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: rgba(10,10,12,0.55);
    min-width: 26px;
    text-align: right;
    flex-shrink: 0;
  }}
  .title-wrap {{
    display: flex;
    flex-direction: column;
    gap: 1px;
  }}
  .song-title {{
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    font-size: 34px;
    letter-spacing: 0.02em;
    color: #0a0a0c;
    line-height: 1.05;
  }}

  /* ── INTERLUDE ROW ── */
  .row--interlude {{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px 0;
  }}
  .interlude-title {{
    font-family: 'Orbitron', sans-serif;
    font-size: 15px;
    font-weight: 400;
    letter-spacing: 0.3em;
    color: rgba(10,10,12,0.65);
    text-transform: uppercase;
  }}

  /* ── FOOTER ── */
  .footer {{
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 8px;
    border-top: 1px solid rgba(10,10,12,0.3);
    margin-top: 6px;
  }}
  .footer span {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.2em;
    color: rgba(10,10,12,0.55);
    text-transform: uppercase;
  }}
</style>
</head>
<body>

  <header class="header">
    <img class="header__logo" src="{logo_src}" alt="HEO">
    <div class="header__band">Hacia el Ocaso</div>
    <div class="header__album">La Cúpula Bar</div>
    <div class="header__event">
      Sábado 26 de Septiembre 2026 · San Justo<br>
      Con Sentencia Previa y Cardinals
    </div>
    <div class="header__venue">Setlist · Banda</div>
  </header>

  <div class="list">
    {"".join(rows_html)}
  </div>

  <footer class="footer">
    <span>Metal desde Buenos Aires · 2026</span>
    <span>@heo.oficial</span>
  </footer>

</body>
</html>"""

HTML(string=html_src).write_pdf(
    str(OUT),
    stylesheets=[CSS(string="@page { size: A4 portrait; margin: 0; }")]
)
print("OK →", OUT)
