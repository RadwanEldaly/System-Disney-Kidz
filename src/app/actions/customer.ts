'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function deleteCustomer(customerId: string) {
  await prisma.customer.delete({
    where: { id: customerId }
  });
  revalidatePath('/customers');
  revalidatePath('/orders');
  revalidatePath('/');
}
