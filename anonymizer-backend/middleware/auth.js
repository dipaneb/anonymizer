const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret'; // doit être identique à celui de routes/auth.js

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contient au minimum { id, email }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

