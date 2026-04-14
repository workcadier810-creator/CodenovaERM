import React from 'react';
import { Users, Package, FileText, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const navItems = [
    { id: 'crm', label: 'CRM', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'invoicing', label: 'Invoicing', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#121212] text-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E1E1E] border-r border-amber-900/20 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-lg shadow-lg shadow-amber-500/20">
            <Zap className="text-black" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-amber-500">Codenova<span className="text-white">ERM</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" 
                  : "text-gray-400 hover:bg-amber-900/10 hover:text-amber-400"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                activeTab === item.id ? "text-white" : "group-hover:text-amber-400"
              )} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-amber-900/10">
          <div className="bg-amber-900/10 rounded-xl p-4 border border-amber-900/20">
            <p className="text-xs text-amber-500 font-semibold uppercase tracking-wider mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">All Systems Go</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#121212] relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full -z-10" />
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;