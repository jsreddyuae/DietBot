import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'NutriPlan — Diabetes Meal Assistant', description: 'Personalized weekly meals, complete recipes, workouts, shopping list and reminders.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
