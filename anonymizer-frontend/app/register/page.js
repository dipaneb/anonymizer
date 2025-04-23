'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Inscription réussie !');
      router.push('/login');
    } else {
      alert(data.error || 'Erreur lors de l’inscription');
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Inscription</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Prénom" onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <input className="w-full p-2 border rounded" placeholder="Nom" onChange={e => setForm({ ...form, lastName: e.target.value })} />
        <input className="w-full p-2 border rounded" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="w-full p-2 border rounded" type="password" placeholder="Mot de passe" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">S’inscrire</button>
      </form>
    </div>
  );
}
