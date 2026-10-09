# NutriPlan — Diabetes Meal Assistant v5 UI

Professional responsive dashboard for the existing NutriPlan Vercel deployment.

## What changed
- Rebuilt the UI around a premium green neo-glass dashboard inspired by the supplied reference.
- Added desktop sidebar navigation and a compact Android-first bottom navigation.
- Added working Today, Weekly Plan, Vegetables, Salads, Recipes, Shopping, Progress and Settings views.
- Added clickable recipe details with ingredients and preparation steps.
- Removed Telegram from the visible navigation/UI because Telegram automation is already integrated.
- Preserved the Telegram API routes and existing Vercel Cron job.
- Updated the Cron ingredient data to match the current meal plan: salmon only for fish, no tuna/white fish/sweet potato, and chicken liver kept separate from chicken.
- Kept the Vercel Cron schedule at `0 12 * * *` (12:00 UTC / 4:00 PM UAE).
- Updated the mobile layout for touch targets, compact cards, readable typography and bottom navigation.

## Deployment
Replace the project files in the existing GitHub repository and let the existing Vercel production deployment build the commit.

Keep the existing environment variables:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `CRON_SECRET`
- `APP_TIMEZONE=Asia/Dubai`

Do not create a second Vercel project or a second Cron job.
