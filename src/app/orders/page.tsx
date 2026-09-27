import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: true, confirmationStatus: true, shippingStatus: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-zinc-500 mt-1">Manage and track all customer orders.</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link href="/orders/new" className="bg-[#789fb1] hover:bg-[#668b9d] text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center">
            New order
          </Link>
        </div>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Order #</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Remaining</th>
                <th className="px-6 py-3 font-medium">Confirmation</th>
                <th className="px-6 py-3 font-medium">Shipping</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const remaining = order.totalAmount - order.paidAmount;
                  return (
                    <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/orders/${order.id}`} className="font-semibold text-blue-600 hover:underline">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{order.customer.name}</td>
                      <td className="px-6 py-4">{order.customer.phone}</td>
                      <td className="px-6 py-4">{order.totalAmount} EGP</td>
                      <td className={`px-6 py-4 ${remaining > 0 ? 'text-red-500 font-semibold' : ''}`}>{remaining} EGP</td>
                      <td className="px-6 py-4">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: order.confirmationStatus?.color || '#9ca3af' }}
                        >
                          {order.confirmationStatus?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: order.shippingStatus?.color || '#9ca3af' }}
                        >
                          {order.shippingStatus?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3">
                        <Link href={`/orders/${order.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-500">Edit</Link>
                        <form action={async () => {
                          'use server';
                          const { deleteOrder } = await import('@/app/actions/order');
                          await deleteOrder(order.id);
                        }}>
                          <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-500">Delete</button>
                        </form>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
