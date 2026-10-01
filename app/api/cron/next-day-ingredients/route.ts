import {dailyMeals} from '@/lib/mealPlan';

function tomorrowIndex(){
  const now=new Date();
  const dubai=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short'}).format(now);
  const map:any={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  return (map[dubai]+1)%7;
}

function ingredientMessage(){
  const idx=tomorrowIndex();
  const plans: Array<[string, string[]]>=[
    ['Monday',['Egg — 1','Avocado — 70 g','Chicken breast — 180 g','Quinoa, cooked — 90 g','Broccoli — 150 g','Cucumber — 100 g','Tomato — 80 g','Lettuce — 50 g','Strawberries — 150 g','Salmon — 180 g','Zucchini — 150 g','Spinach — 80 g','Buttermilk — 200 ml']],
    ['Tuesday',['Low-fat curd — 150 g','Mixed berries — 100 g','Salmon — 180 g','Lentils, cooked — 100 g','Greek salad vegetables — 330 g','Feta — 25 g','Buttermilk — 200 ml','Apple — 120 g','Walnuts — 10 g','White fish — 180 g','Cabbage — 120 g','Mushrooms — 100 g']],
    ['Wednesday',['Moong dal, dry — 40 g','Spinach — 40 g','Curd — 100 g','Chicken breast — 180 g','Brown/basmati rice, cooked — 80 g','Mexican salad vegetables — 300 g','Broccoli — 150 g','Pear — 120 g','Almonds — 10 g','Salmon — 180 g','Zucchini — 150 g','Buttermilk — 200 ml']],
    ['Thursday',['Besan — 40 g','Spinach/capsicum/tomato/onion — 150 g','Curd — 100 g','Chicken liver — 90 g','Chicken breast — 80 g','Chickpeas, cooked — 70 g','Turkish salad vegetables — 300 g','Broccoli — 150 g','Kiwi — 100 g','Almonds — 10 g','Salmon — 180 g','Cauliflower — 150 g','Buttermilk — 200 ml']],
    ['Friday',['Egg — 1','Mushrooms — 80 g','Spinach — 50 g','Tomato — 50 g','Avocado — 50 g','Chicken breast — 180 g','Barley, cooked — 90 g','Lebanese salad vegetables/herbs — 300 g','Broccoli — 150 g','Apple — 120 g','Walnuts — 10 g','Salmon — 180 g','Cabbage — 120 g','Buttermilk — 200 ml']],
    ['Saturday',['Low-fat paneer — 100 g','Cucumber/tomato/spinach/mushrooms — 250 g','Avocado — 40 g','Chicken breast — 180 g','Sweet potato, cooked — 100 g','Thai salad vegetables — 300 g','Orange — 130 g','Almonds — 10 g','Chicken — 180 g','Cauliflower — 150 g','Zucchini — 150 g','Buttermilk — 200 ml']],
    ['Sunday',['Egg — 1','Avocado — 50 g','Mushrooms — 80 g','Spinach — 50 g','Tuna in water, drained — 120 g','Chicken breast — 100 g','Buckwheat, cooked — 90 g','Mediterranean salad vegetables — 300 g','Strawberries — 150 g','Almonds — 10 g','White fish — 180 g','Broccoli — 150 g','Zucchini — 150 g','Buttermilk — 200 ml']]
  ];
  const [day,items]=plans[idx];
  return `🛒 NutriPlan — ${day} ingredients\n\n${items.map(x=>`• ${x}`).join('\n')}\n\n⏰ Shopping reminder: 4:00 PM UAE time\n🥗 Open NutriPlan for recipes and preparation steps.`;
}

export async function GET(req:Request){
 const secret=process.env.CRON_SECRET; const supplied=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
 if(secret && supplied!==secret) return new Response('Unauthorized',{status:401});
 const token=process.env.TELEGRAM_BOT_TOKEN; const chat=process.env.TELEGRAM_CHAT_ID;
 if(!token||!chat) return Response.json({ok:false,error:'Telegram environment variables are missing'},{status:400});
 try{
  const text=ingredientMessage();
  const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chat,text})});
  const data=await r.json();
  return Response.json({ok:r.ok&&data.ok,telegram:data},{status:r.ok&&data.ok?200:500});
 }catch(e){return Response.json({ok:false,error:'Unable to reach Telegram API'},{status:502});}
}
