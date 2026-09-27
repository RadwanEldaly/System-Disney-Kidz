'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Truck, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/shipping', label: 'Shipping', icon: Truck },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-[260px] bg-surface dark:bg-surface border-r border-border-subtle flex flex-col h-full fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-foreground">
          Disney Kidz
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Sales Management</p>
      </div>
      
      <nav className="flex-1 px-4 flex flex-col gap-1.5 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                active 
                  ? 'text-foreground bg-[#eff4f8] dark:bg-blue-900/20' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400'}`} />
              {item.label}
            </Link>
          );
        })}

        <Link 
          href="/settings" 
          className={`px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 mt-4 transition-colors ${
            isActive('/settings')
              ? 'text-foreground bg-[#eff4f8] dark:bg-blue-900/20' 
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Settings className={`w-4 h-4 ${isActive('/settings') ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400'}`} />
          Settings
        </Link>
      </nav>
    </aside>
  );
}
