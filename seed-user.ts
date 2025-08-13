import { prisma } from './src/lib/prisma'; // relative import for Node
import bcrypt from 'bcryptjs';

async function main() {
  const plainPassword = 'admin@123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.create({
    data: {
      first_name: 'Barton',
      last_name: 'Dc',
      date_of_birth: new Date('1990-01-01'),
      email: 'bartondc@peakclinics.com',
      password: hashedPassword,
      original_password: plainPassword,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    },
  });

  console.log('User created successfully:', user);
}

main()
  .catch((e) => {
    console.error('Error creating user:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
