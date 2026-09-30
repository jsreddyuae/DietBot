export async function GET(req:Request){
 const secret=process.env.CRON_SECRET; const supplied=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
 if(secret && supplied!==secret) return new Response('Unauthorized',{status:401});
 const token=process.env.TELEGRAM_BOT_TOKEN; const chat=process.env.TELEGRAM_CHAT_ID;
 if(!token||!chat) return Response.json({ok:false,error:'Telegram environment variables are missing'},{status:400});
 const text='🛒 NutriPlan — tomorrow\'s ingredients\n\nPlease check the Shopping screen for the full ingredient list and quantities.\n\n⏰ Scheduled for 4:00 PM UAE time.';
 const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chat,text})});
 return Response.json(await r.json(),{status:r.ok?200:500});
}
