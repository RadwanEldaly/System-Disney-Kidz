'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function deleteProduct(productId: string) {
  await prisma.product.delete({
    where: { id: productId }
  });
  revalidatePath('/products');
}
