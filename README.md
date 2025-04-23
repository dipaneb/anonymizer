# 🕵️‍♂️ Anonymizer

Application web pour anonymiser des documents (.pdf, .docx) avec l’API OpenAI.  
Projet réalisé dans le cadre d’un entretien technique.

---

## Table des matières

1. [Installation](#installation)
2. [Utilisation](#utilisation)
3. [Variables d’environnement](#variables-denvironnement)
4. [Script de seed](#script-de-seed)
5. [Stack technique](#stack-technique)
6. [Démo](#démo)

---

## Installation

### Prérequis

- Node.js
- NPM
- Git

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/dipaneb/anonymizer.git
cd anonymizer

# 2. Installer les dépendances backend
cd anonymizer-backend
npm install

# 3. Installer les dépendances frontend
cd ../anonymizer-frontend
npm install
```

---

## Lancement

Ouvrir deux terminaux à la racine du projet :

**Terminal 1 (Backend)** :
```bash
cd anonymizer-backend
cp .env.example .env
npx prisma db push
npm run dev
```

**Terminal 2 (Frontend)** :
```bash
cd anonymizer-frontend
cp .env.example .env
npm run dev
```

---

## Variables d’environnement

### Backend (`anonymizer-backend/.env.example`)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt" # remplacer par votre jwt
OPENAI_API_KEY="sk-..." # remplacer par votre clé API
```

---

## Script de seed

Le projet contient un script de seed pour peupler la base avec un utilisateur de test et deux documents.

```bash
cd anonymizer-backend
npm run seed
```

**Données test** :
- Email : `test@test.com`
- Mot de passe : `test1234`

---

## Utilisation

Le projet contient 4 pages principales :

- `/register` : créer un compte utilisateur
- `/login` : se connecter
- `/dashboard` : uploader un document (.pdf/.docx) et afficher l’anonymisation (avant/après)
- `/mes-documents` : visualiser l’historique des documents anonymisés

---

## Stack technique

- **Frontend** : Next.js, React
- **Backend** : Node.js, Express
- **ORM** : Prisma
- **Base de données** : SQLite
- **API IA** : OpenAI
- **Authentification** : JWT + bcrypt

---

## Démo Vidéo



https://github.com/user-attachments/assets/5790d4a5-7ee9-4db1-890d-090d0773d82e



---
