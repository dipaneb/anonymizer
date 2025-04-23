'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MesDocuments() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const token = localStorage.getItem('token') // récupère le token JWT
        if (!token) throw new Error('Token non trouvé')

        const res = await axios.get('http://localhost:3001/api/documents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setDocuments(res.data)
      } catch (err) {
        console.error(err)
        setError('Erreur lors de la récupération des documents')
      } finally {
        setLoading(false)
      }
    }

    fetchDocs()
  }, [])

  if (loading) return <p>Chargement...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Mes Documents</h1>
      {documents.length === 0 ? (
        <p>Aucun document</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              {doc.originalFilename} — {new Date(doc.createdAt).toLocaleString()}
              <a href={`http://localhost:3001/api/documents/${doc.id}/download`} target="_blank">Télécharger</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* 'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MesDocuments() {
  const [documents, setDocuments] = useState([])

  // 🔁 Récupère les documents dès le chargement
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/documents', {
          withCredentials: true,
        })
        setDocuments(res.data)
      } catch (err) {
        console.error('Erreur fetch documents', err)
      }
    }

    fetchDocs()
  }, [])

  const handleDownload = async (docId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/documents/${docId}/download`, {
        responseType: 'blob',
        withCredentials: true,
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'document-anonymise.txt')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Erreur téléchargement', err)
    }
  }

  const handleDelete = async (docId) => {
    try {
      await axios.delete(`http://localhost:3001/api/documents/${docId}`, {
        withCredentials: true,
      })
      setDocuments(docs => docs.filter(doc => doc._id !== docId))
    } catch (err) {
      console.error('Erreur suppression', err)
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">📂 Mes documents</h1>

      {documents.length === 0 ? (
        <p className="text-gray-500">Aucun document traité pour l’instant.</p>
      ) : (
        <div className="grid gap-6">
          {documents.map((doc) => (
            <div key={doc._id} className="bg-white rounded-2xl shadow p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">📅 Uploadé le {new Date(doc.date).toLocaleString()}</span>
                <button
                  className="text-sm text-red-500 hover:underline"
                  onClick={() => handleDelete(doc._id)}
                >
                  Supprimer
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Texte original</h3>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{doc.originalText}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Texte anonymisé</h3>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{doc.anonymizedText}</p>
                </div>
              </div>

              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                onClick={() => handleDownload(doc._id)}
              >
                📥 Re-télécharger
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
 */