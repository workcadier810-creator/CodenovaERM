import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, Building, Phone, Mail, ArrowRight, Trash2 } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

export type CustomerStage = 
  | 'lead stage' 
  | 'suspect stage' 
  | 'prospect stage' 
  | 'qualified stage' 
  | 'closed stage' 
  | 'closed drop' 
  | 'closed lost';

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: CustomerStage;
}

interface CRMProps {
  customers: Customer[];
  onUpdate: (customers: Customer[]) => void;
}

const CRM = ({ customers, onUpdate }: CRMProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    stage: 'lead stage'
  });

  const stages: CustomerStage[] = [
    'lead stage', 
    'suspect stage', 
    'prospect stage', 
    'qualified stage', 
    'closed stage', 
    'closed drop', 
    'closed lost'
  ];

  const handleAdd = () => {
    if (!newCustomer.name || !newCustomer.company) return;
    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name!,
      company: newCustomer.company!,
      email: newCustomer.email || '',
      phone: newCustomer.phone || '',
      stage: newCustomer.stage as CustomerStage,
    };
    onUpdate([...customers, customer]);
    setNewCustomer({ stage: 'lead stage' });
    setIsAddOpen(false);
    showSuccess("Customer added successfully!");
  };

  const updateStage = (id: string, stage: CustomerStage) => {
    onUpdate(customers.map(c => c.id === id ? { ...c, stage } : c));
    showSuccess(`Customer moved to ${stage}`);
  };

  const deleteCustomer = (id: string) => {
    onUpdate(customers.filter(c => c.id !== id));
  };

  const getStageColor = (stage: CustomerStage) => {
    switch (stage) {
      case 'lead stage': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'suspect stage': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'prospect stage': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'qualified stage': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'closed stage': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'closed drop': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'closed lost': return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  const getDotColor = (stage: CustomerStage) => {
    switch (stage) {
      case 'lead stage': return 'bg-blue-500';
      case 'suspect stage': return 'bg-purple-500';
      case 'prospect stage': return 'bg-indigo-500';
      case 'qualified stage': return 'bg-amber-500';
      case 'closed stage': return 'bg-green-500';
      case 'closed drop': return 'bg-gray-500';
      case 'closed lost': return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Customer Pipeline</h2>
          <p className="text-sm md:text-base text-gray-400 mt-1">Track and manage your business relationships.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-amber-600/20 w-full sm:w-auto">
              <Plus className="mr-2" size={20} />
              New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1E1E1E] border-amber-900/20 text-white max-w-[95vw] sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-amber-500">Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={newCustomer.name || ''} 
                  onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="bg-[#121212] border-amber-900/30"
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input 
                  value={newCustomer.company || ''} 
                  onChange={e => setNewCustomer({...newCustomer, company: e.target.value})}
                  className="bg-[#121212] border-amber-900/30"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    value={newCustomer.email || ''} 
                    onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="bg-[#121212] border-amber-900/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    value={newCustomer.phone || ''} 
                    onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="bg-[#121212] border-amber-900/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Initial Stage</Label>
                <Select 
                  value={newCustomer.stage} 
                  onValueChange={v => setNewCustomer({...newCustomer, stage: v as CustomerStage})}
                >
                  <SelectTrigger className="bg-[#121212] border-amber-900/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E1E1E] border-amber-900/20 text-white">
                    {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdd} className="w-full bg-amber-600 hover:bg-amber-700 mt-4 py-6 rounded-xl">Create Customer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex overflow-x-auto pb-6 gap-4 snap-x">
        {stages.map(stage => (
          <div key={stage} className="space-y-4 min-w-[280px] md:min-w-[320px] snap-start">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-sm flex items-center gap-2 whitespace-nowrap">
                <span className={cn("w-2 h-2 rounded-full", getDotColor(stage))} />
                {stage.replace(' stage', '')}
              </h3>
              <span className="bg-[#1E1E1E] text-gray-400 text-[10px] px-2 py-0.5 rounded-full border border-amber-900/10">
                {customers.filter(c => c.stage === stage).length}
              </span>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {customers.filter(c => c.stage === stage).map(customer => (
                <Card key={customer.id} className="bg-[#1E1E1E] border-amber-900/10 hover:border-amber-500/30 transition-all group">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors truncate">{customer.name}</h4>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1 truncate">
                          <Building size={12} /> {customer.company}
                        </p>
                      </div>
                      <button 
                        onClick={() => deleteCustomer(customer.id)}
                        className="text-gray-600 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 flex items-center gap-2 truncate">
                        <Mail size={12} /> {customer.email || 'No email'}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-2 truncate">
                        <Phone size={12} /> {customer.phone || 'No phone'}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <Select 
                        value={customer.stage} 
                        onValueChange={(v) => updateStage(customer.id, v as CustomerStage)}
                      >
                        <SelectTrigger className={cn("h-8 text-[10px] px-3 border-none", getStageColor(customer.stage))}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1E1E1E] border-amber-900/20 text-white">
                          {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      
                      {stages.indexOf(stage) < 4 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-[10px] text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 w-full"
                          onClick={() => updateStage(customer.id, stages[stages.indexOf(stage) + 1])}
                        >
                          Advance <ArrowRight size={12} className="ml-1" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {customers.filter(c => c.stage === stage).length === 0 && (
                <div className="border-2 border-dashed border-amber-900/10 rounded-xl p-8 text-center">
                  <p className="text-gray-600 text-xs italic">Empty</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CRM;