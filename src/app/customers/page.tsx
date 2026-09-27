import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        select: {
          totalAmount: true,
          paidAmount: true,
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-zinc-500 mt-1">Manage customer profiles and history.</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Orders</th>
                <th className="px-6 py-3 font-medium">Total Spent</th>
                <th className="px-6 py-3 font-medium">Outstanding</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const totalSpent = customer.orders.reduce((sum, order) => sum + order.totalAmount, 0);
                  const totalPaid = customer.orders.reduce((sum, order) => sum + order.paidAmount, 0);
                  const outstanding = totalSpent - totalPaid;
                  
                  return (
                    <tr key={customer.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/customers/${customer.id}`} className="font-semibold text-blue-600 hover:underline">
                          {customer.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{customer.phone}</td>
                      <td className="px-6 py-4">{customer.orders.length}</td>
                      <td className="px-6 py-4">{totalSpent} EGP</td>
                      <td className={`px-6 py-4 ${outstanding > 0 ? 'text-red-500 font-semibold' : ''}`}>{outstanding} EGP</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3">
                        <Link href={`/customers/${customer.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-500">Edit</Link>
                        <form action={async () => {
                          'use server';
                          const { deleteCustomer } = await import('@/app/actions/customer');
                          await deleteCustomer(customer.id);
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
