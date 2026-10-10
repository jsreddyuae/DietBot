# NutriPlan / DietBot — updated existing Vercel project

This update is intended for the existing `jsreddyuae/DietBot` GitHub repository. It does not create a new Vercel project and preserves the existing single daily Vercel Cron (`0 12 * * *`, 4 PM UAE time).

## Updates in this version
- Larger typography and more comfortable touch targets.
- Working Today, Tomorrow and This week controls.
- Weekly day cards open that selected day's meals instead of returning to Home.
- Meal cards open ingredients and preparation steps directly.
- A searchable All recipes screen; no separate Salads screen or salad navigation item.
- Six-pack/core workout schedule replaces the old Salads menu item.
- Shopping ingredients are grouped by supermarket department.
- Existing 4 PM UAE Telegram cron now sends the next-day list by department.
- Telegram screen has a button to send the next-day grouped shopping list immediately.
- Existing Telegram discovery/status/test routes and environment variable names are retained.

## Deploy to the existing project
1. Download and extract the ZIP.
2. Copy the files into your existing `jsreddyuae/DietBot` repository, preserving `.env` values in Vercel (do not upload secrets).
3. Commit and push to the same branch connected to the existing Vercel project.
4. Vercel should redeploy automatically. Do not create a new Vercel project or add a second Cron.
5. Confirm these Vercel environment variables remain configured: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`; `CRON_SECRET` is optional if your current Cron configuration uses it.

## Telegram
The existing Cron remains configured in `vercel.json` at `/api/cron/next-day-ingredients`, schedule `0 12 * * *` (12:00 UTC = 4:00 PM UAE time). The new `/api/telegram/shopping-list` POST endpoint sends tomorrow's list when you press the button in the app.

## Health and exercise note
Workout content is general beginner guidance, not medical clearance. The plan should be reviewed with a clinician because the user has previously reported markedly elevated glucose and takes dapagliflozin (Forxiga). Do not use a ketogenic diet; stop and seek urgent assessment for possible ketoacidosis symptoms such as nausea/vomiting, abdominal pain, deep/rapid breathing or severe weakness.

## Validation
The source files were updated and checked for TypeScript syntax diagnostics. A full Next.js production build could not be run in this environment because dependencies could not be installed during the available build window; run `npm install` and `npm run build` before merging if possible.
