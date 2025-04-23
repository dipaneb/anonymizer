'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [originalText, setOriginalText] = useState('');
  const [anonymizedText, setAnonymizedText] = useState('');
  const [loading, setLoading] = useState(false);

  // Pour éviter le rendu avant que le composant soit monté
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:3001/api/verify-token', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, [hasMounted]);

  if (!hasMounted) return null; // Empêche le rendu jusqu'à ce que le client soit prêt


  const handleFileChange = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await fetch('http://localhost:3001/api/anonymize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log('DATA REÇUE:', data);
      setOriginalText(data.originalText);
      setAnonymizedText(data.anonymizedText);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'anonymisation.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!user) return <p>Chargement…</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenue {user.firstName}</h1>
      <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>
        Se déconnecter
      </button>

      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.docx" onChange={handleFileChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Traitement...' : 'Anonymiser'}
        </button>
      </form>

      {originalText && (
        <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
          <h2>Texte original :</h2>
          <p>{originalText}</p>
        </div>
      )}

      {anonymizedText && (
        <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
          <h2>Texte anonymisé :</h2>
          <p>{anonymizedText}</p>
        </div>
      )}
    </div>
  );
}
