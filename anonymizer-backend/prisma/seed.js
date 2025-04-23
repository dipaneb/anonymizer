// backend/prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("test1234", 10);

  // Supprime les données existantes (optionnel)
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();

  // Crée l'utilisateur
  const user = await prisma.user.create({
    data: {
      email: "test@test.com",
      password: hashedPassword,
      firstName: "Test",
      lastName: "User",
    },
  });

  // Crée deux documents liés à l'utilisateur
  await prisma.document.createMany({
    data: [
      {
        originalText: "Texte original 1",
        anonymizedText: "Texte anonymisé 1",
        userId: user.id,
      },
      {
        originalText: "Texte original 2",
        anonymizedText: "Texte anonymisé 2",
        userId: user.id,
      },
    ],
  });

  console.log("✅ Seed terminé !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur dans le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
