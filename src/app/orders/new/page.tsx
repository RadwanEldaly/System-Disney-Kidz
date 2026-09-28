'use client';

import { createManualOrder } from '@/app/actions/order';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function NewOrderPage() {
  const [items, setItems] = useState([
    { id: 1, productName: '', size: '', quantity: 1, unitPrice: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), productName: '', size: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/orders" className="text-zinc-500 hover:text-zinc-800 transition-colors">
          &larr; Back to Orders
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create Manual Order</h1>
      </div>

      <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm">
        <form action={createManualOrder} className="space-y-8">
          
          {/* Customer Details */}
          <div>
            <h2 className="text-lg font-medium border-b border-border-subtle pb-2 mb-4">Customer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                <input required name="customerName" type="text" className="w-full px-3 py-2 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-[#789fb1]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number (WhatsApp)</label>
                <input required name="customerPhone" type="text" className="w-full px-3 py-2 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-[#789fb1]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Shipping Address</label>
                <textarea required name="customerAddress" className="w-full px-3 py-2 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-[#789fb1]" rows={2} />
              </div>
            </div>
          </div>

          {/* Dynamic Order Items */}
          <div>
            <div className="flex justify-between items-center border-b border-border-subtle pb-2 mb-4">
              <h2 className="text-lg font-medium">Order Items</h2>
              <button type="button" onClick={addItem} className="text-sm font-medium text-[#789fb1] hover:text-[#668b9d] flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            
            {/* Hidden input to pass the JSON items array to the Server Action */}
            <input type="hidden" name="items" value={JSON.stringify(items)} />

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-border-subtle">
                  <div className="col-span-4">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Product Name</label>
                    <input required type="text" value={item.productName} onChange={(e) => updateItem(item.id, 'productName', e.target.value)} className="w-full px-3 py-2 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-[#789fb1] text-sm" placeholder="e.g. Disney Dress" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Size / Variant</label>
                    <input type="text" value={item.size} onChange={(e) => updateItem(item.id, 'size', e.target.value)} className="w-full px-3 py-2 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-[#789fb1] text-sm" placeholder="e.g. 6Y" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Quantity</label>
                    <input required type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-[#789fb1] text-sm" />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Unit Price (EGP)</label>
                    <input required type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => { const v = parseFloat(e.target.value); updateItem(item.id, 'unitPrice', isNaN(v) ? 0 : v); }} className="w-full px-3 py-2 border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-[#789fb1] text-sm" />
                  </div>
                  <div className="col-span-1 flex justify-center pb-2">
                    <button type="button" onClick={() => removeItem(item.id)} disabled={items.length === 1} className="text-zinc-400 hover:text-red-500 disabled:opacity-50 disabled:hover:text-zinc-400 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-right pr-4 font-semibold text-lg text-foreground">
              Total: {items.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0).toLocaleString('en-US', {minimumFractionDigits: 2})} EGP
            </div>
          </div>

          <div className="pt-4 border-t border-border-subtle flex justify-end gap-3">
            <Link href="/orders" className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors">
              Cancel
            </Link>
            <button type="submit" className="bg-[#789fb1] hover:bg-[#668b9d] text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-colors">
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
