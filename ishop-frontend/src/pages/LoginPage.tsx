import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import type { FormEvent } from "react";


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); 

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(email, password);

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log(
        `Успешный вход как ${data.user.email} (роль: ${data.user.role})`,
      );

      navigate('/products');
    } catch (err) {
      console.error(err);
      setError('Неверный email или пароль');
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="w-full max-w-sm bg-slate-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Вход</h1>

        {error && (
          <div className="mb-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 outline-none focus:border-emerald-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Пароль</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 outline-none focus:border-emerald-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded bg-emerald-500 hover:bg-emerald-600 font-semibold"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
