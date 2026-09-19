'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  CalendarDays, 
  Sun, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  AlertCircle,
  TrendingDown,
  Users
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PricingTier {
  id: string;
  category: string;
  peopleCount: number;
  price: number;
  validityNote: string | null;
}

interface GroupedPricing {
  WEEKEND: PricingTier[];
  DAY_USE: PricingTier[];
}

export function PricingEditor() {
  const [pricingData, setPricingData] = useState<GroupedPricing>({
    WEEKEND: [],
    DAY_USE: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'WEEKEND' | 'DAY_USE'>('WEEKEND');
  
  // Track modified prices by id: { [id]: string }
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Add new tier modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPeopleCount, setNewPeopleCount] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [addingTier, setAddingTier] = useState(false);
  const [addError, setAddError] = useState('');

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pricing');
      if (res.ok) {
        const data = await res.json();
        setPricingData({
          WEEKEND: Array.isArray(data.WEEKEND) ? data.WEEKEND : [],
          DAY_USE: Array.isArray(data.DAY_USE) ? data.DAY_USE : [],
        });
      }
    } catch (error) {
      console.error('Erro ao buscar tabela de preços:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handlePriceChange = (id: string, value: string) => {
    setEdits((prev) => ({ ...prev, [id]: value }));
  };

  const handleSavePrice = async (tier: PricingTier) => {
    const rawVal = edits[tier.id];
    if (rawVal === undefined) return;

    const newPriceVal = parseFloat(rawVal);
    if (isNaN(newPriceVal) || newPriceVal <= 0) {
      alert('Informe um valor válido maior que zero.');
      return;
    }

    try {
      setSavingId(tier.id);
      const res = await fetch(`/api/pricing/${tier.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPriceVal }),
      });

      if (res.ok) {
        setPricingData((prev) => {
          const list = prev[activeTab].map((t) =>
            t.id === tier.id ? { ...t, price: newPriceVal } : t
          );
          return { ...prev, [activeTab]: list };
        });

        const newEdits = { ...edits };
        delete newEdits[tier.id];
        setEdits(newEdits);

        setSuccessMsg(`Valor para ${tier.peopleCount} pessoas atualizado com sucesso!`);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert('Erro ao salvar novo valor.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar valor.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteTier = async (id: string, peopleCount: number) => {
    if (!confirm(`Deseja realmente remover a faixa de ${peopleCount} pessoas?`)) return;

    try {
      const res = await fetch(`/api/pricing/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPricingData((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].filter((t) => t.id !== id),
        }));
      } else {
        alert('Erro ao excluir faixa.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir faixa.');
    }
  };

  const handleAddTier = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(newPeopleCount);
    const val = parseFloat(newPrice);

    if (isNaN(count) || count <= 0) {
      setAddError('Informe uma quantidade válida de pessoas.');
      return;
    }
    if (isNaN(val) || val <= 0) {
      setAddError('Informe um valor de diária válido.');
      return;
    }

    try {
      setAddingTier(true);
      setAddError('');

      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeTab,
          peopleCount: count,
          price: val,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Erro ao criar faixa de preço');
      }

      setAddModalOpen(false);
      setNewPeopleCount('');
      setNewPrice('');
      await fetchPricing();
      setSuccessMsg('Nova faixa de preço adicionada com sucesso!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setAddError(err.message || 'Erro ao adicionar');
    } finally {
      setAddingTier(false);
    }
  };

  const currentTiers = (pricingData[activeTab] || []).sort(
    (a, b) => a.peopleCount - b.peopleCount
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937] flex items-center gap-2.5">
            <DollarSign className="text-[#1B4332]" />
            Tabela de Preços & Diárias
          </h1>
          <p className="text-gray-500 mt-1">
            Altere os valores cobrados por quantidade de pessoas. As alterações refletem instantaneamente no Simulador.
          </p>
        </div>

        <Button
          onClick={() => {
            setAddError('');
            setNewPeopleCount('');
            setNewPrice('');
            setAddModalOpen(true);
          }}
          variant="primary"
          size="lg"
          className="shadow-md cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Faixa
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Mode Switch Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('WEEKEND')}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'WEEKEND'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'bg-white border border-[#E9ECEF] text-gray-600 hover:bg-gray-50'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Final de Semana / Feriados ({pricingData.WEEKEND?.length || 0} faixas)
        </button>

        <button
          onClick={() => setActiveTab('DAY_USE')}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'DAY_USE'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'bg-white border border-[#E9ECEF] text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Sun className="w-4 h-4" />
          Day Use sem Pernoite ({pricingData.DAY_USE?.length || 0} faixas)
        </button>
      </div>

      {/* Info Notice */}
      <div className="bg-[#FAF8F5] border border-[#E9ECEF] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4A373]/20 text-[#C58F4E] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#1F2937] text-sm">
              Modalidade: {activeTab === 'WEEKEND' ? 'Final de Semana / Feriado' : 'Day Use (Sem Pernoite)'}
            </h4>
            <p className="text-xs text-gray-500">
              Taxa de limpeza fixa de R$ 200,00 e caução reembolsável de R$ 1.000,00 são somadas automaticamente no simulador.
            </p>
          </div>
        </div>

        {currentTiers.length > 0 && (
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-xs text-gray-400 block">Menor Diária</span>
              <span className="font-bold text-[#1B4332]">
                {formatCurrency(currentTiers[0]?.price || 0)}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block">Maior Diária</span>
              <span className="font-bold text-[#1B4332]">
                {formatCurrency(currentTiers[currentTiers.length - 1]?.price || 0)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tiers Table */}
      <Card className="shadow-sm border-[#E9ECEF] overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-16 text-center text-gray-500">
              Carregando tabela de preços...
            </div>
          ) : currentTiers.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">Nenhuma faixa de preço cadastrada.</p>
              <Button onClick={() => setAddModalOpen(true)} variant="outline" className="mt-4">
                Adicionar primeira faixa
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF8F5] text-gray-600 font-semibold border-b border-[#E9ECEF]">
                  <tr>
                    <th className="p-4 pl-6">Capacidade</th>
                    <th className="p-4">Valor Atual Cadastrado</th>
                    <th className="p-4">Valor Médio / Pessoa</th>
                    <th className="p-4">Editar Valor (R$)</th>
                    <th className="p-4 pr-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9ECEF]">
                  {currentTiers.map((tier) => {
                    const currentInput = edits[tier.id] !== undefined ? edits[tier.id] : tier.price.toString();
                    const isDirty = edits[tier.id] !== undefined && parseFloat(edits[tier.id]) !== tier.price;
                    const pricePerPerson = tier.price / tier.peopleCount;

                    return (
                      <tr key={tier.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-4 pl-6 font-bold text-[#1F2937] text-base">
                          {tier.peopleCount} pessoas
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-[#1B4332] text-base">
                            {formatCurrency(tier.price)}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 font-medium">
                          {formatCurrency(pricePerPerson)} / pessoa
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 font-semibold">R$</span>
                            <Input
                              type="number"
                              min="0"
                              step="50"
                              className={`w-36 font-semibold ${
                                isDirty ? 'border-amber-400 bg-amber-50/70' : 'bg-white'
                              }`}
                              value={currentInput}
                              onChange={(e) => handlePriceChange(tier.id, e.target.value)}
                            />
                          </div>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              disabled={!isDirty || savingId === tier.id}
                              onClick={() => handleSavePrice(tier)}
                              size="sm"
                              className={
                                isDirty
                                  ? 'bg-[#1B4332] text-white shadow-sm cursor-pointer'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }
                            >
                              <Save className="w-3.5 h-3.5 mr-1" />
                              {savingId === tier.id ? 'Salvando...' : 'Salvar'}
                            </Button>

                            <button
                              onClick={() => handleDeleteTier(tier.id, tier.peopleCount)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Remover faixa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Tier Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-1 font-[family-name:var(--font-playfair)]">
              Adicionar Faixa de Preço
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Modalidade selecionada:{' '}
              <strong className="text-[#1B4332]">
                {activeTab === 'WEEKEND' ? 'Final de Semana / Feriado' : 'Day Use'}
              </strong>
            </p>

            {addError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddTier} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Quantidade de Pessoas *
                </label>
                <Input
                  type="number"
                  min="1"
                  max="300"
                  placeholder="Ex: 45"
                  value={newPeopleCount}
                  onChange={(e) => setNewPeopleCount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Valor da Diária (R$) *
                </label>
                <Input
                  type="number"
                  min="0"
                  step="50"
                  placeholder="Ex: 4200"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddModalOpen(false)}
                  disabled={addingTier}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={addingTier}
                  className="px-6"
                >
                  Cadastrar Faixa
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
