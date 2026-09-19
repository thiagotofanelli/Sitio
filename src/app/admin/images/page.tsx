import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ImagesManager } from '@/components/admin/images-manager';

export default async function AdminImagesPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  return <ImagesManager />;
}
