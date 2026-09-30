#!/usr/bin/env python3
"""Generate setlist_bula_damu.pdf — marcadores del proyecto para Damu (batería).

Club Cultural Bula 10/10/2026, mismos temas que La Cúpula 26/09/2026. Tinta
invertida (fondo blanco) para gastar menos tinta. Suma el QR de la Unión al pie
(haciaelocaso.com/union/?src=setlist), igual que la lista de la banda.
"""

import base64, io, pathlib
from PIL import Image
from weasyprint import HTML, CSS

ROOT = pathlib.Path(__file__).parent
LOGO = ROOT.parent / "images" / "ojo-goth-blanco.png"
QR   = ROOT / "qr_union_setlist.png"   # QR a /union/?src=setlist (generado con segno)
OUT  = ROOT / "setlist_bula_damu.pdf"

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


def png_data_uri(path):
    return "data:image/png;base64," + base64.b64encode(pathlib.Path(path).read_bytes()).decode()


logo_src = logo_data_uri(LOGO)
qr_src = png_data_uri(QR)

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
  .header__logo {{ height: 42px; width: auto; }}
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
  .list {{ flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; }}

  /* ── ROW ── */
  .drow {{ display: flex; align-items: center; gap: 18px; padding: 2px 0; }}
  .trigger {{
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 58px;
    color: #0a0a0c;
    min-width: 62px;
    text-align: right;
    line-height: 1;
    flex-shrink: 0;
  }}
  .trigger--none {{
    font-family: 'Share Tech Mono', monospace;
    font-weight: 400;
    font-size: 18px;
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
    font-size: 34px;
    letter-spacing: 0.02em;
    color: #0a0a0c;
    line-height: 1.15;
  }}

  /* ── BLOQUE UNIÓN (QR) ── */
  .union {{
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    margin-top: 6px;
    border: 1px solid rgba(10,10,12,0.35);
    border-radius: 6px;
  }}
  .union__qr {{ width: 20mm; height: 20mm; flex-shrink: 0; }}
  .union__kick {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(10,10,12,0.6);
    margin-bottom: 3px;
  }}
  .union__line {{
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 1.15;
    margin-bottom: 3px;
  }}
  .union__url {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    color: rgba(10,10,12,0.7);
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

  /* ── MARCA DE AGUA ── */
  .watermark {{
    position: absolute;
    top: 0;
    left: 0;
    width: 210mm;
    height: 297mm;
    background: url({logo_src}) center / 170mm auto no-repeat;
    opacity: 0.10;
  }}
  .header, .list, .union, .footer {{ position: relative; z-index: 1; }}
</style>
</head>
<body>

  <div class="watermark"></div>

  <header class="header">
    <img class="header__logo" src="{logo_src}" alt="HEO">
    <div class="header__band">Hacia el Ocaso</div>
    <div class="header__album">Club Cultural Bula</div>
    <div class="header__event">
      Viernes 10 de Octubre 2026 · 19 hs · CABA<br>
      Con INYOURHANDS, Nihil e Instante
    </div>
    <div class="header__sub">Pistas · Damu</div>
  </header>

  <div class="list">
    {"".join(rows_html)}
  </div>

  <div class="union">
    <img class="union__qr" src="{qr_src}" alt="QR Unión">
    <div class="union__txt">
      <div class="union__kick">Sumate a la Unión</div>
      <div class="union__line">Sos parte de Hacia el Ocaso. Hacelo oficial.</div>
      <div class="union__url">haciaelocaso.com/union</div>
    </div>
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
