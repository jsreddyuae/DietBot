'use client';

import { useMemo, useState } from 'react';
import { dailyMeals, vegetables, saladRecipes, recipes, shoppingGroups, type Recipe } from '@/lib/mealPlan';

type View = 'today' | 'plan' | 'vegetables' | 'salads' | 'recipes' | 'shopping' | 'progress' | 'settings';

const navItems: {id:View; label:string; icon:string; note:string}[] = [
  {id:'today', label:'Today', icon:'⌂', note:"Today's plan"},
  {id:'plan', label:'Weekly Plan', icon:'▦', note:'7-day nutrition'},
  {id:'vegetables', label:'Vegetables', icon:'✦', note:'Indian + global'},
  {id:'salads', label:'Salads', icon:'◉', note:'7 fresh recipes'},
  {id:'recipes', label:'Recipes', icon:'◇', note:'Cook with confidence'},
  {id:'shopping', label:'Shopping', icon:'▣', note:'Auto-generated'},
  {id:'progress', label:'Progress', icon:'↗', note:'Health tracking'},
  {id:'settings', label:'Settings', icon:'⚙', note:'Preferences'},
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

function Today({onOpen}:{onOpen:(r:Recipe)=>void}) {
  const dayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay()-1;
  const plan = dailyMeals[dayIndex];
  return <>
    <section className="heroBanner"><div className="heroCopy"><span className="eyebrow light">TODAY · {new Date().toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})}</span><h1>Good morning,<br/><strong>Jaya Simha</strong> <span>🌿</span></h1><p>Healthy choices today build a stronger tomorrow. Your plan is balanced around protein, vegetables and controlled carbohydrates.</p><div className="heroActions"><button onClick={()=>onOpen(recipes[0])}>Explore today's meals →</button><span>● Plan ready</span></div></div><div className="heroStats"><div><small>HbA1c</small><strong>11.2%</strong><span>Latest report</span></div><div><small>Fasting glucose</small><strong>272</strong><span>mg/dL</span></div><div><small>Focus</small><strong>Control</strong><span>+ muscle support</span></div></div></section>
    <div className="sectionTabs"><span className="active">Today</span><span>Tomorrow</span><span>This week</span><span className="statusPill">♥ Diabetes focused</span></div>
    <section className="contentGrid"><div className="mainColumn"><div className="sectionTitle"><div><span className="eyebrow">MEAL TIMELINE</span><h2>Today's meal plan</h2></div><span className="miniProgress">5 meals · 1,750 kcal target</span></div><div className="mealList">{plan.meals.map((m,i)=><MealCard key={i} name={m} index={i} onOpen={onOpen}/>)}</div></div>
      <aside className="sideColumn"><ShoppingPreview/><ProgressPreview/></aside></section>
  </>;
}

function ShoppingPreview(){return <div className="sideCard"><div className="cardHead"><div><span className="eyebrow">NEXT DAY</span><h3>Shopping essentials</h3></div><span className="tinyIcon">✓</span></div><p className="muted">Ingredients are prepared automatically for tomorrow.</p><ul className="checkList">{['Avocado — 70 g','Unsweetened soy milk — 200 ml','Salmon — 180 g','Barley — 90 g cooked','Bhendi — 150 g','Spinach — 100 g'].map(x=><li key={x}>✓ <span>{x}</span></li>)}</ul><button className="greenBtn">View shopping list →</button></div>}
function ProgressPreview(){return <div className="sideCard"><div className="cardHead"><div><span className="eyebrow">THIS WEEK</span><h3>Progress snapshot</h3></div><span className="tinyIcon">↗</span></div><div className="metricRow"><div><b>5/6</b><span>Meals</span></div><div><b>118g</b><span>Protein</span></div><div><b>28g</b><span>Fiber</span></div></div>{[['Meals completed',78],['Protein target',92],['Water',83],['Fiber',80]].map(([x,v])=><div className="barItem" key={String(x)}><div><span>{x}</span><b>{v}%</b></div><i><em style={{width:`${v}%`}}/></i></div>)}</div>}

function WeeklyPlan({setView}:{setView:(v:View)=>void}){return <section><PageHeader eyebrow="PLAN YOUR WEEK" title="A complete 7-day rhythm" description="Simple meals, familiar ingredients and controlled carbohydrate portions—without repeating the same breakfast every day."/><div className="weekCards">{dailyMeals.map((d,i)=><button className="weekCard" key={d.day} onClick={()=>setView('today')}><div className="dayNum">{String(i+1).padStart(2,'0')}</div><div><span>{d.day}</span><h3>{d.meals[0]}</h3><p>{d.meals[2]}</p><small>{d.meals[4]}</small></div><b>›</b></button>)}</div></section>}

function Vegetables({setView}:{setView:(v:View)=>void}){return <section><PageHeader eyebrow="VEGETABLE LIBRARY" title="Eat the rainbow" description="Indian favourites and international vegetables chosen for variety, texture and everyday cooking."/><div className="categoryPills"><span className="active">All</span><span>Indian</span><span>Leafy greens</span><span>Other</span></div><div className="vegGrid">{vegetables.map(v=><button className="vegCard" key={v.name} onClick={()=>setView('recipes')}><img src={v.image} alt=""/><div><b>{v.name}</b><span>{v.local}</span></div></button>)}</div></section>}

function RecipeLibrary({setSelected}:{setSelected:(r:Recipe)=>void}){return <section><PageHeader eyebrow="RECIPE COLLECTION" title="Cook something you will love" description="Detailed ingredients, exact quantities and simple preparation steps for your weekly plan."/><div className="recipeGrid">{recipes.map(r=><button className="libraryCard" key={r.id} onClick={()=>setSelected(r)}><img src={r.image} alt=""/><div><span className="eyebrow">{r.category} · {r.time}</span><h3>{r.name}</h3><Nutrition r={r}/><span className="viewLink">View recipe →</span></div></button>)}</div></section>}

