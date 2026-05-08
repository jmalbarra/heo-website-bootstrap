#!/usr/bin/env python3
"""Generate entradas-folletitos.pdf — 4 flyers por A4 con QR de WhatsApp."""

import base64, io, pathlib
import qrcode
from weasyprint import HTML, CSS

ROOT   = pathlib.Path(__file__).parent
FLYER_IMG = ROOT.parent / "images" / "WhatsApp Image 2026-05-08 at 12.42.14.jpeg"
OUT    = ROOT / "entradas-folletitos.pdf"

WA_NUMBER  = "5491124564111"
WA_MESSAGE = "Hola! Quiero comprar mi entrada para Valor Interior + Hacia el Ocaso + Resiliencia en Niceto el 24 de Mayo"
WA_URL = f"https://wa.me/{WA_NUMBER}?text={WA_MESSAGE.replace(' ', '%20').replace('+', '%2B').replace('!', '%21')}"

# ── QR ──
qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=8, border=2)
qr.add_data(WA_URL)
qr.make(fit=True)
qr_img = qr.make_image(fill_color="#0a0a0a", back_color="#f0f0f5")
buf = io.BytesIO()
qr_img.save(buf, format="PNG")
qr_b64 = base64.b64encode(buf.getvalue()).decode()
qr_src = f"data:image/png;base64,{qr_b64}"

# ── Flyer image ──
flyer_b64 = base64.b64encode(FLYER_IMG.read_bytes()).decode()
flyer_src  = f"data:image/jpeg;base64,{flyer_b64}"

FLYER = f"""
<div class="flyer">
  <img class="flyer__poster" src="{flyer_src}" alt="Valor Interior · Hacia el Ocaso · Resiliencia">
  <div class="flyer__bottom">
    <div class="flyer__qr-wrap">
      <img class="flyer__qr" src="{qr_src}" alt="QR WhatsApp">
    </div>
    <div class="flyer__cta">
      Conseguí tus entradas en<br>
      <strong>@heo.oficial</strong><br>
      o escaneando este QR
    </div>
  </div>
</div>
"""

html_src = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  @page {{ size: A4 portrait; margin: 0; }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}

  body {{
    width: 210mm;
    height: 297mm;
    background: #0a0a0a;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 1px;
    background-color: #1a1a1f;
  }}

  .flyer {{
    background: #0a0a0a;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }}

  .flyer__poster {{
    width: 100%;
    flex: 1;
    object-fit: cover;
    object-position: top;
    display: block;
    min-height: 0;
  }}

  .flyer__bottom {{
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    background: #0a0a0a;
    border-top: 1px solid #1a1a1f;
    flex-shrink: 0;
  }}

  .flyer__qr-wrap {{
    background: #f0f0f5;
    border-radius: 5px;
    padding: 4px;
    line-height: 0;
    flex-shrink: 0;
  }}

  .flyer__qr {{
    width: 62px;
    height: 62px;
  }}

  .flyer__cta {{
    font-family: 'Share Tech Mono', monospace;
    font-size: 7.5px;
    letter-spacing: 0.08em;
    color: rgba(240,240,245,0.6);
    line-height: 1.8;
  }}

  .flyer__cta strong {{
    color: #f0f0f5;
    font-weight: normal;
    font-size: 8.5px;
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
