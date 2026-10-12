import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NutriPlan V5 — Diabetes Meal Assistant',
  description: 'NutriPlan V5: a polished diabetes meal planning dashboard with weekly meals, recipes, shopping and health tracking.'
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}
