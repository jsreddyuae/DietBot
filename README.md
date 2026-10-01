# NutriPlan v4 — Weekly Plan + Telegram Diagnostics

Vercel-ready Next.js meal assistant. V4 keeps the Salad Library and adds a weekly-plan view plus a Telegram setup/diagnostic flow.

## Telegram setup
1. Create/open your Telegram bot and send `/start` to it.
2. In NutriPlan open **Telegram** → **Discover chat ID**.
3. Copy the returned chat ID into Vercel → Project → Settings → Environment Variables as `TELEGRAM_CHAT_ID`.
4. Confirm `TELEGRAM_BOT_TOKEN` is correct and add a random `CRON_SECRET`.
5. Redeploy the project after changing environment variables.
6. Open **Telegram** → **Check Telegram**. It should show `botValid: true` and `chatValid: true`.
7. Press **Send test message**. The message should arrive immediately.

## Daily reminder
`vercel.json` runs the next-day ingredient endpoint at `12:00 UTC`, which is `4:00 PM` in UAE (UTC+4). The route sends the actual next-day ingredient list, not only a generic reminder.

Vercel sends the configured `CRON_SECRET` as a Bearer authorization header to cron invocations. The endpoint verifies it when `CRON_SECRET` is configured.

## Deploy
Upload the contents of this folder to the root of the GitHub repository. Add the four environment variables in Vercel. Do not commit real Telegram tokens or secrets.
