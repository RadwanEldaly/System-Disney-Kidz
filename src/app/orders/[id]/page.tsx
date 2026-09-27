import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { deleteOrder, updateOrderStatus, addOrderPayment } from '@/app/actions/order';
import { Trash2, Edit, CreditCard, Banknote, Wallet } from 'lucide-react';

const prisma = new PrismaClient();

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      customer: true,
      items: true,
      payments: true,
      confirmationStatus: true,
      shippingStatus: true,
    }
  });

  const allStatuses = await prisma.orderStatusDef.findMany({
    orderBy: { orderIndex: 'asc' }
  });

  if (!order) {
    notFound();
  }

  const remaining = order.totalAmount - order.paidAmount;

  // Server action wrapper for the delete button
  const handleDelete = async () => {
    'use server';
    await deleteOrder(order.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders" className="text-zinc-500 hover:text-zinc-800 transition-colors">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Order {order.orderNumber}</h1>
          <span className="inline-flex px-2.5 py-1 rounded-md text-[12px] font-medium text-white" style={{ backgroundColor: order.confirmationStatus?.color || '#9ca3af' }}>
            {order.confirmationStatus?.name}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-border-subtle rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
            <Edit className="w-4 h-4" /> Edit Order
          </button>
          
          <form action={handleDelete}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Customer & Items */}
        <div className="col-span-2 space-y-6">
          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium border-b border-border-subtle pb-3 mb-4">Customer Info</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-zinc-500 mb-1">Name</p>
                <p className="font-medium text-foreground">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">Phone</p>
                <p className="font-medium text-foreground">{order.customer.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-zinc-500 mb-1">Address</p>
                <p className="font-medium text-foreground">{order.customer.address}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border-subtle bg-zinc-50/50">
              <h2 className="font-medium text-foreground">Order Items</h2>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border-subtle text-zinc-500">
                <tr>
                  <th className="px-6 py-3 font-normal">Product</th>
                  <th className="px-6 py-3 font-normal">Size</th>
                  <th className="px-6 py-3 font-normal">Qty</th>
                  <th className="px-6 py-3 font-normal text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 font-medium">{item.productNameSnapshot}</td>
                    <td className="px-6 py-4 text-zinc-600">{item.sizeSnapshot || '-'}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-medium">{item.totalPrice.toLocaleString()} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Financials & Shipping */}
        <div className="space-y-6">
          
          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium border-b border-border-subtle pb-3 mb-4">Confirmation Status</h2>
            <form action={updateOrderStatus} className="flex gap-2">
              <input type="hidden" name="orderId" value={order.id} />
              <select name="statusId" defaultValue={order.confirmationStatusId || ''} className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-zinc-50 dark:bg-zinc-800">
                {allStatuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
              <button type="submit" className="bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Update
              </button>
            </form>
          </div>

          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium border-b border-border-subtle pb-3 mb-4">Payment Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Amount</span>
                <span className="font-medium">{order.totalAmount.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Paid Amount</span>
                <span className="font-medium text-green-600">{order.paidAmount.toLocaleString()} EGP</span>
              </div>
              
              {/* Payment History */}
              {order.payments.length > 0 && (
                <div className="py-2 space-y-2 border-y border-border-subtle mt-2">
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Payment History</p>
                  {order.payments.map(payment => (
                    <div key={payment.id} className="flex justify-between items-center text-xs bg-zinc-50 dark:bg-zinc-800 p-2 rounded">
                      <div className="flex items-center gap-1.5">
                        {payment.paymentMethod === 'Cash' && <Banknote className="w-3.5 h-3.5 text-zinc-400" />}
                        {payment.paymentMethod === 'Visa' && <CreditCard className="w-3.5 h-3.5 text-zinc-400" />}
                        {(payment.paymentMethod === 'Wallet' || payment.paymentMethod === 'Instapay') && <Wallet className="w-3.5 h-3.5 text-zinc-400" />}
                        <span className="text-zinc-600">{payment.paymentMethod}</span>
                      </div>
                      <span className="font-medium">+{payment.amount} EGP</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex justify-between font-semibold">
                <span>Remaining</span>
                <span className={remaining > 0 ? 'text-red-500' : ''}>{remaining.toLocaleString()} EGP</span>
              </div>

              {remaining > 0 && (
                <form action={addOrderPayment} className="mt-4 pt-4 border-t border-border-subtle space-y-3">
                  <input type="hidden" name="orderId" value={order.id} />
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Record New Payment</label>
                    <input type="number" name="amount" defaultValue={remaining} max={remaining} min={0.01} step="0.01" className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-zinc-50 dark:bg-zinc-800" required />
                  </div>
                  <select name="paymentMethod" className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm bg-zinc-50 dark:bg-zinc-800">
                    <option value="Cash">Cash (COD)</option>
                    <option value="Visa">Visa / Credit Card</option>
                    <option value="Wallet">Vodafone Cash / Wallet</option>
                    <option value="Instapay">Instapay</option>
                  </select>
                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Add Payment
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium border-b border-border-subtle pb-3 mb-4">Shipping Info</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-zinc-500 mb-1">Status</p>
                <span className="inline-flex px-2.5 py-1 rounded-md text-[12px] font-medium text-white" style={{ backgroundColor: order.shippingStatus?.color || '#9ca3af' }}>
                  {order.shippingStatus?.name}
                </span>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">Bosta Tracking Number</p>
                <p className="font-medium text-foreground">{order.trackingNumber || 'Not registered yet'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
