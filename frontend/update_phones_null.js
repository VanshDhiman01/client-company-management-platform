import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (user.phone && user.phone.includes('+91 98765')) {
      await prisma.user.update({
        where: { id: user.id },
        data: { phone: null }
      });
    }
  }
  console.log('Phones set to null!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
