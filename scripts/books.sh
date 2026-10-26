#!/usr/bin/env bash
# Turns flat covers (assets/book-covers) into Apple Books-like books (public/images/books):
# spine shading, crease highlight, sheen, rounded corners and a soft shadow.
# Output is COVER_W x COVER_H plus PAD of transparent space on every side (see COVER in reading.ts).
set -euo pipefail

COVER_W=200
COVER_H=300
PAD=14
SRC=assets/book-covers
OUT=public/images/books

mkdir -p "$OUT"
for src in "$SRC"/*.webp; do
  name=$(basename "$src")
  magick "$src" -resize "${COVER_W}x${COVER_H}^" -gravity center -extent "${COVER_W}x${COVER_H}" +repage \
    \( -size "${COVER_H}x16" gradient:"rgba(0,0,0,0.42)-rgba(0,0,0,0)" -rotate -90 \) -gravity west -compose over -composite \
    \( -size "2x${COVER_H}" xc:"rgba(255,255,255,0.35)" \) -gravity northwest -geometry +7+0 -compose over -composite \
    \( -size "1x${COVER_H}" xc:"rgba(0,0,0,0.22)" \) -gravity northwest -geometry +10+0 -compose over -composite \
    -geometry +0+0 \
    \( -size "${COVER_W}x${COVER_H}" gradient:"rgba(255,255,255,0.14)-rgba(255,255,255,0)" \) -compose over -composite \
    \( -size "${COVER_W}x${COVER_H}" xc:none -fill white -draw "roundrectangle 0,0,$((COVER_W - 1)),$((COVER_H - 1)),4,4" \) \
    -alpha set -compose DstIn -composite \
    -compose over +gravity -bordercolor none -border "$PAD" \
    \( +clone -alpha extract -blur 0x6 -background black -alpha shape -channel A -evaluate multiply 0.45 +channel -roll +3+6 \) \
    +swap -compose over -composite \
    -quality 88 "$OUT/$name"
done
