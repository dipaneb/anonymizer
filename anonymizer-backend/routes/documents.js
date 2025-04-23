const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const auth = require('../middleware/auth')

// GET /api/documents : Liste des documents d’un utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const docs = await prisma.document.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    })
    res.json(docs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des documents' })
  }
})

// GET /api/documents/:id/download : Télécharger le texte anonymisé
router.get('/:id/download', auth, async (req, res) => {
  try {
    const doc = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    })

    if (!doc) return res.status(404).json({ error: 'Document non trouvé' })

    res.setHeader('Content-Disposition', 'attachment; filename="document-anonymise.txt"')
    res.setHeader('Content-Type', 'text/plain')
    res.send(doc.anonymizedText)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur lors du téléchargement' })
  }
})

// DELETE /api/documents/:id : Supprimer un document
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await prisma.document.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    })

    if (deleted.count === 0) return res.status(404).json({ error: 'Document non trouvé ou déjà supprimé' })

    res.json({ message: 'Document supprimé' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur lors de la suppression' })
  }
})

module.exports = router

/* const express = require('express')
const router = express.Router()
const Document = require('../models/Document') // modèle mongoose
const auth = require('../middleware/auth')     // middleware d’auth

// GET /api/documents : Liste des documents
router.get('/', auth, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id }).sort({ date: -1 })
    res.json(docs)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des documents' })
  }
})

// GET /api/documents/:id/download : Télécharger un doc anonymisé
router.get('/:id/download', auth, async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, userId: req.user.id })

    if (!doc) {
      return res.status(404).json({ error: 'Document non trouvé' })
    }

    res.setHeader('Content-Disposition', 'attachment; filename="document-anonymise.txt"')
    res.setHeader('Content-Type', 'text/plain')
    res.send(doc.anonymizedText)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur lors du téléchargement' })
  }
})

// DELETE /api/documents/:id : Supprimer un doc
router.delete('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findOneAndDelete({ _id: req.params.id, userId: req.user.id })

    if (!doc) {
      return res.status(404).json({ error: 'Document non trouvé' })
    }

    res.json({ message: 'Document supprimé' })
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur lors de la suppression' })
  }
})

module.exports = router
*/


/* const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Documents route working!');
});

module.exports = router;
 */