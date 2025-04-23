const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(409).json({ error: 'Email déjà utilisé' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });

  res.json({ message: 'Inscription réussie', userId: newUser.id });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

  res.json({ message: 'Connexion réussie', token });
});

// GET /api/auth/verify-token
router.get('/verify-token', async (req, res) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) return res.status(401).json({ error: 'Token manquant' });
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, firstName: true, email: true },
      });
  
      if (!user) throw new Error('Utilisateur introuvable');
  
      res.json({ user });
    } catch (err) {
      res.status(401).json({ error: 'Token invalide' });
    }
  });

module.exports = router;
