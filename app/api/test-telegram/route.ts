export async function POST(){
 const token=process.env.TELEGRAM_BOT_TOKEN; const chat=process.env.TELEGRAM_CHAT_ID;
 if(!token||!chat) return Response.json({ok:false,error:'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID'}, {status:400});
 const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chat,text:'🥗 NutriPlan test message — Telegram is connected successfully.'})});
 const data=await r.json(); return Response.json(data,{status:r.ok?200:500});
}
