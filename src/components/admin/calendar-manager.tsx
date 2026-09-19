'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal, ModalContent, ModalTrigger, ModalTitle } from '@/components/ui/modal';

interface BlockedDate {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  notes?: string;
}

export function CalendarManager() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [reason, setReason] = useState('Reserva Confirmada');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch('/api/blocked-dates');
      if (res.ok) {
        const data = await res.json();
        setBlockedDates(data);
      }
    } catch (error) {
      console.error('Failed to fetch blocked dates', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(block => {
      const start = new Date(block.startDate);
      const end = new Date(block.endDate);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      return date >= start && date <= end;
    });
  };

  const isDateSelected = (date: Date) => {
    if (selectionStart && !selectionEnd) {
      return date.getTime() === selectionStart.getTime();
    }
    if (selectionStart && selectionEnd) {
      const start = selectionStart < selectionEnd ? selectionStart : selectionEnd;
      const end = selectionStart > selectionEnd ? selectionStart : selectionEnd;
      return date >= start && date <= end;
    }
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (isDateBlocked(date)) return;

    if (!selectionStart || (selectionStart && selectionEnd)) {
      setSelectionStart(date);
      setSelectionEnd(null);
    } else {
      if (date < selectionStart) {
        setSelectionEnd(selectionStart);
        setSelectionStart(date);
      } else {
        setSelectionEnd(date);
      }
      setIsModalOpen(true);
    }
  };

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectionStart || !selectionEnd) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: selectionStart.toISOString(),
          endDate: selectionEnd.toISOString(),
          reason,
          notes
        })
      });

      if (res.ok) {
        await fetchBlockedDates();
        setSelectionStart(null);
        setSelectionEnd(null);
        setIsModalOpen(false);
        setNotes('');
        setReason('Reserva Confirmada');
        alert('Datas bloqueadas com sucesso!');
      } else {
        alert('Erro ao bloquear datas.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao bloquear datas.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este bloqueio?')) return;
    
    try {
      const res = await fetch(`/api/blocked-dates/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchBlockedDates();
      } else {
        alert('Erro ao remover bloqueio.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1F2937]">Gerenciar Calendário</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm border-[#E9ECEF]">
          <CardHeader className="flex flex-row items-center justify-between py-4 border-b">
            <h2 className="text-lg font-semibold text-[#1F2937] capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((date, i) => {
                const blocked = isDateBlocked(date);
                const selected = isDateSelected(date);
                const today = isToday(date);
                
                let bgClass = "bg-[#FAF8F5] hover:bg-gray-100 text-gray-700";
                if (blocked) bgClass = "bg-red-100 text-red-800 cursor-not-allowed opacity-70";
                else if (selected) bgClass = "bg-[#1B4332] text-white";
                else if (today) bgClass = "bg-blue-50 text-blue-600 font-bold border border-blue-200";

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => handleDateClick(date)}
                    className={`
                      aspect-square flex items-center justify-center rounded-md text-sm cursor-pointer transition-colors
                      ${bgClass}
                    `}
                  >
                    {format(date, 'd')}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#FAF8F5] border border-gray-200"></div>
                <span>Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#1B4332]"></div>
                <span>Selecionado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
                <span>Bloqueado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#E9ECEF]">
          <CardHeader className="py-4 border-b">
            <h2 className="text-lg font-semibold text-[#1F2937]">Bloqueios Recentes</h2>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <p className="p-4 text-gray-500 text-sm">Carregando...</p>
            ) : blockedDates.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm">Nenhum bloqueio encontrado.</p>
            ) : (
              <ul className="divide-y divide-[#E9ECEF] max-h-[400px] overflow-y-auto">
                {blockedDates.map(block => (
                  <li key={block.id} className="p-4 flex items-center justify-between hover:bg-[#FAF8F5]/50">
                    <div>
                      <p className="text-sm font-medium text-[#1F2937]">
                        {format(new Date(block.startDate), 'dd/MM/yyyy')} - {format(new Date(block.endDate), 'dd/MM/yyyy')}
                      </p>
                      <p className="text-xs text-gray-500">{block.reason}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(block.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Bloquear Datas</h2>
            <p className="text-sm text-gray-600 mb-4">
              Período: {selectionStart && format(selectionStart, 'dd/MM/yyyy')} a {selectionEnd && format(selectionEnd, 'dd/MM/yyyy')}
            </p>
            <form onSubmit={handleCreateBlock} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Motivo</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="Reserva Confirmada">Reserva Confirmada</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Observações (Opcional)</label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalhes adicionais..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setIsModalOpen(false);
                  setSelectionStart(null);
                  setSelectionEnd(null);
                }}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting} className="bg-[#1B4332] text-white">
                  {submitting ? 'Salvando...' : 'Bloquear Datas'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
