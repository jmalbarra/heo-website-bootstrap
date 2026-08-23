#!/usr/bin/env python3
"""Generate setlist_niceto_damu.pdf — marcadores del proyecto para Damu (batería).

Niceto 23/08/2026, tinta invertida (fondo blanco) para gastar menos tinta.
"""

import base64, io, pathlib
from PIL import Image
from weasyprint import HTML, CSS

ROOT = pathlib.Path(__file__).parent
LOGO = ROOT.parent / "images" / "ojo-goth-blanco.png"
OUT  = ROOT / "setlist_niceto_damu.pdf"

# (marcador o None si no tiene, [temas del grupo])
GROUPS = [
    (None, ["Nomios v2 (intro)"]),
    ("0",  ["Espejos", "Cae el Velo"]),
    ("1",  ["Intro Mitos", "Mitos De Un Futuro Cercano"]),
    ("2",  ["Erial"]),
    ("3",  ["Cifra", "Parias"]),
    ("4",  ["Lágrimas (corto)"]),
    ("5",  ["Más Allá De Mis Ojos"]),
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
    background: #ffffff;
    color: #0a0a0c;
    font-family: 'Share Tech Mono', monospace;
    width: 210mm;
    height: 297mm;
    display: flex;
    flex-direction: column;
    padding: 11mm 14mm 10mm 14mm;
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
    height: 42px;
    width: auto;
  }}
  .header__band {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.35em;
    color: #0a0a0c;
    text-transform: uppercase;
  }}
  .header__album {{
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 17px;
    letter-spacing: 0.08em;
    color: #0a0a0c;
    text-align: center;
  }}
  .header__event {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 8.5px;
    line-height: 1.5;
    letter-spacing: 0.08em;
    color: rgba(10,10,12,0.75);
    text-align: center;
    text-transform: uppercase;
  }}
  .header__sub {{
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
    color: #0a0a0c;
    min-width: 62px;
    text-align: right;
    line-height: 1;
    flex-shrink: 0;
  }}

  .trigger--none {{
    font-family: 'Share Tech Mono', monospace;
    font-weight: 400;
    font-size: 16px;
    color: rgba(10,10,12,0.5);
    letter-spacing: 0.05em;
  }}

  .drow__songs {{
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-left: 2px solid rgba(10,10,12,0.3);
    padding-left: 16px;
  }}

  .dsong {{
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    font-size: 29px;
    letter-spacing: 0.02em;
    color: #0a0a0c;
    line-height: 1.15;
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
    <div class="header__album">Niceto Club</div>
    <div class="header__event">
      23 de Agosto 2026 · Presentación de «Aunque Me Cueste El Alma» de Renacer Del Tiempo<br>
      Con Fuego Interior y Renacer Del Tiempo
    </div>
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
