'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function createManualOrder(formData: FormData) {
  const customerName = formData.get('customerName') as string;
  const customerPhone = formData.get('customerPhone') as string;
  const customerAddress = formData.get('customerAddress') as string;
  
  const itemsJson = formData.get('items') as string;
  
  if (!customerName || !customerPhone || !itemsJson) {
    throw new Error("Missing required fields");
  }

  const items: Array<{productName: string, size: string, quantity: number, unitPrice: number}> = JSON.parse(itemsJson);
  
  if (items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  const totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  // 1. Get default statuses
  const defaultConfStatus = await prisma.orderStatusDef.findFirst({ where: { isDefault: true } });
  const defaultShipStatus = await prisma.shippingStatusDef.findFirst({ where: { isDefault: true } });

  // 2. Find or create customer by phone
  let customer = await prisma.customer.findUnique({
    where: { phone: customerPhone }
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress
      }
    });
  }

  // 3. Create the order
  const orderNumber = `DK-${Math.floor(1000 + Math.random() * 9000)}`;

  await prisma.order.create({
    data: {
      orderNumber,
      orderDate: new Date(),
      customerId: customer.id,
      totalAmount,
      paidAmount: 0,
      confirmationStatusId: defaultConfStatus?.id,
      shippingStatusId: defaultShipStatus?.id,
      items: {
        create: items.map(item => ({
          productNameSnapshot: item.productName,
          sizeSnapshot: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice
        }))
      }
    }
  });

  revalidatePath('/orders');
  revalidatePath('/customers');
  revalidatePath('/');
  redirect('/orders');
}

export async function deleteOrder(orderId: string) {
  await prisma.order.delete({
    where: { id: orderId }
  });
  revalidatePath('/orders');
  revalidatePath('/customers');
  revalidatePath('/');
  redirect('/orders');
}

export async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get('orderId') as string;
  const statusId = formData.get('statusId') as string;

  await prisma.order.update({
    where: { id: orderId },
    data: { confirmationStatusId: statusId }
  });

  revalidatePath(`/orders/${orderId}`);
  revalidatePath('/orders');
  revalidatePath('/');
}

export async function addOrderPayment(formData: FormData) {
  const orderId = formData.get('orderId') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const method = formData.get('paymentMethod') as string;

  if (amount <= 0) return;

  await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        orderId,
        amount,
        paymentMethod: method,
        recordedBy: 'Admin'
      }
    });

    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (order) {
      await tx.order.update({
        where: { id: orderId },
        data: { paidAmount: order.paidAmount + amount }
      });
    }
  });

  revalidatePath(`/orders/${orderId}`);
  revalidatePath('/orders');
  revalidatePath('/customers');
  revalidatePath('/');
}
