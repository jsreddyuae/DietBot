async function send(){
 const token=process.env.TELEGRAM_BOT_TOKEN; const chat=process.env.TELEGRAM_CHAT_ID;
 if(!token||!chat) return Response.json({ok:false,error:'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID'},{status:400});
 try{
  const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chat,text:'🥗 NutriPlan test message\n\nTelegram is connected successfully.\n\nNext-day shopping reminders are configured for 4:00 PM UAE time.'})});
  const data=await r.json();
  return Response.json({ok:r.ok&&data.ok,telegram:data,error:data.ok?undefined:data.description},{status:r.ok&&data.ok?200:500});
 }catch(e){return Response.json({ok:false,error:'Unable to reach Telegram API'},{status:502});}
}
export async function GET(){return send()}
export async function POST(){return send()}
