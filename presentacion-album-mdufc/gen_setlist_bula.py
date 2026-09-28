#!/usr/bin/env python3
"""Generate setlist_bula.pdf — banda, Club Cultural Bula 10/10/2026, tinta invertida (fondo blanco).

Mismos temas que La Cúpula 26/09/2026. Suma el QR de la Unión al pie: la lista
que se reparte en el show lleva a haciaelocaso.com/union/?src=setlist, así el
alta por este canal se puede medir aparte en el panel.
"""

import base64, io, pathlib
from PIL import Image
from weasyprint import HTML, CSS

ROOT = pathlib.Path(__file__).parent
LOGO = ROOT.parent / "images" / "ojo-goth-blanco.png"
QR   = ROOT / "qr_union_setlist.png"   # QR a /union/?src=setlist (generado con segno)
OUT  = ROOT / "setlist_bula.pdf"

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


def png_data_uri(path):
    return "data:image/png;base64," + base64.b64encode(pathlib.Path(path).read_bytes()).decode()


logo_src = logo_data_uri(LOGO)
qr_src = png_data_uri(QR)

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
  .header__logo {{ height: 46px; width: auto; }}
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
  .list {{ flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; }}

  /* ── SONG ROW ── */
  .row--song {{ display: flex; align-items: baseline; gap: 14px; padding: 2px 0; }}
  .num {{
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: rgba(10,10,12,0.55);
    min-width: 26px;
    text-align: right;
    flex-shrink: 0;
  }}
  .title-wrap {{ display: flex; flex-direction: column; gap: 1px; }}
  .song-title {{
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    font-size: 34px;
    letter-spacing: 0.02em;
    color: #0a0a0c;
    line-height: 1.05;
  }}

  /* ── INTERLUDE ROW ── */
  .row--interlude {{ display: flex; justify-content: center; align-items: center; padding: 2px 0; }}
  .interlude-title {{
    font-family: 'Orbitron', sans-serif;
    font-size: 15px;
    font-weight: 400;
    letter-spacing: 0.3em;
    color: rgba(10,10,12,0.65);
    text-transform: uppercase;
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
  .union__qr {{ width: 22mm; height: 22mm; flex-shrink: 0; }}
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
    font-size: 15px;
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
    <div class="header__venue">Setlist · Banda</div>
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
