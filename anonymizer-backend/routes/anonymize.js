const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const JWT_SECRET = process.env.JWT_SECRET || 'vraiment_pas_sécurisé';

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Route pour uploader un fichier
router.post('/anonymize', authenticateToken, upload.single('document'), async (req, res) => {
    const file = req.file;
    let extractedText = '';
  
    try {
      if (file.mimetype === 'application/pdf') {
        console.log('1 - Lecture du fichier');
        const dataBuffer = fs.readFileSync(file.path);

        console.log('2 - Extraction PDF');
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
      } else if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ path: file.path });
        extractedText = result.value;
      } else {
        return res.status(400).json({ error: 'Format non supporté' });
      }
  
      // Envoi à OpenAI pour anonymisation
      console.log('3 - Appel OpenAI');
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              "Tu es un assistant d'anonymisation. Remplace tous les noms de personnes, noms d'entreprises, dates précises, lieux spécifiques, numéros ou adresses mail par des étiquettes génériques [NOM], [LIEU], [DATE], [EMAIL], etc.",
          },
          {
            role: 'user',
            content: extractedText,
          },
        ],
        model: 'gpt-4',
      });
  
      const anonymizedText = completion.choices[0].message.content;
  
      //  INSÉRTION EN BASE DE DONNÉES
      console.log('4 - Enregistrement dans Prisma');
      const newDoc = await prisma.document.create({
        data: {
          userId: req.user.id,
          anonymizedText: anonymizedText,
          originalText: extractedText,
        },
      });
      
      console.log('5 - Réussite !');
      fs.unlinkSync(file.path); // nettoyage
  
      res.json({ originalText: extractedText, anonymizedText });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur pendant le traitement' });
    }
  });
  
// router.post('/anonymize', authenticateToken, upload.single('document'), async (req, res) => {
//   const file = req.file;
//   let extractedText = '';

//   try {
//     if (file.mimetype === 'application/pdf') {
//       const dataBuffer = fs.readFileSync(file.path);
//       const pdfData = await pdfParse(dataBuffer);
//       extractedText = pdfData.text;
//     } else if (
//       file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//     ) {
//       const result = await mammoth.extractRawText({ path: file.path });
//       extractedText = result.value;
//     } else {
//       return res.status(400).json({ error: 'Format non supporté' });
//     }

//     // Envoi du texte à OpenAI pour anonymisation
//     const completion = await openai.chat.completions.create({
//       messages: [
//         {
//           role: 'system',
//           content:
//             "Tu es un assistant d'anonymisation. Remplace tous les noms de personnes, noms d'entreprises, dates précises, lieux spécifiques, numéros ou adresses mail par des étiquettes génériques [NOM], [LIEU], [DATE], [EMAIL], etc.",
//         },
//         {
//           role: 'user',
//           content: extractedText,
//         },
//       ],
//       model: 'gpt-4',
//     });

//     const anonymizedText = completion.choices[0].message.content;

//     // Nettoyage du fichier temporaire
//     fs.unlinkSync(file.path);

//     res.json({ anonymizedText });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Erreur pendant le traitement' });
//   }
// });

module.exports = router;
