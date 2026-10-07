import { weeklyIngredients } from '@/lib/mealPlan';

function getDubaiWeekday(){
  return new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'long'}).format(new Date());
}

function tomorrowName(){
  const names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today=getDubaiWeekday();
  return names[(names.indexOf(today)+1)%7];
}

function ingredientMessage(){
  const day=tomorrowName();
  const items=weeklyIngredients[day] ?? [];
  return `🛒 NutriPlan — ${day} ingredients\n\n${items.map(x=>`• ${x}`).join('\n')}\n\n⏰ Shopping reminder: 4:00 PM UAE time\n🥗 Open NutriPlan for recipes and preparation steps.`;
}

export async function GET(req:Request){
  const secret=process.env.CRON_SECRET;
  const supplied=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
  if(secret && supplied!==secret) return new Response('Unauthorized',{status:401});

  const token=process.env.TELEGRAM_BOT_TOKEN;
  const chat=process.env.TELEGRAM_CHAT_ID;
  if(!token||!chat) return Response.json({ok:false,error:'Telegram environment variables are missing'},{status:400});

  try{
    const day=tomorrowName();
    const message=ingredientMessage();
    const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
      method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({chat_id:chat,text:message})
    });
    const data=await r.json();
    return Response.json({ok:r.ok&&data.ok,day,telegram:data},{status:r.ok&&data.ok?200:500});
  }catch(e){
    return Response.json({ok:false,error:'Unable to reach Telegram API'},{status:502});
  }
}
