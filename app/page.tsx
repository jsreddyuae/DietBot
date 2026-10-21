'use client';

import { useMemo, useState } from 'react';
import { dailyMeals, vegetables, saladRecipes, recipes, shoppingGroups, type Recipe } from '@/lib/mealPlan';

type View = 'today' | 'plan' | 'salads' | 'workouts';

const navItems: {id:View; label:string; icon:string; note:string}[] = [
  {id:'today', label:'Today', icon:'⌂', note:"Today's meals"},
  {id:'plan', label:'Plan', icon:'▦', note:'7-day meal plan'},
  {id:'salads', label:'Salads', icon:'◉', note:'7 fresh recipes'},
  {id:'workouts', label:'Workouts', icon:'↗', note:'Chest · arms · abs'},
];

function Nutrition({r}:{r:Recipe}) {
  return <div className="nutrition">
    <span>🔥 {r.calories} kcal</span><span>💪 {r.protein}g P</span><span>◌ {r.carbs}g C</span><span>🥑 {r.fat}g F</span><span>🌿 {r.fiber}g fiber</span>
  </div>;
}

function MealCard({name, index, onOpen}:{name:string;index:number;onOpen:(r:Recipe)=>void}) {
  const recipe = recipes[index % recipes.length];
  const labels = ['BREAKFAST','MID-MORNING','LUNCH','SALAD','EVENING SNACK','DINNER'];
  const times = ['7:30 AM','11:00 AM','1:00 PM','4:00 PM','6:00 PM','8:00 PM'];
  return <button className="mealCard" onClick={()=>onOpen(recipe)}>
    <img src={recipe.image} alt="" />
    <div className="mealInfo">
      <div className="mealTop"><span className="mealLabel">{labels[index]}</span><span className="mealTime">{times[index]}</span></div>
      <h3>{name}</h3>
      <p>{recipe.ingredients.slice(0,3).join(' · ')}</p>
      <Nutrition r={recipe}/>
    </div>
    <span className="chevron">›</span>
  </button>;
}

