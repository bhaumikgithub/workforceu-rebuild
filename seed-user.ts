const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const plainPassword = 'admin@123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.create({
    data: {
      first_name: 'Robert',
      last_name: 'Barton',
      date_of_birth: new Date('1990-01-01'),
      email: 'bartondc@peakclinics.com',
      password: hashedPassword,
      original_password: plainPassword,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    },
  });

  console.log('User seeded successfully:', user);
}

main()
  .catch((e) => {
    console.error('Error seeding user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
