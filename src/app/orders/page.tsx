import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

/** Strips everything except digits and leading '+' for wa.me links */
function toWhatsAppLink(phone: string) {
  // Remove all non-digit chars except leading +
  let cleaned = phone.replace(/[^\d+]/g, '');
  // If starts with 0 (local Egyptian number), replace with country code
  if (cleaned.startsWith('0')) {
    cleaned = '20' + cleaned.slice(1);
  }
  // Remove any leading + for wa.me format
  cleaned = cleaned.replace(/^\+/, '');
  return `https://wa.me/${cleaned}`;
}

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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span>{order.customer.phone}</span>
                          <a
                            href={toWhatsAppLink(order.customer.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Chat with ${order.customer.name} on WhatsApp`}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-500 hover:bg-green-600 transition-colors shadow-sm"
                          >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </a>
                        </div>
                      </td>
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
