'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Trees } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        redirectTo: '/admin',
      });

      if (res?.error) {
        setError('E-mail ou senha incorretos.');
        setLoading(false);
      } else {
        window.location.href = '/admin';
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // NextAuth às vezes lança exceção em caso de redirecionamento ou credenciais
      if (err?.message?.includes('CredentialsSignin')) {
        setError('E-mail ou senha incorretos.');
        setLoading(false);
      } else {
        window.location.href = '/admin';
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4 font-[family-name:var(--font-playfair)]">
      <Card className="w-full max-w-md shadow-lg border-[#E9ECEF]">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4 text-[#1B4332]">
            <Trees size={48} />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Sítio Recanto dos Pássaros</h1>
          <p className="text-[#D4A373]">Área Administrativa</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1F2937]">E-mail</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                placeholder="eduardo@sitio.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1F2937]">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center font-medium">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
