#!/usr/bin/env python3
"""Generate entradas-folletitos.pdf — 4 flyers por A4 con QR de WhatsApp."""

import base64, io, pathlib
import qrcode
from weasyprint import HTML, CSS

ROOT = pathlib.Path(__file__).parent
LOGO = ROOT.parent / "images" / "ojo-goth-blanco.png"
OUT  = ROOT / "entradas-folletitos.pdf"

WA_NUMBER  = "5491124564111"
WA_MESSAGE = "Hola! Quiero comprar mi entrada para Valor Interior + Hacia el Ocaso + Resiliencia en Niceto el 24 de Mayo"
WA_URL = f"https://wa.me/{WA_NUMBER}?text={WA_MESSAGE.replace(' ', '%20').replace('+', '%2B').replace('!', '%21')}"

# ── QR ──
qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=8, border=2)
qr.add_data(WA_URL)
qr.make(fit=True)
qr_img = qr.make_image(fill_color="#050507", back_color="#f0f0f5")
buf = io.BytesIO()
qr_img.save(buf, format="PNG")
qr_b64 = base64.b64encode(buf.getvalue()).decode()
qr_src = f"data:image/png;base64,{qr_b64}"

# ── Logo ──
logo_b64 = base64.b64encode(LOGO.read_bytes()).decode()
logo_src  = f"data:image/png;base64,{logo_b64}"

FLYER = f"""
<div class="flyer">
  <div class="flyer__top">
    <img class="flyer__logo" src="{logo_src}" alt="HEO">
    <div class="flyer__bands">Valor Interior · Hacia el Ocaso · Resiliencia</div>
    <div class="flyer__event">Niceto · 24 de Mayo · Buenos Aires</div>
  </div>
  <div class="flyer__qr-wrap">
    <img class="flyer__qr" src="{qr_src}" alt="QR WhatsApp">
  </div>
  <div class="flyer__cta">
    Conseguí tus entradas en <strong>@heo.oficial</strong><br>
    o escaneando este QR
  </div>
</div>
"""

html_src = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');

  @page {{ size: A4 portrait; margin: 0; }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}

  body {{
    width: 210mm;
    height: 297mm;
    background: #fff;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0;
  }}

  .flyer {{
    background: #050507;
    border: 1px solid #1a1a1f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 18px 16px;
    text-align: center;
  }}

  .flyer__top {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
  }}

  .flyer__logo {{
    height: 48px;
    width: auto;
    filter: drop-shadow(0 0 6px rgba(34,238,201,0.6));
  }}

  .flyer__bands {{
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 9.5px;
    letter-spacing: 0.05em;
    color: #f0f0f5;
    line-height: 1.4;
  }}

  .flyer__event {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 8.5px;
    letter-spacing: 0.25em;
    color: #22eec9;
    text-transform: uppercase;
  }}

  .flyer__qr-wrap {{
    background: #f0f0f5;
    border-radius: 8px;
    padding: 8px;
    line-height: 0;
  }}

  .flyer__qr {{
    width: 110px;
    height: 110px;
  }}

  .flyer__cta {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.1em;
    color: rgba(240,240,245,0.65);
    line-height: 1.7;
  }}

  .flyer__cta strong {{
    color: #22eec9;
    font-weight: normal;
  }}
</style>
</head>
<body>
  {FLYER * 4}
</body>
</html>"""

HTML(string=html_src).write_pdf(
    str(OUT),
    stylesheets=[CSS(string="@page { size: A4 portrait; margin: 0; }")]
)
print("OK →", OUT)
