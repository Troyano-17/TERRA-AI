#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if command -v node >/dev/null 2>&1; then
  node server.mjs
elif command -v python3 >/dev/null 2>&1; then
  echo "Servidor estatico sin endpoints HTTP simulados. URL http://localhost:4173"
  python3 -m http.server 4173
else
  echo "Necesitas Node.js 18+ o Python 3."; exit 1
fi
