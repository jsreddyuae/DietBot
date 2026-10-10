import {dailyMeals,getShoppingDepartments} from '@/lib/mealPlan';
function dubaiWeekday(){return new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'long'}).format(new Date())}
function tomorrowName(){const days=dailyMeals.map(d=>d.day);return days[(days.indexOf(dubaiWeekday())+1)%7]}
export async function POST(){
 const token=process.env.TELEGRAM_BOT_TOKEN;const chat=process.env.TELEGRAM_CHAT_ID;
 if(!token||!chat)return Response.json({ok:false,error:'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID'},{status:400});
 const day=tomorrowName();const groups=getShoppingDepartments(day);
 const message=`🛒 NutriPlan — ${day} shopping list\n\n${groups.map(g=>`${g.title}\n${g.items.map(i=>`• ${i}`).join('\n')}`).join('\n\n')}\n\n⏰ Reminder: 4:00 PM UAE time`;
 try{const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chat,text:message})});const data=await r.json();return Response.json({ok:r.ok&&data.ok,day,departments:groups.map(g=>g.title),error:data.ok?undefined:data.description},{status:r.ok&&data.ok?200:500})}catch{return Response.json({ok:false,error:'Unable to reach Telegram API'},{status:502})}
}
