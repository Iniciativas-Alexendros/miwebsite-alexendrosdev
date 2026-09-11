# Redeploy note — Cal webhook Production envs

Ops trigger (2026-09-11): force Production rebuild so `CAL_WEBHOOK_SECRET`, `NOTION_TOKEN`, and `NOTION_LEADS_DATABASE_ID` are present at runtime.

Preview smoke already returned `200` and wrote Notion lead `smoke-d11eaf5b0d4a`. Production previously logged `cal_webhook_secret_misconfigured`.
