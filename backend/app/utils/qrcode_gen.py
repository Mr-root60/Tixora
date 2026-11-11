# backend/app/utils/qrcode_gen.py
import io

import qrcode


def make_qr_png(text: str) -> bytes:
    """Retourne l'image PNG d'un QR code contenant `text`."""
    image = qrcode.make(text)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()
