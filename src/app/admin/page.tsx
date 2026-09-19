import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Users, CalendarDays, CheckCircle, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let totalLeads = 0;
  let leadsThisMonth = 0;
  let bookedLeads = 0;
  let nextBlock: any = null;
  let recentLeads: any[] = [];

  try {
    const results = await Promise.all([
      prisma.bookingInquiry.count(),
      prisma.bookingInquiry.count({
        where: {
          createdAt: {
            gte: startOfMonth
          }
        }
      }),
      prisma.bookingInquiry.count({
        where: {
          status: 'BOOKED'
        }
      }),
      prisma.blockedDate.findFirst({
        where: {
          startDate: {
            gte: now
          }
        },
        orderBy: {
          startDate: 'asc'
        }
      }),
      prisma.bookingInquiry.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    totalLeads = results[0];
    leadsThisMonth = results[1];
    bookedLeads = results[2];
    nextBlock = results[3];
    recentLeads = results[4];
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }

  const stats = [
    {
      title: 'Total de Leads',
      value: totalLeads,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Leads este Mês',
      value: leadsThisMonth,
      icon: CalendarDays,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Reservas Confirmadas',
      value: bookedLeads,
      icon: CheckCircle,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Próxima Data Bloqueada',
      value: nextBlock ? format(nextBlock.startDate, 'dd/MM/yyyy') : 'Nenhuma',
      icon: Calendar,
      color: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1F2937] flex items-center gap-2">
          Bem-vindo, Admin 👋
        </h1>
        <p className="text-[#D4A373] mt-1">Resumo das suas atividades recentes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border-[#E9ECEF] shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-[#1F2937]">{stat.value}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link 
          href="/admin/images" 
          className="p-4 rounded-2xl bg-white border border-[#E9ECEF] hover:border-[#1B4332] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <span className="text-xl">📷</span>
          </div>
          <span className="font-bold text-sm text-[#1F2937]">Alterar Fotos</span>
          <span className="text-xs text-gray-400 mt-0.5">Hero & Galeria</span>
        </Link>

        <Link 
          href="/admin/pricing" 
          className="p-4 rounded-2xl bg-white border border-[#E9ECEF] hover:border-[#1B4332] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <span className="text-xl">💰</span>
          </div>
          <span className="font-bold text-sm text-[#1F2937]">Tabela de Preços</span>
          <span className="text-xs text-gray-400 mt-0.5">Fim de Semana & Day Use</span>
        </Link>

        <Link 
          href="/admin/calendar" 
          className="p-4 rounded-2xl bg-white border border-[#E9ECEF] hover:border-[#1B4332] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <span className="text-xl">📅</span>
          </div>
          <span className="font-bold text-sm text-[#1F2937]">Bloquear Datas</span>
          <span className="text-xs text-gray-400 mt-0.5">Calendário de Reservas</span>
        </Link>

        <Link 
          href="/admin/leads" 
          className="p-4 rounded-2xl bg-white border border-[#E9ECEF] hover:border-[#1B4332] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <span className="text-xl">💬</span>
          </div>
          <span className="font-bold text-sm text-[#1F2937]">Todos os Leads</span>
          <span className="text-xs text-gray-400 mt-0.5">Contatos e WhatsApp</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E9ECEF] overflow-hidden">
        <div className="p-6 border-b border-[#E9ECEF] flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1F2937]">Leads Recentes</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-[#1B4332] hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF8F5] text-gray-600 font-medium">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">Evento</th>
                <th className="p-4">Data(s)</th>
                <th className="p-4">Pessoas</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF]">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#FAF8F5]/50">
                    <td className="p-4 font-medium text-[#1F2937]">{lead.guestName}</td>
                    <td className="p-4 text-gray-600">{lead.guestPhone}</td>
                    <td className="p-4 text-gray-600">{lead.eventType || '-'}</td>
                    <td className="p-4 text-gray-600">
                      {format(lead.startDate, "dd 'de' MMMM", { locale: ptBR })}
                    </td>
                    <td className="p-4 text-gray-600">{lead.guestCount}</td>
                    <td className="p-4">
                      <Badge className={
                        lead.status === 'BOOKED' ? 'bg-green-100 text-green-800' :
                        lead.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {lead.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Nenhum lead encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
