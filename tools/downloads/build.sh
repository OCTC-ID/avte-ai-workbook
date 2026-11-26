#!/bin/sh
# Rebuilds downloads/AI-and-Your-Teaching.pdf and .epub from the live pages.
# Run from the repo root. Needs Node + Playwright, Python (pypdf, bs4, lxml), pandoc, poppler-utils.
set -e
T=$(mktemp -d); R=$(pwd); H=tools/downloads
python3 -m http.server 8765 >/dev/null 2>&1 & S=$!; trap 'kill $S 2>/dev/null; rm -f "$R/_title.html"' EXIT; sleep 1
cp $H/title.html _title.html
node $H/pdf.js $T && python3 $H/merge.py $T downloads/AI-and-Your-Teaching.pdf
node -e "const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:816,height:1056},deviceScaleFactor:2});await p.goto('http://localhost:8765/_title.html',{waitUntil:'networkidle'});await p.screenshot({path:'$T/cover.jpg',type:'jpeg',quality:88});await b.close();})();"
node $H/grab.js $T/pages.json && python3 $H/clean.py $T/pages.json $T/book.html
cd $T && pandoc book.html -f html -t epub3 -o "$R/downloads/AI-and-Your-Teaching.epub" --split-level=1 --toc --toc-depth=1 \
  --css "$R/$H/epub.css" --epub-cover-image cover.jpg --epub-embed-font="$R/fonts/patrick-hand-latin-400.woff2" \
  --metadata title="AI and Your Teaching" --metadata subtitle="A workbook for new vet tech faculty" --metadata author="Stephanie Self" \
  --metadata lang=en-US --metadata rights="Creative Commons BY-NC-SA 4.0" --metadata date=$(date +%F)
echo "Built both downloads."