function Salads({setSelected}:{setSelected:(r:Recipe)=>void}){return <section><PageHeader eyebrow="FRESH SALAD BAR" title="7 salads, zero boredom" description="International-style salads with no added sugar or sweet dressings. Tap any card for the full recipe."/><div className="recipeGrid">{saladRecipes.map(r=><button className="libraryCard" key={r.id} onClick={()=>setSelected(r)}><img src={r.image} alt=""/><div><span className="eyebrow">SALAD · {r.time}</span><h3>{r.name}</h3><Nutrition r={r}/><span className="viewLink">View full recipe →</span></div></button>)}</div></section>}

function Shopping(){return <section><PageHeader eyebrow="SMART SHOPPING" title="Your weekly basket" description="A clean, category-based list built from the current 7-day meal plan."/><div className="shoppingGrid">{shoppingGroups.map(g=><div className="shopCard" key={g.title}><div className="shopIcon">{g.icon}</div><div><h3>{g.title}</h3><ul>{g.items.map(x=><li key={x}><span>□</span>{x}</li>)}</ul></div></div>)}</div></section>}

function Progress(){return <section><PageHeader eyebrow="HEALTH DASHBOARD" title="Progress you can see" description="Use this space to track meals, protein, fiber, water and glucose trends. Connect your own readings as the app evolves."/><div className="progressHero"><div><span className="eyebrow light">CURRENT FOCUS</span><h2>Build consistency first.</h2><p>Small daily wins are easier to maintain than extreme changes.</p></div><div className="ring"><strong>78%</strong><span>weekly goal</span></div></div><div className="statsGrid">{[['Meals','5 / 6','completed'],['Protein','118 g','of 120 g'],['Fiber','28 g','of 35 g'],['Water','2.5 L','of 3 L'],['Weight','68.5 kg','current'],['Glucose','—','add reading']].map(x=><div className="statCard" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><small>{x[2]}</small></div>)}</div></section>}

function Settings(){return <section><PageHeader eyebrow="PREFERENCES" title="Make NutriPlan yours" description="Your Telegram automation remains active in the background. The dashboard no longer needs a separate Telegram screen."/><div className="settingsGrid"><div className="settingCard"><span>👤</span><div><b>Profile</b><p>Personal details, goals and meal preferences.</p></div><button>›</button></div><div className="settingCard"><span>🎯</span><div><b>Nutrition targets</b><p>Calories, protein, carbohydrate and fiber targets.</p></div><button>›</button></div><div className="settingCard"><span>🔔</span><div><b>Reminders</b><p>Meal, water and shopping reminder preferences.</p></div><button>›</button></div><div className="settingCard"><span>◐</span><div><b>Appearance</b><p>Light, dark and system display options.</p></div><button>›</button></div></div><div className="automationNote"><b>✓ Telegram automation is active</b><p>Your scheduled next-day ingredient notification continues through Vercel Cron at 4:00 PM UAE time. No Telegram setup is needed here.</p></div></section>}

export default function Home(){
  const [view,setView]=useState<View>('today');
  const [selected,setSelected]=useState<Recipe|null>(null);
  const selectedOrBack=useMemo(()=>selected,[selected]);
  if(selectedOrBack) return <RecipeDetail r={selectedOrBack} onBack={()=>setSelected(null)}/>;
  const render=()=>{switch(view){case 'plan':return <WeeklyPlan setView={setView}/>;case 'vegetables':return <Vegetables setView={setView}/>;case 'salads':return <Salads setSelected={setSelected}/>;case 'recipes':return <RecipeLibrary setSelected={setSelected}/>;case 'shopping':return <Shopping/>;case 'progress':return <Progress/>;case 'settings':return <Settings/>;default:return <Today onOpen={setSelected}/>;}};
  return <main className="appShell">
    <aside className="sidebar"><div className="brandBlock"><div className="logoMark">✦</div><div><b>Nutri<span>Plan</span></b><small>Diabetes Meal Assistant</small></div></div><div className="profileMini"><div className="avatar">JS</div><div><b>Jaya Simha</b><span>Personal meal plan</span></div><span>›</span></div><div className="sideNav">{navItems.map(n=><button key={n.id} className={view===n.id?'active':''} onClick={()=>setView(n.id)}><i>{n.icon}</i><div><b>{n.label}</b><span>{n.note}</span></div><em>›</em></button>)}</div><div className="sideQuote">Better food.<br/><strong>Better glucose.</strong><br/>More energy. ♥</div><div className="sidebarFoot">NutriPlan v4 · Your daily companion</div></aside>
    <div className="workspace"><header className="mobileTop"><button className="mobileLogo" onClick={()=>setView('today')}>✦ <b>Nutri<span>Plan</span></b></button><button className="roundBtn">☼</button></header><div className="desktopTop"><div><span className="eyebrow">NUTRIPLAN · PERSONAL DASHBOARD</span><h2>Healthy meals. Better routines. More energy.</h2></div><div className="topActions"><span>● Plan synced</span><button>JS</button></div></div>{render()}</div>
    <nav className="bottomNav">{navItems.slice(0,5).map(n=><button key={n.id} className={view===n.id?'active':''} onClick={()=>setView(n.id)}><i>{n.icon}</i><span>{n.label==='Weekly Plan'?'Plan':n.label}</span></button>)}</nav>
  </main>;
}
