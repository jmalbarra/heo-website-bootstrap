#!/usr/bin/env python3
"""Generate setlist_boyler.pdf — banda, temas separados de a uno, sin tiempos."""

import base64, pathlib
from weasyprint import HTML, CSS

ROOT = pathlib.Path(__file__).parent
LOGO = ROOT.parent / "images" / "ojo-goth-blanco.png"
OUT  = ROOT / "setlist_boyler.pdf"

# kind: "song" (numerado) | "interlude" (centrado, sin numerar)
ITEMS = [
    ("Nomios v2 (intro)",       "interlude"),
    ("Espejos",                 "song"),
    ("Cae el Velo",             "song"),
    ("Intro Mitos",             "interlude"),
    ("Erial",                   "song"),
    ("Cifra",                   "song"),
    ("Parias",                  "song"),
    ("Lágrimas (corto)",        "song"),
    ("Más Allá De Mis Ojos",    "song"),
]

logo_b64 = base64.b64encode(LOGO.read_bytes()).decode()
logo_src  = f"data:image/png;base64,{logo_b64}"

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
    background: #050507;
    color: #f0f0f5;
    font-family: 'Share Tech Mono', monospace;
    width: 210mm;
    height: 297mm;
    display: flex;
    flex-direction: column;
    padding: 14mm 16mm 10mm 16mm;
  }}

  /* ── HEADER ── */
  .header {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(34,238,201,0.25);
    margin-bottom: 8px;
    flex-shrink: 0;
  }}
  .header__logo {{
    height: 62px;
    width: auto;
    filter: drop-shadow(0 0 8px rgba(34,238,201,0.7));
  }}
  .header__band {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.35em;
    color: #22eec9;
    text-transform: uppercase;
  }}
  .header__album {{
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 19px;
    letter-spacing: 0.08em;
    color: #f0f0f5;
    text-align: center;
  }}
  .header__venue {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.22em;
    color: rgba(34,238,201,0.6);
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
    font-size: 11px;
    font-weight: 400;
    color: #22eec9;
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
    font-size: 30px;
    letter-spacing: 0.02em;
    color: #f0f0f5;
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
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.3em;
    color: #22eec9;
    opacity: 0.75;
    text-transform: uppercase;
  }}

  /* ── FOOTER ── */
  .footer {{
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 8px;
    border-top: 1px solid rgba(34,238,201,0.2);
    margin-top: 6px;
  }}
  .footer span {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.2em;
    color: rgba(240,240,245,0.35);
    text-transform: uppercase;
  }}
</style>
</head>
<body>

  <header class="header">
    <img class="header__logo" src="{logo_src}" alt="HEO">
    <div class="header__band">Hacia el Ocaso</div>
    <div class="header__album">Tío Bizarro</div>
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
