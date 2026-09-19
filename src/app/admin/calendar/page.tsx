import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CalendarManager } from '@/components/admin/calendar-manager';

export default async function AdminCalendarPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  
  return <CalendarManager />;
}
