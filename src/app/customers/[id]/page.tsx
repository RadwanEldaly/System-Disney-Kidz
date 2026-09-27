import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Trash2, Edit } from 'lucide-react';
import { deleteCustomer } from '@/app/actions/customer';

const prisma = new PrismaClient();

export default async function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const customer = await prisma.customer.findUnique({
    where: { id: resolvedParams.id },
    include: {
      orders: {
        orderBy: { orderDate: 'desc' },
        include: { confirmationStatus: true, shippingStatus: true }
      }
    }
  });

  if (!customer) {
    notFound();
  }

  const totalSpent = customer.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalPaid = customer.orders.reduce((sum, order) => sum + order.paidAmount, 0);
  const outstanding = totalSpent - totalPaid;

  const handleDelete = async () => {
    'use server';
    await deleteCustomer(customer.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/customers" className="text-zinc-500 hover:text-zinc-800 transition-colors">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{customer.name}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-border-subtle rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
          
          <form action={handleDelete}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium border-b border-border-subtle pb-3 mb-4">Contact Info</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-zinc-500 mb-1">Phone</p>
                <p className="font-medium text-foreground">{customer.phone}</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">Address</p>
                <p className="font-medium text-foreground">{customer.address || 'No address provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium border-b border-border-subtle pb-3 mb-4">Financial Overview</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Spent</span>
                <span className="font-medium">{totalSpent.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Outstanding</span>
                <span className={`font-semibold ${outstanding > 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {outstanding.toLocaleString()} EGP
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border-subtle bg-zinc-50/50">
              <h2 className="font-medium text-foreground">Order History</h2>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border-subtle text-zinc-500">
                <tr>
                  <th className="px-6 py-3 font-normal">Order #</th>
                  <th className="px-6 py-3 font-normal">Date</th>
                  <th className="px-6 py-3 font-normal">Total</th>
                  <th className="px-6 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {customer.orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No orders yet.</td>
                  </tr>
                ) : (
                  customer.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-blue-600">
                        <Link href={`/orders/${order.id}`}>{order.orderNumber}</Link>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{order.totalAmount.toLocaleString()} EGP</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-medium text-white" style={{ backgroundColor: order.confirmationStatus?.color || '#9ca3af' }}>
                          {order.confirmationStatus?.name}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
