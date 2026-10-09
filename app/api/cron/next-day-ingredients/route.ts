import { dailyMeals } from '@/lib/mealPlan';

function dubaiDayIndex() {
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dubai', weekday: 'short' }).format(new Date());
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[weekday] ?? 1;
}

const ingredients: Record<string, string[]> = {
  Monday: ['Egg — 1','Avocado — 70 g','Chicken breast — 180 g','Quinoa, cooked — 90 g','Broccoli — 150 g','Cucumber — 100 g','Tomato — 80 g','Lettuce — 50 g','Strawberries — 150 g','Salmon — 180 g','Zucchini — 150 g','Spinach — 100 g'],
  Tuesday: ['Low-fat curd — 150 g','Mixed berries — 100 g','Salmon — 360 g','Whole green moong, cooked — 100 g','Greek salad vegetables — 330 g','Feta — 25 g','Apple — 120 g','Walnuts — 10 g','Cabbage — 120 g','Cucumber — 100 g','Spinach — 100 g'],
  Wednesday: ['Moong dal, dry — 40 g','Spinach — 50 g','Curd — 100 g','Chicken breast — 180 g','Brown/basmati rice, cooked — 80 g','Mexican salad vegetables — 300 g','Broccoli — 150 g','Pear — 120 g','Almonds — 10 g','Salmon — 180 g','Zucchini — 150 g'],
  Thursday: ['Besan — 40 g','Spinach/capsicum/tomato/onion — 150 g','Curd — 100 g','Chicken liver — 120 g','Karela — 150 g','Whole green moong, cooked — 70–80 g','Tomato — 50 g','Onion — 20 g','Spinach — 75 g','Kiwi — 100 g','Almonds — 10 g','Salmon — 180 g'],
  Friday: ['Egg — 1','Mushrooms — 80 g','Spinach — 50 g','Tomato — 50 g','Avocado — 50 g','Chicken breast — 180 g','Barley, cooked — 90 g','Lebanese salad vegetables/herbs — 300 g','Broccoli — 150 g','Apple — 120 g','Walnuts — 10 g','Salmon — 180 g','Cabbage — 120 g'],
  Saturday: ['Low-fat paneer — 100 g','Cucumber/tomato/spinach/mushrooms — 250 g','Avocado — 40 g','Chicken breast — 180 g','Barley, cooked — 90 g','Thai salad vegetables — 300 g','Orange — 130 g','Almonds — 10 g','Salmon — 180 g','Cauliflower — 150 g','Zucchini — 150 g'],
  Sunday: ['Egg — 1','Avocado — 50 g','Mushrooms — 80 g','Spinach — 50 g','Salmon — 180 g','Buckwheat, cooked — 90 g','Mediterranean salad vegetables — 300 g','Strawberries — 150 g','Almonds — 10 g','Salmon — 180 g','Broccoli — 150 g','Zucchini — 150 g']
};

function ingredientMessage() {
  const tomorrow = dailyMeals[(dubaiDayIndex() + 1) % 7];
  const items = ingredients[tomorrow.day] ?? [];
  return `🛒 NutriPlan — ${tomorrow.day} ingredients\n\n${items.map(x => `• ${x}`).join('\n')}\n\n⏰ Shopping reminder: 4:00 PM UAE time\n🥗 Open NutriPlan for recipes and preparation steps.`;
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const supplied = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (secret && supplied !== secret) return new Response('Unauthorized', { status: 401 });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return Response.json({ ok: false, error: 'Telegram environment variables are missing' }, { status: 400 });

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: ingredientMessage() })
    });
    const data = await r.json();
    return Response.json({ ok: r.ok && data.ok, telegram: data }, { status: r.ok && data.ok ? 200 : 500 });
  } catch {
    return Response.json({ ok: false, error: 'Unable to reach Telegram API' }, { status: 502 });
  }
}
