# NutriPlan v3 — Salad Edition

Vercel-ready Next.js meal assistant. This version adds a dedicated **Salads** menu and detailed salad recipes with exact ingredients, quantities, nutrition and step-by-step preparation.

## Included
- Today meal timeline
- Dedicated Salads menu
- 7 detailed salad recipes: Mediterranean, Greek, Mexican, Turkish, Lebanese, Thai-style and Mediterranean Tuna
- Search salads
- Full recipe detail pages
- Ingredients and preparation steps
- Nutrition badges
- Shopping screen
- Telegram test endpoint
- Telegram next-day ingredient cron endpoint
- `CRON_SECRET` protection when configured
- Asia/Dubai schedule in Vercel cron

## Deploy without local setup
1. Upload these files to your GitHub `DietBot` repository.
2. Make sure the root contains `package.json`.
3. In Vercel, import/redeploy the `main` branch.
4. Add Production environment variables: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `CRON_SECRET`, `APP_TIMEZONE=Asia/Dubai`.

## Important
This release intentionally uses Next.js **15.5.26 (Maintenance LTS backport)** rather than the vulnerable 15.5.4. On September 30, 2026, Next.js also released 16.3.7 as the current latest overall release. The 15.5.26 line is retained here to minimize compatibility changes for the existing DietBot codebase.
