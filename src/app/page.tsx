import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Dashboard() {
  const totalOrders = await prisma.order.count();
  const waitingConfirmation = await prisma.order.count({
    where: { confirmationStatus: { name: 'Waiting Confirmation' } }
  });
  
  const allOrders = await prisma.order.findMany();
  const totalSales = allOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalPaid = allOrders.reduce((acc, order) => acc + order.paidAmount, 0);
  const outstanding = totalSales - totalPaid;

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { customer: true, confirmationStatus: true, shippingStatus: true }
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      {/* Header Area */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[28px] font-semibold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-1">What needs attention today.</p>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-[#eef5f7] border border-[#d6e6eb] rounded-xl px-5 py-4 text-[14px] text-[#4d6a77]">
        Sample workflow data is loaded so you can walk through confirmation, payment, and shipping. Remove it anytime in Settings. Connect Shopify for live store orders.
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-surface border border-border-subtle p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-[13px] text-zinc-500 font-medium mb-3">Total orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-surface border border-border-subtle p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-[13px] text-zinc-500 font-medium mb-3">New</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-surface border border-border-subtle p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-[13px] text-zinc-500 font-medium mb-3">Waiting confirmation</p>
          <p className="text-2xl font-bold">{waitingConfirmation}</p>
        </div>
        <div className="bg-surface border border-border-subtle p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-[13px] text-zinc-500 font-medium mb-3">Confirmed</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-surface border border-border-subtle p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-[13px] text-zinc-500 font-medium mb-3">Shipped</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        
        <div className="bg-surface border border-border-subtle p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-[13px] text-zinc-500 font-medium mb-3">Delivered</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-surface border border-border-subtle p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-[13px] text-zinc-500 font-medium mb-3">Cancelled</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-surface border border-border-subtle p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-[13px] text-zinc-500 font-medium mb-3">Returned</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="col-span-2 bg-surface border border-border-subtle p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex gap-8">
          <div className="flex-1">
            <p className="text-[13px] text-zinc-500 font-medium mb-3">Total sales</p>
            <p className="text-2xl font-bold">{totalSales.toLocaleString('en-US', {minimumFractionDigits: 2})} EGP</p>
          </div>
          <div className="flex-1">
            <p className="text-[13px] text-zinc-500 font-medium mb-3">Outstanding</p>
            <p className="text-2xl font-bold">{outstanding.toLocaleString('en-US', {minimumFractionDigits: 2})} EGP</p>
          </div>
        </div>
      </div>

      {/* Needs Attention Table */}
      <div className="pt-4">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="font-semibold text-[15px] text-foreground">Needs attention</h2>
          <button className="text-[13px] text-zinc-500 hover:text-zinc-800">All orders</button>
        </div>
        
        <div className="bg-surface border border-border-subtle rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="px-6 py-4 font-medium text-zinc-500 font-normal">Order</th>
                <th className="px-6 py-4 font-medium text-zinc-500 font-normal">Customer</th>
                <th className="px-6 py-4 font-medium text-zinc-500 font-normal">Phone</th>
                <th className="px-6 py-4 font-medium text-zinc-500 font-normal">Total</th>
                <th className="px-6 py-4 font-medium text-zinc-500 font-normal">Paid</th>
                <th className="px-6 py-4 font-medium text-zinc-500 font-normal text-right">Remaining</th>
                <th className="px-6 py-4 font-medium text-zinc-500 font-normal">Confirmation</th>
                <th className="px-6 py-4 font-medium text-zinc-500 font-normal">Shipping</th>
                <th className="px-6 py-4 font-medium text-zinc-500 font-normal">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-zinc-500">
                    No orders need attention.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const rem = order.totalAmount - order.paidAmount;
                  return (
                    <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                      <td className="px-6 py-4">{order.customer.name}</td>
                      <td className="px-6 py-4 text-zinc-600">{order.customer.phone}</td>
                      <td className="px-6 py-4 font-medium">{order.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})} EGP</td>
                      <td className="px-6 py-4 text-zinc-600">{order.paidAmount.toLocaleString('en-US', {minimumFractionDigits: 2})} EGP</td>
                      <td className="px-6 py-4 font-semibold text-right">{rem.toLocaleString('en-US', {minimumFractionDigits: 2})} EGP</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#f6eddd] text-[#8e6e3c]">
                          Waiting Confirmation
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#e6e2df] text-[#6b6764]">
                          Not Registered
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                        {new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
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
