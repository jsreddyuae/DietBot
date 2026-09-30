import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NutriPlan — Diabetes Meal Assistant',
  description: '7-day meal plan, detailed recipes, salads, shopping list and Telegram reminders.'
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}
