# Checklist smoke — POST /api/contact (issue #13)

Automatización en CI: `pnpm test:contract` (Vitest del schema/SMTP/handler). E2E UI mockea la API (`tests/e2e/contact.spec.ts`) — **no** envía correo real.

Smoke contra Preview/Production con SMTP+Upstash reales: **manual** (o job futuro con sandbox). No commitear secretos.

## Precondiciones

- [ ] Variables en Vercel Production (nombres): `SMTP_*`, `UPSTASH_*`, `PUBLIC_SITE_URL`
- [ ] Preview solo con sandbox o omitido (fail-closed 503 sin Upstash)
- [ ] WP-1/WP-2 mergeados en el deployment bajo prueba

## Comandos (sin secretos)

```bash
# Contrato local
pnpm test:contract

# Método no permitido (tras deploy)
curl -sS -o /tmp/contact-get.txt -w '%{http_code}\n' 'https://alexendros.dev/api/contact'
# Esperado: 405

# Payload inválido
curl -sS -o /tmp/contact-bad.txt -w '%{http_code}\n' \
  -X POST 'https://alexendros.dev/api/contact' \
  -H 'Content-Type: application/json' \
  -d '{"name":"x"}'
# Esperado: 400 + {"error":"Invalid request"}

# Smoke válido (correo a operaciones@)
curl --fail-with-body -X POST 'https://alexendros.dev/api/contact' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Smoke Operativo","email":"operaciones@alexendros.dev","subject":"otro","message":"Prueba controlada posterior a configurar SMTP.","consent":true}'
# Esperado: HTTP 2xx + {"ok":true}; correo < 5 min
```

## Aceptación go-live

- [ ] 100% envíos válidos de la batería de prueba → 2xx + correo
- [ ] Inválidos → 4xx (no 500 de config)
- [ ] Abuso → 429
- [ ] 0 eventos `contact_smtp_misconfigured` en envío válido post-config
- [ ] Sin secretos en respuesta HTTP ni logs de cliente
