import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (user.phone && user.phone.includes('+1 (555)')) {
      const newPhone = user.phone.replace('+1 (555)', '+91 98765');
      await prisma.user.update({
        where: { id: user.id },
        data: { phone: newPhone }
      });
    }
  }
  console.log('Phones updated!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
