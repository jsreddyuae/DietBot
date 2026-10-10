import {dailyMeals,getShoppingDepartments} from '@/lib/mealPlan';
function getDubaiWeekday(){return new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'long'}).format(new Date())}
function tomorrowName(){const days=dailyMeals.map(d=>d.day);return days[(days.indexOf(getDubaiWeekday())+1)%7]}
export async function GET(req:Request){
 const secret=process.env.CRON_SECRET;const supplied=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
 if(secret&&supplied!==secret)return new Response('Unauthorized',{status:401});
 const token=process.env.TELEGRAM_BOT_TOKEN;const chat=process.env.TELEGRAM_CHAT_ID;
 if(!token||!chat)return Response.json({ok:false,error:'Telegram environment variables are missing'},{status:400});
 const day=tomorrowName();const groups=getShoppingDepartments(day);const message=`🛒 NutriPlan — ${day} shopping list\n\n${groups.map(g=>`${g.title}\n${g.items.map(x=>`• ${x}`).join('\n')}`).join('\n\n')}\n\n⏰ Shopping reminder: 4:00 PM UAE time\n🥗 Open NutriPlan for meal recipes.`;
 try{const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chat,text:message})});const data=await r.json();return Response.json({ok:r.ok&&data.ok,day,telegram:data},{status:r.ok&&data.ok?200:500})}catch{return Response.json({ok:false,error:'Unable to reach Telegram API'},{status:502})}
}
