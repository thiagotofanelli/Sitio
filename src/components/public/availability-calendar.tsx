'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Info, CalendarDays, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWhatsAppLink } from '@/lib/utils';

interface BlockedPeriod {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DAY_NAMES_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

interface MonthProps {
  year: number;
  month: number;
  blockedDays: Set<string>;
  checkIn: Date | null;
  checkOut: Date | null;
  hovered: Date | null;
  today: Date;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
}

function CalendarMonth({ year, month, blockedDays, checkIn, checkOut, hovered, today, onDayClick, onDayHover }: MonthProps) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const toKey = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const rangeEnd = checkIn && !checkOut && hovered ? hovered : checkOut;

  return (
    <div className="flex-1 min-w-[260px]">
      <h4 className="text-center font-semibold text-[#14291E] mb-4 text-sm">
        {MONTH_NAMES[month]} {year}
      </h4>
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES_SHORT.map((d, i) => (
          <div key={i} className="text-center text-xs text-[#9E9580] font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e${idx}`} />;
          const date = new Date(year, month, day);
          const key = toKey(day);
          const blocked = blockedDays.has(key);
          const past = date < today && !isSameDay(date, today);
          const isIn = checkIn && isSameDay(date, checkIn);
          const isOut = checkOut && isSameDay(date, checkOut);
          const isToday = isSameDay(date, today);
          const inRange = checkIn && rangeEnd && !isSameDay(checkIn, rangeEnd) &&
            date > (checkIn < rangeEnd ? checkIn : rangeEnd) &&
            date < (checkIn < rangeEnd ? rangeEnd : checkIn);
          const disabled = blocked || past;

          let cls = 'relative flex items-center justify-center h-8 w-8 mx-auto text-[13px] rounded-full transition-all duration-150 select-none ';
          if (isIn || isOut) cls += 'bg-[#14291E] text-white font-semibold z-10 ';
          else if (inRange) cls += 'bg-[#14291E]/12 text-[#14291E] font-medium rounded-none ';
          else if (blocked) cls += 'bg-red-50 text-red-300 line-through cursor-not-allowed ';
          else if (past) cls += 'text-[#DDD5C4] cursor-not-allowed ';
          else if (isToday) cls += 'border-2 border-[#14291E] text-[#14291E] font-bold cursor-pointer hover:bg-[#14291E]/8 ';
          else cls += 'text-[#1A1A14] cursor-pointer hover:bg-[#14291E]/10 hover:text-[#14291E] ';

          return (
            <div
              key={key}
              className={cls}
              onClick={() => !disabled && onDayClick(date)}
              onMouseEnter={() => !disabled && onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              title={blocked ? 'Data indisponível' : undefined}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AvailabilityCalendar() {
  const today = startOfDay(new Date());
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [blocked, setBlocked] = useState<BlockedPeriod[]>([]);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [hovered, setHovered] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blocked-dates')
      .then((r) => r.json())
      .then((data: BlockedPeriod[]) => { setBlocked(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const blockedDays = useCallback((): Set<string> => {
    const s = new Set<string>();
    blocked.forEach(({ startDate, endDate }) => {
      const cur = startOfDay(new Date(startDate));
      const end = startOfDay(new Date(endDate));
      while (cur <= end) {
        s.add(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
      }
    });
    return s;
  }, [blocked])();

  const handleDayClick = (date: Date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date); setCheckOut(null);
    } else {
      if (date <= checkIn) { setCheckIn(date); setCheckOut(null); return; }
      const cur = new Date(checkIn.getTime() + 86400000);
      while (cur < date) {
        if (blockedDays.has(cur.toISOString().split('T')[0])) { setCheckIn(date); setCheckOut(null); return; }
        cur.setDate(cur.getDate() + 1);
      }
      setCheckOut(date);
    }
  };

  const nights = checkIn && checkOut ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000) : 0;
  const fmt = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const next = addMonths(viewDate, 1);

  const waMsg = checkIn && checkOut
    ? `Olá! Gostaria de verificar disponibilidade no Sítio Recanto dos Pássaros.\n\nCheck-in: ${fmt(checkIn)}\nCheck-out: ${fmt(checkOut)}\nPeríodo: ${nights} noite${nights !== 1 ? 's' : ''}\n\nAguardo confirmação!`
    : '';

  const canGoPrev = viewDate > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <section id="disponibilidade" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="section-tag mb-4">
              <CalendarDays className="w-3.5 h-3.5" />
              Disponibilidade
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#14291E] leading-tight">
              Verifique as <span className="text-[#C8A882]">datas disponíveis</span>
            </h2>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#6B6555]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#14291E]" />
              <span>Selecionado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200" />
              <span>Indisponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-[#14291E]" />
              <span>Hoje</span>
            </div>
          </div>
        </div>

        <div className="bg-[#F5F0E8] rounded-3xl p-6 md:p-8 border border-[#DDD5C4]">
          {/* Month Nav */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => canGoPrev && setViewDate(addMonths(viewDate, -1))}
              disabled={!canGoPrev}
              className="p-2 rounded-xl hover:bg-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors border border-[#DDD5C4] bg-white"
            >
              <ChevronLeft className="w-4 h-4 text-[#14291E]" />
            </button>
            <span className="text-[#6B6555] text-sm font-medium">
              {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()} — {MONTH_NAMES[next.getMonth()]} {next.getFullYear()}
            </span>
            <button
              onClick={() => setViewDate(addMonths(viewDate, 1))}
              className="p-2 rounded-xl hover:bg-white transition-colors border border-[#DDD5C4] bg-white"
            >
              <ChevronRight className="w-4 h-4 text-[#14291E]" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-7 h-7 border-2 border-[#14291E] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <CalendarMonth year={viewDate.getFullYear()} month={viewDate.getMonth()} blockedDays={blockedDays} checkIn={checkIn} checkOut={checkOut} hovered={hovered} today={today} onDayClick={handleDayClick} onDayHover={setHovered} />
              <div className="hidden md:block w-px bg-[#DDD5C4] self-stretch" />
              <CalendarMonth year={next.getFullYear()} month={next.getMonth()} blockedDays={blockedDays} checkIn={checkIn} checkOut={checkOut} hovered={hovered} today={today} onDayClick={handleDayClick} onDayHover={setHovered} />
            </div>
          )}

          {/* Selection Panel */}
          <AnimatePresence>
            {checkIn && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="mt-8 pt-6 border-t border-[#DDD5C4]"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-5">
                    <div>
                      <p className="text-[10px] font-bold text-[#9E9580] uppercase tracking-widest mb-1">Check-in</p>
                      <p className="text-[#14291E] font-serif font-semibold text-xl">{fmt(checkIn)}</p>
                    </div>
                    {checkOut ? (
                      <>
                        <div className="self-center text-[#DDD5C4] text-lg">→</div>
                        <div>
                          <p className="text-[10px] font-bold text-[#9E9580] uppercase tracking-widest mb-1">Check-out</p>
                          <p className="text-[#14291E] font-serif font-semibold text-xl">{fmt(checkOut)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-[#9E9580] uppercase tracking-widest mb-1">Duração</p>
                          <p className="text-[#C8A882] font-serif font-semibold text-xl">{nights} noite{nights !== 1 ? 's' : ''}</p>
                        </div>
                      </>
                    ) : (
                      <div className="self-center flex items-center gap-1.5 text-sm text-[#9E9580]">
                        <Info className="w-4 h-4" />
                        Clique na data de saída
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setCheckIn(null); setCheckOut(null); }}
                      className="px-3 py-2 text-sm text-[#6B6555] hover:text-[#14291E] hover:bg-white rounded-lg transition-colors"
                    >
                      Limpar
                    </button>
                    {checkOut && (
                      <a
                        href={generateWhatsAppLink(undefined, waMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#14291E] hover:bg-[#1F3D2E] text-white font-semibold text-sm rounded-xl transition-all shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Consultar via WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
