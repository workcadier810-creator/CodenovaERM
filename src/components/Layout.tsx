import React, { useState } from 'react';
import { Users, Package, FileText, Settings, Zap, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'crm', label: 'CRM', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'invoicing', label: 'Invoicing', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
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
            onClick={() => {
              setActiveTab(item.id);
              setIsOpen(false);
            }}
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
    </div>
  );

  return (
    <div className="flex h-screen bg-[#121212] text-gray-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 bg-[#1E1E1E] border-r border-amber-900/20 flex flex-col">
          <NavContent />
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#121212] relative">
        {/* Mobile Header */}
        {isMobile && (
          <header className="sticky top-0 z-30 bg-[#1E1E1E]/80 backdrop-blur-md border-b border-amber-900/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-500" size={20} />
              <span className="font-bold text-amber-500">Codenova<span className="text-white">ERM</span></span>
            </div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-amber-500">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 bg-[#1E1E1E] border-amber-900/20 w-72">
                <NavContent />
              </SheetContent>
            </Sheet>
          </header>
        )}

        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-amber-600/5 blur-[80px] md:blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-orange-600/5 blur-[80px] md:blur-[120px] rounded-full -z-10" />
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;