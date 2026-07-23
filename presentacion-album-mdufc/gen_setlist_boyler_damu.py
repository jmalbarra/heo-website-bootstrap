#!/usr/bin/env python3
"""Generate setlist_boyler_damu.pdf — marcadores del proyecto para Damu (batería)."""

import base64, pathlib
from weasyprint import HTML, CSS

ROOT = pathlib.Path(__file__).parent
LOGO = ROOT.parent / "images" / "ojo-goth-blanco.png"
OUT  = ROOT / "setlist_boyler_damu.pdf"

# (marcador o None si no tiene, [temas del grupo])
GROUPS = [
    (None, ["Nomios v2 (intro)"]),
    ("0",  ["Espejos", "Cae el Velo"]),
    ("1",  ["Intro Mitos"]),
    ("2",  ["Erial"]),
    ("3",  ["Cifra", "Parias"]),
    ("4",  ["Lágrimas (corto)"]),
    ("5",  ["Más Allá De Mis Ojos"]),
]

logo_b64 = base64.b64encode(LOGO.read_bytes()).decode()
logo_src  = f"data:image/png;base64,{logo_b64}"

rows_html = []
for marker, songs in GROUPS:
    songs_html = "".join(f'<span class="dsong">{s}</span>' for s in songs)
    trigger_html = marker if marker is not None else '<span class="trigger--none">s/m</span>'
    rows_html.append(f"""
    <div class="drow">
      <span class="trigger">{trigger_html}</span>
      <div class="drow__songs">{songs_html}</div>
    </div>""")

html_src = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

  @page {{ size: A4 portrait; margin: 0; }}

  * {{ box-sizing: border-box; margin: 0; padding: 0; }}

  body {{
    background: #050507;
    color: #f0f0f5;
    font-family: 'Share Tech Mono', monospace;
    width: 210mm;
    height: 297mm;
    display: flex;
    flex-direction: column;
    padding: 12mm 14mm 10mm 14mm;
  }}

  /* ── HEADER ── */
  .header {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding-bottom: 9px;
    border-bottom: 1px solid rgba(34,238,201,0.25);
    margin-bottom: 6px;
    flex-shrink: 0;
  }}
  .header__logo {{
    height: 52px;
    width: auto;
    filter: drop-shadow(0 0 8px rgba(34,238,201,0.7));
  }}
  .header__band {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.35em;
    color: #22eec9;
    text-transform: uppercase;
  }}
  .header__album {{
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 17px;
    letter-spacing: 0.08em;
    color: #f0f0f5;
    text-align: center;
  }}
  .header__sub {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.22em;
    color: rgba(34,238,201,0.55);
    text-transform: uppercase;
  }}

  /* ── LIST ── */
  .list {{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }}

  /* ── ROW ── */
  .drow {{
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 2px 0;
  }}

  .trigger {{
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 52px;
    color: #22eec9;
    min-width: 62px;
    text-align: right;
    line-height: 1;
    flex-shrink: 0;
    text-shadow: 0 0 18px rgba(34,238,201,0.5);
  }}

  .trigger--none {{
    font-family: 'Share Tech Mono', monospace;
    font-weight: 400;
    font-size: 16px;
    color: rgba(240,240,245,0.35);
    text-shadow: none;
    letter-spacing: 0.05em;
  }}

  .drow__songs {{
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-left: 2px solid rgba(34,238,201,0.18);
    padding-left: 16px;
  }}

  .dsong {{
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    font-size: 30px;
    letter-spacing: 0.02em;
    color: #f0f0f5;
    line-height: 1.15;
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
    <div class="header__sub">Pistas · Damu</div>
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
