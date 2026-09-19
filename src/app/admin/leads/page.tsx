import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LeadsManager } from '@/components/admin/leads-manager';

export default async function AdminLeadsPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  
  return <LeadsManager />;
}
