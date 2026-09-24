#!/usr/bin/env bash
# Smoke del sitio estático (sin Playwright). Usado por el job CI `smoke`.
set -euo pipefail

ROOT="${SMOKE_ROOT:-.vercel/output/static}"
PORT="${SMOKE_PORT:-4321}"
BASE="http://127.0.0.1:${PORT}"

if [[ ! -d "$ROOT" ]]; then
  echo "error: no existe ${ROOT}. Ejecuta pnpm build antes." >&2
  exit 1
fi

required_files=(
  index.html
  servicios/index.html
  proyectos/index.html
  contacto/index.html
  como-trabajo/index.html
)

for rel in "${required_files[@]}"; do
  if [[ ! -f "${ROOT}/${rel}" ]]; then
    echo "error: falta ${ROOT}/${rel}" >&2
    exit 1
  fi
done

echo "archivos estáticos OK (${#required_files[@]} rutas)"

if ! command -v python3 >/dev/null 2>&1; then
  echo "error: python3 es necesario para el smoke HTTP" >&2
  exit 1
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$ROOT" >/tmp/alexendros-smoke-http.log 2>&1 &
server_pid=$!
cleanup() {
  kill "$server_pid" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in $(seq 1 20); do
  if curl -fsS -o /dev/null "$BASE/" 2>/dev/null; then
    break
  fi
  sleep 0.25
done

routes=(/ /servicios/ /proyectos/ /contacto/ /como-trabajo/)
for path in "${routes[@]}"; do
  code=$(curl -fsS -o /tmp/alexendros-smoke-body.html -w '%{http_code}' "${BASE}${path}")
  if [[ "$code" != "200" ]]; then
    echo "error: ${path} → HTTP ${code}" >&2
    exit 1
  fi
  if ! grep -qi 'alexendros' /tmp/alexendros-smoke-body.html; then
    echo "error: ${path} no contiene la marca alexendros" >&2
    exit 1
  fi
  echo "HTTP 200 ${path}"
done

echo "smoke OK"
