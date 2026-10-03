export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return Response.json(
      { ok: false, error: 'TELEGRAM_BOT_TOKEN is missing' },
      { status: 400 }
    );
  }

  try {
    const r = await fetch(
      `https://api.telegram.org/bot${token}/getUpdates?limit=20&allowed_updates=%5B%22message%22%5D`,
      { cache: 'no-store' }
    );
    const data = await r.json();

    if (!r.ok || !data.ok) {
      return Response.json(
        { ok: false, error: data.description || 'Telegram getUpdates failed' },
        { status: 400 }
      );
    }

    const chats = (data.result || [])
      .map((u: any) => u.message?.chat)
      .filter(Boolean)
      .map((c: any) => ({
        id: String(c.id),
        type: c.type,
        title: c.title || c.username || c.first_name || 'Telegram chat'
      }));

    // Avoid Map iterators entirely so this route also builds with older TS targets.
    const unique: any[] = [];
    const seen: Record<string, boolean> = {};
    for (let i = 0; i < chats.length; i++) {
      const chat = chats[i];
      if (!seen[chat.id]) {
        seen[chat.id] = true;
        unique.push(chat);
      }
    }

    return Response.json({
      ok: true,
      chats: unique,
      tip: unique.length
        ? 'Copy the chat ID into TELEGRAM_CHAT_ID in Vercel, then redeploy.'
        : 'Send /start to your bot in Telegram first, then run this again.'
    });
  } catch (e) {
    return Response.json(
      { ok: false, error: 'Unable to reach Telegram API' },
      { status: 502 }
    );
  }
}
