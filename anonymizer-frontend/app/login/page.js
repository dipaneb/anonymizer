'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      alert(data.error || 'Erreur de connexion');
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Connexion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="w-full p-2 border rounded" type="password" placeholder="Mot de passe" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Se connecter</button>
      </form>
    </div>
  );
}
