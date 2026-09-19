'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, MessageCircle, User, Mail, Phone, Calendar, Users, Check, Copy, ExternalLink } from 'lucide-react';
import { generateWhatsAppLink, formatCurrency } from '@/lib/utils';

const EVENT_TYPES = [
  { value: 'Casamento', label: 'Casamento' },
  { value: 'Aniversário', label: 'Aniversário' },
  { value: 'Retiro Religioso', label: 'Retiro Religioso' },
  { value: 'Confraternização Familiar', label: 'Confraternização Familiar' },
  { value: 'Evento Corporativo', label: 'Evento Corporativo' },
  { value: 'Outro', label: 'Outro' },
];

export function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    eventType: 'Casamento',
    startDate: '',
    endDate: '',
    guestCount: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const phoneDigits = formData.guestPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Por favor, informe um telefone válido com DDD');
      setLoading(false);
      return;
    }

    try {
      const estimatedTotal = Number(formData.guestCount) * 100;
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, estimatedTotal }),
      });

      if (!response.ok) throw new Error('Falha ao enviar reserva');

      const checkinFormatted = formData.startDate.split('-').reverse().join('/');
      const checkoutFormatted = formData.endDate.split('-').reverse().join('/');
      const message = `Olá! Gostaria de reservar o Sítio Recanto dos Pássaros em Juquitiba.\n\nNome: ${formData.guestName}\nEvento: ${formData.eventType}\nPessoas: ${formData.guestCount}\nDatas: ${checkinFormatted} a ${checkoutFormatted}\nValor estimado: ${formatCurrency(estimatedTotal)} + Taxa de Limpeza\n\nAguardo confirmação de disponibilidade!`;

      const waLink = generateWhatsAppLink(undefined, message);
      setWhatsAppUrl(waLink);
      setSuccess(true);
      try { window.open(waLink, '_blank'); } catch (_) {}
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao enviar.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="contato" className="py-24 bg-[#F5F0E8]">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <div className="w-20 h-20 bg-[#14291E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#14291E]" />
          </div>
          <h3 className="font-serif text-3xl font-semibold text-[#14291E] mb-3">
            Solicitação Registrada!
          </h3>
          <p className="text-[#6B6555] mb-8 max-w-md mx-auto leading-relaxed">
            Seus dados foram salvos. Clique abaixo para finalizar pelo WhatsApp com a nossa equipe:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {whatsAppUrl && (
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold rounded-xl transition-all shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Abrir WhatsApp Agora
              </a>
            )}
            <button
              onClick={() => setSuccess(false)}
              className="px-8 py-4 bg-white border border-[#DDD5C4] text-[#14291E] font-semibold rounded-xl hover:bg-[#EDE8DC] transition-all"
            >
              Nova Solicitação
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contato" className="py-24 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* Left: Info */}
          <div className="lg:col-span-2">
            <div className="section-tag mb-4">Reservas</div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#14291E] leading-tight mb-5">
              Reserve sua <span className="text-[#C8A882]">estadia</span>
            </h2>
            <p className="text-[#6B6555] leading-relaxed mb-8">
              Preencha o formulário e entraremos em contato em até 24h para confirmar disponibilidade e detalhar sua estadia.
            </p>

            <div className="space-y-4">
              {/* WhatsApp Card */}
              <a
                href="https://wa.me/5511995418478"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#DDD5C4] hover:border-[#14291E]/40 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-[#25D366]/15 group-hover:bg-[#25D366]/25 rounded-xl flex items-center justify-center text-[#25D366] transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9E9580] font-medium">WhatsApp Oficial</p>
                    <p className="text-[#14291E] font-semibold text-sm">(11) 99541-8478</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#25D366]/10 text-[#25D366]">
                  Conversar
                </span>
              </a>

              {/* Email Card */}
              <div className="p-4 bg-white rounded-2xl border border-[#DDD5C4] hover:border-[#14291E]/40 hover:shadow-md transition-all">
                <button
                  type="button"
                  onClick={() => {
                    const email = 'contato@sitiorecantodospassaros.com.br';
                    if (navigator?.clipboard) {
                      navigator.clipboard.writeText(email);
                      setCopiedEmail(true);
                      setTimeout(() => setCopiedEmail(false), 3000);
                    }
                    try {
                      window.location.href = `mailto:${email}?subject=Consulta%20de%20Reserva%20-%20S%C3%ADtio%20Recanto%20dos%20P%C3%A1ssaros`;
                    } catch (_) {}
                  }}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 bg-[#14291E]/8 group-hover:bg-[#14291E]/15 rounded-xl flex items-center justify-center text-[#14291E] transition-colors flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 pr-2">
                      <p className="text-xs text-[#9E9580] font-medium">E-mail</p>
                      <p className="text-[#14291E] font-semibold text-sm truncate">
                        contato@sitiorecantodospassaros.com.br
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {copiedEmail ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 animate-fade-in">
                        <Check className="w-3.5 h-3.5" /> Copiado!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-[#14291E]/8 text-[#14291E] group-hover:bg-[#14291E]/15 transition-colors">
                        <Copy className="w-3 h-3" /> Copiar
                      </span>
                    )}
                  </div>
                </button>

                {/* Direct Webmail Links */}
                <div className="mt-3 pt-3 border-t border-[#EDE8DC] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#9E9580]">Prefere abrir direto?</span>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=contato@sitiorecantodospassaros.com.br&su=Consulta%20de%20Reserva%20-%20S%C3%ADtio%20Recanto%20dos%20P%C3%A1ssaros"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C8A882] hover:text-[#B8936A] font-semibold flex items-center gap-1 transition-colors"
                    >
                      Abrir no Gmail <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#DDD5C4] shadow-[var(--shadow-md)]">
              {error && (
                <div className="mb-5 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                  <span className="mt-0.5">⚠</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6555] uppercase tracking-wider mb-2">
                      <User className="w-3 h-3" /> Nome Completo *
                    </label>
                    <input
                      required
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6555] uppercase tracking-wider mb-2">
                      <Mail className="w-3 h-3" /> E-mail *
                    </label>
                    <input
                      required
                      type="email"
                      name="guestEmail"
                      value={formData.guestEmail}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6555] uppercase tracking-wider mb-2">
                      <Phone className="w-3 h-3" /> Telefone / WhatsApp *
                    </label>
                    <input
                      required
                      type="tel"
                      name="guestPhone"
                      value={formData.guestPhone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6555] uppercase tracking-wider mb-2">
                      Tipo de Evento
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="input-field appearance-none"
                    >
                      {EVENT_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6555] uppercase tracking-wider mb-2">
                      <Calendar className="w-3 h-3" /> Check-in *
                    </label>
                    <input
                      required
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6555] uppercase tracking-wider mb-2">
                      <Calendar className="w-3 h-3" /> Check-out *
                    </label>
                    <input
                      required
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6555] uppercase tracking-wider mb-2">
                      <Users className="w-3 h-3" /> Pessoas *
                    </label>
                    <input
                      required
                      type="number"
                      min="20"
                      max="200"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleChange}
                      placeholder="Ex: 50"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-semibold text-[#6B6555] uppercase tracking-wider mb-2 block">
                    Observações
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Informações adicionais, necessidades especiais..."
                    className="input-field resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#14291E] hover:bg-[#1F3D2E] disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-base"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {loading ? 'Enviando...' : 'Enviar Solicitação de Reserva'}
                </button>

                <p className="text-center text-xs text-[#9E9580]">
                  Após o envio, você receberá uma confirmação via WhatsApp em até 24h
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
