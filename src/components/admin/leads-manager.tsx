'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  MessageCircle, 
  Search, 
  Trash2, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Phone,
  Mail,
  Filter
} from 'lucide-react';
import { formatCurrency, formatPhone } from '@/lib/utils';

interface Lead {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  eventType: string;
  guestCount: number;
  startDate: string;
  endDate: string;
  estimatedTotal: number;
  status: 'PENDING' | 'CONTACTED' | 'BOOKED' | 'CANCELLED';
  createdAt: string;
}

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus as any } : lead))
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir a solicitação de "${name}"?`)) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
      } else {
        alert('Erro ao excluir solicitação.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir solicitação.');
    }
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      lead.guestName.toLowerCase().includes(query) ||
      lead.guestPhone.toLowerCase().includes(query) ||
      lead.guestEmail.toLowerCase().includes(query) ||
      lead.eventType.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  // Calculate metrics
  const totalLeads = leads.length;
  const pendingLeads = leads.filter((l) => l.status === 'PENDING').length;
  const contactedLeads = leads.filter((l) => l.status === 'CONTACTED').length;
  const bookedLeads = leads.filter((l) => l.status === 'BOOKED').length;
  const totalEstimatedRevenue = leads
    .filter((l) => l.status === 'BOOKED')
    .reduce((acc, l) => acc + (l.estimatedTotal || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return <Badge className="bg-emerald-100 text-emerald-800 border-none font-semibold">Confirmado</Badge>;
      case 'CONTACTED':
        return <Badge className="bg-amber-100 text-amber-800 border-none font-semibold">Em Contato</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-rose-100 text-rose-800 border-none font-semibold">Cancelado</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 border-none font-semibold">Novo</Badge>;
    }
  };

  const generateWhatsAppLink = (lead: Lead) => {
    let cleanPhone = lead.guestPhone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('55')) {
      cleanPhone = `55${cleanPhone}`;
    }
    const message = encodeURIComponent(
      `Olá ${lead.guestName}! Tudo bem? Sou da administração do Sítio Recanto dos Pássaros em Juquitiba. Vi sua solicitação para ${lead.eventType} (${lead.guestCount} pessoas). Poderia me confirmar se ainda tem interesse nas datas?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-[#1F2937] flex items-center gap-2.5">
          <Users className="text-[#1B4332]" />
          Gerenciar Leads & Reservas
        </h1>
        <p className="text-gray-500 mt-1">
          Acompanhe todos os contatos recebidos pelo formulário e inicie conversas no WhatsApp
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E9ECEF] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Novos Leads</span>
            <div className="text-2xl font-bold text-[#1F2937]">{pendingLeads}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E9ECEF] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Em Negociação</span>
            <div className="text-2xl font-bold text-[#1F2937]">{contactedLeads}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E9ECEF] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fechados</span>
            <div className="text-2xl font-bold text-[#1F2937]">{bookedLeads}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E9ECEF] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1B4332]/10 text-[#1B4332] rounded-xl flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Faturamento Fechado</span>
            <div className="text-xl md:text-2xl font-bold text-[#1B4332]">
              {formatCurrency(totalEstimatedRevenue)}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Status Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'bg-white border border-[#E9ECEF] text-gray-600 hover:bg-gray-50'
            }`}
          >
            Todos ({totalLeads})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              statusFilter === 'PENDING'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'bg-white border border-[#E9ECEF] text-gray-600 hover:bg-gray-50'
            }`}
          >
            Novos ({pendingLeads})
          </button>
          <button
            onClick={() => setStatusFilter('CONTACTED')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              statusFilter === 'CONTACTED'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'bg-white border border-[#E9ECEF] text-gray-600 hover:bg-gray-50'
            }`}
          >
            Em Contato ({contactedLeads})
          </button>
          <button
            onClick={() => setStatusFilter('BOOKED')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              statusFilter === 'BOOKED'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'bg-white border border-[#E9ECEF] text-gray-600 hover:bg-gray-50'
            }`}
          >
            Fechados ({bookedLeads})
          </button>
          <button
            onClick={() => setStatusFilter('CANCELLED')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              statusFilter === 'CANCELLED'
                ? 'bg-[#1B4332] text-white shadow-sm'
                : 'bg-white border border-[#E9ECEF] text-gray-600 hover:bg-gray-50'
            }`}
          >
            Cancelados ({leads.filter((l) => l.status === 'CANCELLED').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nome, telefone..."
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E9ECEF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF8F5] text-gray-600 font-semibold border-b border-[#E9ECEF]">
              <tr>
                <th className="p-4">Cliente & Contato</th>
                <th className="p-4">Evento / Hóspedes</th>
                <th className="p-4">Período de Estadia</th>
                <th className="p-4">Valor Estimado</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    Carregando leads...
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Name & Contact */}
                    <td className="p-4">
                      <div className="font-bold text-[#1F2937] text-base">{lead.guestName}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <Phone className="w-3 h-3 text-[#2D6A4F]" />
                        <span>{lead.guestPhone}</span>
                      </div>
                      {lead.guestEmail && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{lead.guestEmail}</span>
                        </div>
                      )}
                    </td>

                    {/* Event & Guests */}
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{lead.eventType || 'Locação'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {lead.guestCount} pessoas
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="p-4 text-gray-600">
                      <div className="font-medium text-[#1F2937]">
                        {format(new Date(lead.startDate), "dd 'de' MMM, yyyy", { locale: ptBR })}
                      </div>
                      <div className="text-xs text-gray-500">
                        até {format(new Date(lead.endDate), "dd 'de' MMM, yyyy", { locale: ptBR })}
                      </div>
                    </td>

                    {/* Value */}
                    <td className="p-4">
                      <div className="font-bold text-[#1B4332] text-base">
                        {lead.estimatedTotal ? formatCurrency(lead.estimatedTotal) : 'A combinar'}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4">
                      <select
                        className="border border-[#E9ECEF] rounded-xl px-2.5 py-1.5 text-xs font-semibold bg-white cursor-pointer focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      >
                        <option value="PENDING">🔵 Novo</option>
                        <option value="CONTACTED">🟡 Em Contato</option>
                        <option value="BOOKED">🟢 Fechado</option>
                        <option value="CANCELLED">🔴 Cancelado</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={generateWhatsAppLink(lead)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                          title="Iniciar conversa no WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => handleDeleteLead(lead.id, lead.guestName)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir solicitação"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-gray-500">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-gray-700">Nenhuma solicitação encontrada</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchQuery ? 'Tente buscar com outros termos.' : 'Quando visitantes enviarem o formulário, eles aparecerão aqui.'}
                    </p>
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
