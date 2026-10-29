#!/usr/bin/env python3
"""Make the QR code for a Situated Studio's feedback page, for one workshop.

    pip install segno            (once; add --break-system-packages in a Claude workspace)
    python3 scripts/feedback_qr.py dae-2026-11-03 [out_dir]

Writes feedback-<label>.png (for decks: upload it as the slide image) and
feedback-<label>.svg (for print and HTML) in out_dir (default: the current
folder), and prints the link the code opens. The label is the host and the
date of the session, lower case: <host>-<YYYY-MM-DD>, for example
dae-2026-11-03. A test uses the host "test". The page and the receiver never
change; only the label in the link does. Not served by the site.
"""
import re
import sys
from pathlib import Path

import segno

BASE = "https://bronvandoen.github.io/feedback/?w="
INK = "#111111"  # the design system's ink; the light modules stay transparent, so the code takes the paper it sits on


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    label = sys.argv[1].strip().lower()
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*-\d{4}-\d{2}-\d{2}", label):
        sys.exit(f"Label {label!r} does not follow <host>-<YYYY-MM-DD>, for example dae-2026-11-03.")
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(".")
    out.mkdir(parents=True, exist_ok=True)

    url = BASE + label
    qr = segno.make(url, error="m")
    png = out / f"feedback-{label}.png"
    svg = out / f"feedback-{label}.svg"
    qr.save(png, scale=24, border=2, dark=INK, light=None)
    qr.save(svg, scale=10, border=2, dark=INK, light=None, title=f"QR code to {url}")
    print(url)
    print(png)
    print(svg)


if __name__ == "__main__":
    main()
