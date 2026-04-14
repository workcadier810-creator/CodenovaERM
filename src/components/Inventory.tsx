import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Package, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
}

interface InventoryProps {
  items: InventoryItem[];
  onUpdate: (items: InventoryItem[]) => void;
}

const Inventory = ({ items, onUpdate }: InventoryProps) => {
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    price: 0,
    stock: 0
  });

  const handleSave = () => {
    if (!newItem.name || !newItem.sku) return;
    
    if (editingItem) {
      onUpdate(items.map(i => i.id === editingItem.id ? { ...editingItem, ...newItem } as InventoryItem : i));
      showSuccess("Item updated successfully!");
    } else {
      const item: InventoryItem = {
        id: Date.now().toString(),
        name: newItem.name!,
        sku: newItem.sku!,
        description: newItem.description || '',
        price: Number(newItem.price) || 0,
        stock: Number(newItem.stock) || 0,
      };
      onUpdate([...items, item]);
      showSuccess("Item added to inventory!");
    }
    
    setNewItem({ price: 0, stock: 0 });
    setEditingItem(null);
    setIsAddOpen(false);
  };

  const deleteItem = (id: string) => {
    onUpdate(items.filter(i => i.id !== id));
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Resource Hub</h2>
          <p className="text-gray-400 mt-1">Manage your parts, products, and stock levels.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
            <Input 
              placeholder="Search SKU or Name..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[#1E1E1E] border-amber-900/30 pl-10 text-white"
            />
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) {
              setEditingItem(null);
              setNewItem({ price: 0, stock: 0 });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-amber-600/20">
                <Plus className="mr-2" size={20} />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1E1E1E] border-amber-900/20 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-amber-500">{editingItem ? 'Edit Item' : 'Add New Resource'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Item Name</Label>
                    <Input 
                      value={newItem.name || ''} 
                      onChange={e => setNewItem({...newItem, name: e.target.value})}
                      className="bg-[#121212] border-amber-900/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unique SKU</Label>
                    <Input 
                      value={newItem.sku || ''} 
                      onChange={e => setNewItem({...newItem, sku: e.target.value})}
                      className="bg-[#121212] border-amber-900/30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input 
                    value={newItem.description || ''} 
                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                    className="bg-[#121212] border-amber-900/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unit Price ($)</Label>
                    <Input 
                      type="number"
                      value={newItem.price} 
                      onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                      className="bg-[#121212] border-amber-900/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock Quantity</Label>
                    <Input 
                      type="number"
                      value={newItem.stock} 
                      onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value)})}
                      className="bg-[#121212] border-amber-900/30"
                    />
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full bg-amber-600 hover:bg-amber-700 mt-4">
                  {editingItem ? 'Update Item' : 'Add to Inventory'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <Card className="bg-[#1E1E1E] border-amber-900/20 overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-[#121212]">
            <TableRow className="border-amber-900/20 hover:bg-transparent">
              <TableHead className="text-amber-500 font-bold">SKU</TableHead>
              <TableHead className="text-amber-500 font-bold">Item Name</TableHead>
              <TableHead className="text-amber-500 font-bold">Price</TableHead>
              <TableHead className="text-amber-500 font-bold">Stock</TableHead>
              <TableHead className="text-amber-500 font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id} className="border-amber-900/10 hover:bg-amber-900/5 transition-colors group">
                <TableCell className="font-mono text-xs text-gray-400">{item.sku}</TableCell>
                <TableCell>
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.description}</div>
                </TableCell>
                <TableCell className="text-white">${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-xs font-bold",
                      item.stock <= 5 ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    )}>
                      {item.stock} units
                    </span>
                    {item.stock <= 5 && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-400 hover:text-amber-500 hover:bg-amber-500/10"
                      onClick={() => {
                        setEditingItem(item);
                        setNewItem(item);
                        setIsAddOpen(true);
                      }}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-500 italic">
                  No items found in inventory.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Inventory;