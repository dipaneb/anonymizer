'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Chargement...');

  useEffect(() => {
    fetch('http://localhost:3001/api/ping')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("Erreur : " + err.message));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Test API</h1>
        <p className="mt-4 text-xl text-gray-700">{message}</p>
      </div>
    </main>
  );
}
