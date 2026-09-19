import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PricingEditor } from '@/components/admin/pricing-editor';

export default async function AdminPricingPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  
  return <PricingEditor />;
}
