export async function GET(){
  const token=process.env.TELEGRAM_BOT_TOKEN;
  const chat=process.env.TELEGRAM_CHAT_ID;
  if(!token) return Response.json({ok:false,configured:false,error:'TELEGRAM_BOT_TOKEN is missing'},{status:400});
  try{
    const me=await fetch(`https://api.telegram.org/bot${token}/getMe`,{cache:'no-store'});
    const meData=await me.json();
    if(!me.ok || !meData.ok) return Response.json({ok:false,configured:true,botValid:false,error:meData.description||'Telegram bot token is invalid'},{status:400});
    let chatValid=false, chatError='';
    if(chat){const c=await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${encodeURIComponent(chat)}`,{cache:'no-store'});const cData=await c.json();chatValid=c.ok&&cData.ok;if(!chatValid) chatError=cData.description||'Chat ID could not be verified';}
    return Response.json({ok:true,configured:true,botValid:true,bot:{username:meData.result?.username,firstName:meData.result?.first_name},chatConfigured:Boolean(chat),chatValid,chatError});
  }catch(e){return Response.json({ok:false,error:'Unable to reach Telegram API'},{status:502});}
}
