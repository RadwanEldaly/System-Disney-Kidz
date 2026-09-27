import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding baseline configurations...');

  // 1. Order Statuses
  await prisma.orderStatusDef.createMany({
    data: [
      { name: 'New', color: 'blue', orderIndex: 1, isDefault: true },
      { name: 'Contact Customer', color: 'yellow', orderIndex: 2 },
      { name: 'Waiting Confirmation', color: 'orange', orderIndex: 3 },
      { name: 'Confirmed', color: 'green', orderIndex: 4 },
      { name: 'Cancelled', color: 'red', orderIndex: 5 },
    ]
  });

  // 2. Shipping Statuses
  await prisma.shippingStatusDef.createMany({
    data: [
      { name: 'Not Registered', color: 'gray', orderIndex: 1, isDefault: true },
      { name: 'Registered with Bosta', color: 'blue', orderIndex: 2 },
      { name: 'Shipped', color: 'purple', orderIndex: 3 },
      { name: 'Out for Delivery', color: 'yellow', orderIndex: 4 },
      { name: 'Delivered', color: 'green', orderIndex: 5 },
      { name: 'Returned', color: 'red', orderIndex: 6 },
    ]
  });

  // 3. System Settings
  await prisma.systemSetting.createMany({
    data: [
      { category: 'STORE', key: 'store_name', value: 'Disney Kidz', description: 'Public name of the store' },
      { category: 'STORE', key: 'currency', value: 'EGP', description: 'Store currency' },
      { category: 'SHOPIFY', key: 'shopify_domain', value: 'disney-kidz.myshopify.com', description: 'Shopify Store Domain' },
      { category: 'BOSTA', key: 'bosta_api_key', value: '', isSecret: true, description: 'Bosta production API key' },
    ]
  });

  // 4. Admin User (for NextAuth fallback)
  await prisma.user.upsert({
    where: { email: 'admin@disneykidz.com' },
    update: {},
    create: {
      name: 'Disney Kidz Admin',
      email: 'admin@disneykidz.com',
      role: 'ADMIN',
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
