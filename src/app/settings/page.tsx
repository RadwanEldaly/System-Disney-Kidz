import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function SettingsPage() {
  const settings = await prisma.systemSetting.findMany({
    orderBy: { category: 'asc' }
  });

  const orderStatuses = await prisma.orderStatusDef.findMany({
    orderBy: { orderIndex: 'asc' }
  });

  const shippingStatuses = await prisma.shippingStatusDef.findMany({
    orderBy: { orderIndex: 'asc' }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configuration Settings</h1>
        <p className="text-zinc-500 mt-1">Manage system API keys, statuses, and core parameters without changing source code.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System API Keys / Configurations */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
            <h2 className="font-semibold">System Variables</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">Add Variable</button>
          </div>
          <div className="p-6 space-y-4">
            {settings.length === 0 && <p className="text-zinc-500 text-sm">No settings found.</p>}
            {settings.map((setting) => (
              <div key={setting.id} className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <div>
                  <p className="font-medium text-sm">{setting.key} <span className="text-xs text-zinc-400 font-normal ml-2">({setting.category})</span></p>
                  <p className="text-xs text-zinc-500 mt-0.5">{setting.description}</p>
                </div>
                <div className="text-sm">
                  {setting.isSecret ? (
                    <span className="text-zinc-400 italic">••••••••••••</span>
                  ) : (
                    <span className="font-mono text-zinc-700 dark:text-zinc-300">{setting.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Definitions */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
            <h2 className="font-semibold">Order Statuses</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">Add Status</button>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {orderStatuses.map((status) => (
                <li key={status.id} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 cursor-grab">⋮⋮</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`} style={{ backgroundColor: status.color, color: '#fff' }}>
                      {status.name}
                    </span>
                    {status.isDefault && <span className="text-xs text-zinc-400">(Default)</span>}
                  </div>
                  <button className="text-zinc-400 hover:text-red-500 transition-colors">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Shipping Status Definitions */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
            <h2 className="font-semibold">Shipping Statuses</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">Add Status</button>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {shippingStatuses.map((status) => (
                <li key={status.id} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 cursor-grab">⋮⋮</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`} style={{ backgroundColor: status.color, color: '#fff' }}>
                      {status.name}
                    </span>
                    {status.isDefault && <span className="text-xs text-zinc-400">(Default)</span>}
                  </div>
                  <button className="text-zinc-400 hover:text-red-500 transition-colors">Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
