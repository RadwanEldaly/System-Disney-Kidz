import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { variants: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-zinc-500 mt-1">Manage synchronized catalog from Shopify.</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">Shopify ID</th>
                <th className="px-6 py-3 font-medium">Variants</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    No products found. Catalog has not been synced.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-zinc-500 font-mono">{product.shopifyProductId || '-'}</td>
                    <td className="px-6 py-4">{product.variants.length}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-500">Edit</button>
                      <form action={async () => {
                        'use server';
                        const { deleteProduct } = await import('@/app/actions/product');
                        await deleteProduct(product.id);
                      }}>
                        <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-500">Delete</button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
