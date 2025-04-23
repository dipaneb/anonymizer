const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const docRoutes = require('./routes/documents');

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // frontend
    credentials: true,
  }));
app.use(express.json());



app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/anonymize'));
app.use('/api/auth', authRoutes);
app.use('/api/documents', docRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/ping', (req, res) => {
    res.json({ message: "Pong depuis le backend 👋" });
  });
  