import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans">
      <AdminSidebar />
      <main className="md:ml-64 p-6 md:p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
