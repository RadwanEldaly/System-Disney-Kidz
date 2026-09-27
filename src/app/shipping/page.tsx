import { PrismaClient } from '@prisma/client';
import { PackageSearch, Truck } from 'lucide-react';

const prisma = new PrismaClient();

export default async function ShippingPage() {
  const allOrders = await prisma.order.findMany({
    include: { customer: true, shippingStatus: true }
  });

  // Filter orders that need to be shipped (Not Registered or Registered)
  const pendingShipping = allOrders.filter(o => o.shippingStatus?.name === 'Not Registered' || o.shippingStatus?.name === 'Registered with Bosta');
  const inTransit = allOrders.filter(o => o.shippingStatus?.name === 'Shipped' || o.shippingStatus?.name === 'Out for Delivery');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Shipping Management</h1>
        <p className="text-zinc-500 mt-1">Manage Bosta shipments, print waybills, and track deliveries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <PackageSearch className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Pending Registration</p>
            <p className="text-2xl font-bold">{pendingShipping.length}</p>
          </div>
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">In Transit</p>
            <p className="text-2xl font-bold">{inTransit.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border-subtle rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-zinc-50/50">
          <h2 className="font-semibold text-[15px]">Ready for Shipping</h2>
          <button className="text-sm font-medium text-[#789fb1] hover:text-[#668b9d]">
            Bulk Register to Bosta
          </button>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50/50 border-b border-border-subtle">
            <tr>
              <th className="px-6 py-3 font-medium text-zinc-500">Order #</th>
              <th className="px-6 py-3 font-medium text-zinc-500">Customer</th>
              <th className="px-6 py-3 font-medium text-zinc-500">City/Address</th>
              <th className="px-6 py-3 font-medium text-zinc-500">COD Amount</th>
              <th className="px-6 py-3 font-medium text-zinc-500">Status</th>
              <th className="px-6 py-3 font-medium text-zinc-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {pendingShipping.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  No orders pending shipment registration.
                </td>
              </tr>
            ) : (
              pendingShipping.map((order) => {
                const remaining = order.totalAmount - order.paidAmount;
                return (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-4">{order.customer.name}</td>
                    <td className="px-6 py-4 text-zinc-600 truncate max-w-[200px]">{order.customer.address}</td>
                    <td className="px-6 py-4 font-medium">{remaining > 0 ? `${remaining} EGP` : 'Prepaid'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-medium" style={{ backgroundColor: order.shippingStatus?.color, color: '#fff' }}>
                        {order.shippingStatus?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm text-blue-600 hover:underline">Register Waybill</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
