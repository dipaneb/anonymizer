// 'use client';

// import React, { useState } from 'react';
// import axios from 'axios';

// export default function Dashboard() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [originalText, setOriginalText] = useState('');
//   const [anonymizedText, setAnonymizedText] = useState('');
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fonction déclenchée à la sélection de fichier
//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   // Envoi du fichier vers le backend
//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     setLoading(true);

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       const res = await axios.post('http://localhost:3001/api/documents/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       const { original, anonymized } = res.data;

//       setOriginalText(original);
//       setAnonymizedText(anonymized);

//       setHistory([
//         ...history,
//         {
//           filename: selectedFile.name,
//           original,
//           anonymized,
//         },
//       ]);

//       setSelectedFile(null);
//     } catch (err) {
//       console.error('Erreur upload:', err);
//       alert('Échec de l’upload');
//     }

//     setLoading(false);
//   };

//   // Téléchargement du texte anonymisé
//   const handleDownload = (text, filename) => {
//     const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${filename}_anonymized.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

//       {/* Upload */}
//       <div className="bg-white shadow-md rounded p-4 mb-6">
//         <h2 className="text-xl font-semibold mb-2">Uploader un document</h2>
//         <input
//           type="file"
//           accept=".pdf,.docx"
//           onChange={handleFileChange}
//           className="mb-2"
//         />
//         <button
//           onClick={handleUpload}
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
//         >
//           {loading ? 'Traitement...' : 'Anonymiser'}
//         </button>
//       </div>

//       {/* Comparatif */}
//       {originalText && anonymizedText && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="font-semibold text-lg mb-2">Texte original</h3>
//             <pre className="whitespace-pre-wrap">{originalText}</pre>
//           </div>
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="font-semibold text-lg mb-2">Texte anonymisé</h3>
//             <pre className="whitespace-pre-wrap">{anonymizedText}</pre>
//             <button
//               onClick={() => handleDownload(anonymizedText, selectedFile?.name || 'document')}
//               className="mt-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//             >
//               Télécharger anonymisé
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Historique */}
//       {history.length > 0 && (
//         <div className="bg-white p-4 rounded shadow">
//           <h2 className="text-xl font-semibold mb-4">Historique</h2>
//           <ul className="space-y-4">
//             {history.map((doc, index) => (
//               <li key={index} className="border-b pb-2">
//                 <p className="font-semibold">{doc.filename}</p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
//                   <div>
//                     <h4 className="text-sm font-bold">Original</h4>
//                     <pre className="whitespace-pre-wrap text-sm">{doc.original}</pre>
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-bold">Anonymisé</h4>
//                     <pre className="whitespace-pre-wrap text-sm">{doc.anonymized}</pre>
//                     <button
//                       onClick={() => handleDownload(doc.anonymized, doc.filename)}
//                       className="mt-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm"
//                     >
//                       Télécharger
//                     </button>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

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



/*'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:3001/api/verify-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Token invalide');
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => {
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenue, {user.firstName} !</h1>
      <p>Email : {user.email}</p>
      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Se déconnecter
      </button>
    </div>
  );
}
*/