function RecipeDetail({r,onBack}:{r:Recipe;onBack:()=>void}) {
  return <main className="detailPage">
    <button className="ghostBtn" onClick={onBack}>← Back</button>
    <div className="detailHero"><img src={r.image} alt={r.name}/><div className="detailBadge">Diabetes-friendly recipe</div></div>
    <div className="detailTitle"><div><span className="eyebrow">{r.category} · {r.time}</span><h1>{r.name}</h1></div><button className="roundBtn">♡</button></div>
    <Nutrition r={r}/>
    <div className="detailGrid"><section className="detailCard"><h2>Ingredients</h2><ul className="ingredients">{r.ingredients.map((x,i)=><li key={i}><b>✓</b>{x}</li>)}</ul></section>
    <section className="detailCard"><h2>How to prepare</h2><ol className="steps">{r.steps.map((x,i)=><li key={i}><b>{String(i+1).padStart(2,'0')}</b><span>{x}</span></li>)}</ol></section></div>
    {r.tip && <div className="tip"><b>💡 Chef's tip</b><p>{r.tip}</p></div>}
  </main>;
}

function PageHeader({eyebrow,title,description}:{eyebrow:string;title:string;description:string}) {
  return <div className="pageHeader"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div><div className="headerSpark">✦</div></div>;
}

function Today({onOpen, dayIndex, setDayIndex, setView}:{onOpen:(r:Recipe)=>void;dayIndex:number;setDayIndex:(i:number)=>void;setView:(v:View)=>void}) {
  const plan = dailyMeals[dayIndex];
  const labels = ['BREAKFAST','MID-MORNING','LUNCH','EVENING SNACK','DINNER'];
  const times = ['7:30 AM','10:30 AM','1:00 PM','4:30 PM','7:30 PM'];
  const detailRecipes = [recipes[0],recipes[1],recipes[2],recipes[5],recipes[3]];
  return <>
    <section className="heroBanner"><div className="heroCopy"><span className="eyebrow light">{plan.day.toUpperCase()} · YOUR DAILY PLAN</span><h1>Good morning,<br/><strong>Jaya Simha</strong> <span>🌿</span></h1><p>Your meal plan keeps one main cooked vegetable for lunch and dinner, with chicken breast at lunch, salmon at dinner and measured carbohydrate portions.</p><div className="heroActions"><button onClick={()=>setView('plan')}>Open 7-day plan →</button><span>● Plan ready</span></div></div><div className="heroStats"><div><small>HbA1c</small><strong>11.2%</strong><span>Latest report</span></div><div><small>Fasting glucose</small><strong>272</strong><span>mg/dL</span></div><div><small>Focus</small><strong>Control</strong><span>+ muscle support</span></div></div></section>
    <div className="sectionTabs">{dailyMeals.map((d,i)=><button key={d.day} className={dayIndex===i?'active':''} onClick={()=>setDayIndex(i)}>{d.day.slice(0,3)}</button>)}<span className="statusPill">♥ Diabetes focused</span></div>
    <section className="contentGrid"><div className="mainColumn"><div className="sectionTitle"><div><span className="eyebrow">MEAL TIMELINE</span><h2>{plan.day}'s meal plan</h2></div><span className="miniProgress">5 daily occasions</span></div><div className="mealList">{plan.meals.map((m,i)=><button className="mealCard" key={`${plan.day}-${i}`} onClick={()=>onOpen(detailRecipes[i])}><img src={detailRecipes[i].image} alt=""/><div className="mealInfo"><div className="mealTop"><span className="mealLabel">{labels[i]}</span><span className="mealTime">{times[i]}</span></div><h3>{m}</h3><p>{detailRecipes[i].ingredients.slice(0,3).join(' · ')}</p><Nutrition r={detailRecipes[i]}/></div><span className="chevron">›</span></button>)}</div></div><aside className="sideColumn"><ShoppingPreview onOpenPlan={()=>setView('plan')}/><ProgressPreview/><button className="greenBtn" onClick={()=>setView('workouts')}>Open chest, arms & abs workouts →</button></aside></section>
  </>;
}

function ShoppingPreview({onOpenPlan}:{onOpenPlan:()=>void}){return <div className="sideCard"><div className="cardHead"><div><span className="eyebrow">NEXT DAY</span><h3>Shopping essentials</h3></div><span className="tinyIcon">✓</span></div><p className="muted">Ingredients are prepared automatically for tomorrow.</p><ul className="checkList">{['Avocado — 70 g','Unsweetened soy milk — 200 ml','Salmon — 180 g','Barley — 90 g cooked','Bhendi — 150 g','Spinach — 100 g'].map(x=><li key={x}>✓ <span>{x}</span></li>)}</ul><button className="greenBtn" onClick={onOpenPlan}>Review weekly plan →</button></div>}
function ProgressPreview(){return <div className="sideCard"><div className="cardHead"><div><span className="eyebrow">THIS WEEK</span><h3>Progress snapshot</h3></div><span className="tinyIcon">↗</span></div><div className="metricRow"><div><b>5/6</b><span>Meals</span></div><div><b>118g</b><span>Protein</span></div><div><b>28g</b><span>Fiber</span></div></div>{[['Meals completed',78],['Protein target',92],['Water',83],['Fiber',80]].map(([x,v])=><div className="barItem" key={String(x)}><div><span>{x}</span><b>{v}%</b></div><i><em style={{width:`${v}%`}}/></i></div>)}</div>}

function WeeklyPlan({setView,setDayIndex}:{setView:(v:View)=>void;setDayIndex:(i:number)=>void}){return <section><PageHeader eyebrow="PLAN YOUR WEEK" title="Your complete 7-day plan" description="Select any day to open its meal timeline. The existing NutriPlan visual style and daily meal data are retained."/><div className="weekCards">{dailyMeals.map((d,i)=><button className="weekCard" key={d.day} onClick={()=>{setDayIndex(i);setView('today')}}><div className="dayNum">{String(i+1).padStart(2,'0')}</div><div><span>{d.day}</span><h3>{d.meals[0]}</h3><p>{d.meals[2]}</p><small>{d.meals[4]}</small></div><b>›</b></button>)}</div></section>}

function Workouts(){
 const sessions = [
  {day:'MONDAY',title:'Chest + triceps',focus:'Push strength',items:[['Incline push-ups','3 sets × 8–12 reps'],['Wall or knee push-ups','3 × 8–12'],['Dumbbell floor press (or incline push-up)','3 × 10'],['Overhead triceps extension (light weight)','2 × 10–12']]},
  {day:'TUESDAY',title:'Core / six-pack foundation',focus:'Core stability',items:[['Dead bug','3 × 8 each side'],['Bird dog','3 × 8 each side'],['Forearm plank (knees down if needed)','3 × 15–30 sec'],['Reverse crunch','2 × 8–12']]},
  {day:'THURSDAY',title:'Arms + shoulders',focus:'Biceps and triceps',items:[['Dumbbell biceps curl or band curl','3 × 10–12'],['Hammer curl','2 × 10–12'],['Seated shoulder press (light)','3 × 8–12'],['Triceps kickback or band press-down','2 × 10–12']]},
  {day:'SATURDAY',title:'Chest + core',focus:'Technique and consistency',items:[['Incline push-ups','3 × 8–12'],['Dumbbell floor press','3 × 10'],['Dead bug','3 × 8 each side'],['Side plank (knees bent if needed)','2 × 15–25 sec each side']]},
 ];
 return <section><PageHeader eyebrow="STRENGTH & FITNESS" title="Chest, arms & six-pack plan" description="Beginner-friendly home workouts to build strength and muscle alongside your nutrition plan. No gym is required; dumbbells or resistance bands are optional."/><div className="workoutNotice"><b>Start safely</b><span>Warm up for 5–7 minutes, rest 60–90 seconds between sets, and stop if you feel dizzy, chest pain, unusual breathlessness or unwell. Because your reported glucose has been high, check with your clinician about safe exercise thresholds before starting intense training.</span></div><div className="workoutGrid">{sessions.map(s=><article className="workoutCard" key={s.day}><div className="workoutTop"><span>{s.day}</span><b>{s.focus}</b></div><h2>{s.title}</h2><ul>{s.items.map(([name,reps])=><li key={name}><span className="workoutCheck">✓</span><div><strong>{name}</strong><small>{reps}</small></div></li>)}</ul></article>)}</div><div className="workoutFooter"><h3>Weekly rhythm</h3><p>Monday: chest/triceps · Tuesday: core · Wednesday: 20–30 min easy walk or rest · Thursday: arms/shoulders · Friday: easy walk · Saturday: chest/core · Sunday: recovery walk and mobility.</p><p><b>Progression:</b> when you can complete all reps with good form, add 1–2 reps or a little resistance—not both at once. Visible abs also depend on genetics, body-fat distribution, nutrition and time; ab exercises alone cannot spot-reduce belly fat.</p></div></section>
}

function Vegetables({setView}:{setView:(v:string)=>void}){return <section><PageHeader eyebrow="VEGETABLE LIBRARY" title="Eat the rainbow" description="Indian favourites and international vegetables chosen for variety, texture and everyday cooking."/><div className="categoryPills"><span className="active">All</span><span>Indian</span><span>Leafy greens</span><span>Other</span></div><div className="vegGrid">{vegetables.map(v=><button className="vegCard" key={v.name} onClick={()=>setView('recipes')}><img src={v.image} alt=""/><div><b>{v.name}</b><span>{v.local}</span></div></button>)}</div></section>}

function RecipeLibrary({setSelected}:{setSelected:(r:Recipe)=>void}){return <section><PageHeader eyebrow="RECIPE COLLECTION" title="Cook something you will love" description="Detailed ingredients, exact quantities and simple preparation steps for your weekly plan."/><div className="recipeGrid">{recipes.map(r=><button className="libraryCard" key={r.id} onClick={()=>setSelected(r)}><img src={r.image} alt=""/><div><span className="eyebrow">{r.category} · {r.time}</span><h3>{r.name}</h3><Nutrition r={r}/><span className="viewLink">View recipe →</span></div></button>)}</div></section>}

function Salads({setSelected}:{setSelected:(r:Recipe)=>void}){return <section><PageHeader eyebrow="FRESH SALAD BAR" title="7 salads, zero boredom" description="International-style salads with no added sugar or sweet dressings. Tap any card for the full recipe."/><div className="recipeGrid">{saladRecipes.map(r=><button className="libraryCard" key={r.id} onClick={()=>setSelected(r)}><img src={r.image} alt=""/><div><span className="eyebrow">SALAD · {r.time}</span><h3>{r.name}</h3><Nutrition r={r}/><span className="viewLink">View full recipe →</span></div></button>)}</div></section>}

function Shopping(){return <section><PageHeader eyebrow="SMART SHOPPING" title="Your weekly basket" description="A clean, category-based list built from the current 7-day meal plan."/><div className="shoppingGrid">{shoppingGroups.map(g=><div className="shopCard" key={g.title}><div className="shopIcon">{g.icon}</div><div><h3>{g.title}</h3><ul>{g.items.map(x=><li key={x}><span>□</span>{x}</li>)}</ul></div></div>)}</div></section>}

function Progress(){return <section><PageHeader eyebrow="HEALTH DASHBOARD" title="Progress you can see" description="Use this space to track meals, protein, fiber, water and glucose trends. Connect your own readings as the app evolves."/><div className="progressHero"><div><span className="eyebrow light">CURRENT FOCUS</span><h2>Build consistency first.</h2><p>Small daily wins are easier to maintain than extreme changes.</p></div><div className="ring"><strong>78%</strong><span>weekly goal</span></div></div><div className="statsGrid">{[['Meals','5 / 6','completed'],['Protein','118 g','of 120 g'],['Fiber','28 g','of 35 g'],['Water','2.5 L','of 3 L'],['Weight','68.5 kg','current'],['Glucose','—','add reading']].map(x=><div className="statCard" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><small>{x[2]}</small></div>)}</div></section>}

function Settings(){return <section><PageHeader eyebrow="PREFERENCES" title="Make NutriPlan yours" description="Your Telegram automation remains active in the background. The dashboard no longer needs a separate Telegram screen."/><div className="settingsGrid"><div className="settingCard"><span>👤</span><div><b>Profile</b><p>Personal details, goals and meal preferences.</p></div><button>›</button></div><div className="settingCard"><span>🎯</span><div><b>Nutrition targets</b><p>Calories, protein, carbohydrate and fiber targets.</p></div><button>›</button></div><div className="settingCard"><span>🔔</span><div><b>Reminders</b><p>Meal, water and shopping reminder preferences.</p></div><button>›</button></div><div className="settingCard"><span>◐</span><div><b>Appearance</b><p>Light, dark and system display options.</p></div><button>›</button></div></div><div className="automationNote"><b>✓ Telegram automation is active</b><p>Your scheduled next-day ingredient notification continues through Vercel Cron at 4:00 PM UAE time. No Telegram setup is needed here.</p></div></section>}

export default function Home(){
  const [view,setView]=useState<View>('today');
  const [selected,setSelected]=useState<Recipe|null>(null);
  const [dayIndex,setDayIndex]=useState(()=>{const d=new Date().getDay();return d===0?6:d-1;});
  const selectedOrBack=useMemo(()=>selected,[selected]);
  if(selectedOrBack) return <RecipeDetail r={selectedOrBack} onBack={()=>setSelected(null)}/>;
  const render=()=>{switch(view){case 'plan':return <WeeklyPlan setView={setView} setDayIndex={setDayIndex}/>;case 'salads':return <Salads setSelected={setSelected}/>;case 'workouts':return <Workouts/>;default:return <Today onOpen={setSelected} dayIndex={dayIndex} setDayIndex={setDayIndex} setView={setView}/>;}};
  return <main className="appShell">
    <aside className="sidebar"><div className="brandBlock"><div className="logoMark">✦</div><div><b>Nutri<span>Plan</span></b><small>Diabetes Meal Assistant</small></div></div><div className="profileMini"><div className="avatar">JS</div><div><b>Jaya Simha</b><span>Personal meal plan</span></div><span>›</span></div><div className="sideNav">{navItems.map(n=><button key={n.id} className={view===n.id?'active':''} onClick={()=>setView(n.id)}><i>{n.icon}</i><div><b>{n.label}</b><span>{n.note}</span></div><em>›</em></button>)}</div><div className="sideQuote">Better food.<br/><strong>Better glucose.</strong><br/>More energy. ♥</div><div className="sidebarFoot">NutriPlan v5 · Your daily companion</div></aside>
    <div className="workspace"><header className="mobileTop"><button className="mobileLogo" onClick={()=>setView('today')}>✦ <b>Nutri<span>Plan</span></b></button><span className="mobileCurrent">{navItems.find(n=>n.id===view)?.label}</span></header><div className="desktopTop"><div><span className="eyebrow">NUTRIPLAN · PERSONAL DASHBOARD</span><h2>Healthy meals. Better routines. More energy.</h2></div><div className="topActions"><span>● Plan synced</span><button>JS</button></div></div>{render()}</div>
    <nav className="bottomNav">{navItems.map(n=><button key={n.id} className={view===n.id?'active':''} onClick={()=>setView(n.id)}><i>{n.icon}</i><span>{n.label}</span></button>)}</nav>
  </main>;
}
