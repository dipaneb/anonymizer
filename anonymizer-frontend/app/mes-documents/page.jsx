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