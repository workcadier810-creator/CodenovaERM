import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, FileText, Download, Search, CheckCircle2, Eye, CreditCard } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { InventoryItem } from './Inventory';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface InvoiceItem {
  inventoryId: string;
  name: string;
  quantity: number;
  price: number;
}

export type PaymentCondition = 'Advance' | 'Payment at time' | 'Credit';

export interface Invoice {
  id: string;
  date: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxEnabled: boolean;
  taxAmount: number;
  total: number;
  paymentCondition: PaymentCondition;
  businessDetails: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
}

interface InvoicingProps {
  inventory: InventoryItem[];
  invoices: Invoice[];
  businessDetails: Invoice['businessDetails'];
  onUpdateInventory: (items: InventoryItem[]) => void;
  onSaveInvoice: (invoice: Invoice) => void;
}

const Invoicing = ({ inventory, invoices, businessDetails, onUpdateInventory, onSaveInvoice }: InvoicingProps) => {
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', address: '' });
  const [lineItems, setLineItems] = useState<InvoiceItem[]>([]);
  const [search, setSearch] = useState('');
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [paymentCondition, setPaymentCondition] = useState<PaymentCondition>('Payment at time');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const TAX_RATE = 0.18; // 18% GST/Tax

  const addLineItem = () => {
    setLineItems([...lineItems, { inventoryId: '', name: '', quantity: 1, price: 0 }]);
  };

  const updateLineItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...lineItems];
    if (field === 'inventoryId') {
      const item = inventory.find(i => i.id === value);
      if (item) {
        newItems[index] = {
          ...newItems[index],
          inventoryId: item.id,
          name: item.name,
          price: item.price
        };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setLineItems(newItems);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return taxEnabled ? calculateSubtotal() * TAX_RATE : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleFinalize = () => {
    if (!clientInfo.name || lineItems.length === 0) {
      showError("Please provide client info and at least one item.");
      return;
    }

    // Check stock
    const stockUpdates: InventoryItem[] = [...inventory];
    let shortage = false;

    for (const lineItem of lineItems) {
      const invItem = stockUpdates.find(i => i.id === lineItem.inventoryId);
      if (!invItem || invItem.stock < lineItem.quantity) {
        shortage = true;
        showError(`Resource Shortage: Not enough stock for ${lineItem.name}`);
        break;
      }
      invItem.stock -= lineItem.quantity;
    }

    if (shortage) return;

    const subtotal = calculateSubtotal();
    const taxAmount = calculateTax();
    const total = calculateTotal();

    const newInvoice: Invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString(),
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      clientAddress: clientInfo.address,
      items: lineItems,
      subtotal,
      taxEnabled,
      taxAmount,
      total,
      paymentCondition,
      businessDetails: { ...businessDetails }
    };

    onUpdateInventory(stockUpdates);
    onSaveInvoice(newInvoice);
    downloadPDF(newInvoice);
    
    // Reset form
    setClientInfo({ name: '', email: '', address: '' });
    setLineItems([]);
    setTaxEnabled(false);
    setPaymentCondition('Payment at time');
    setIsPreviewOpen(false);
    showSuccess("Invoice generated and stock updated!");
  };

  const downloadPDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(245, 158, 11); // Amber
    doc.setFontSize(24);
    doc.text(invoice.businessDetails.name.toUpperCase() || 'CODENOVA ERM', 20, 25);
    
think
The user wants me to continue the code I was writing in the previous turn. I was in the middle of a `<dyad-write>` block for `src/components/Invoicing.tsx`.

Looking at the previous output:
```typescript
    doc.setTextColor(245, 158, 11); // Amber
    doc.setFontSize(24);
    doc.text(invoice.businessDetails.name.toUpperCase() || 'CODENOVA ERM', 20, 25);
    
```
I need to finish the `downloadPDF` function, the rest of the component, and close the tags.

Plan:
1. Complete the `downloadPDF` function logic (adding tax, payment conditions, etc).
2. Complete the JSX for the `Invoicing` component (adding the tax switch, payment condition select, and the preview dialog).
3. Close the `<dyad-write>` tag.
4. Add `<dyad-chat-summary>`.

Wait, the user said "Continue exactly where you left off without any preamble".
However, I must use `<dyad-write>` for the *entire* file as per the system instructions: "Only use ONE <dyad-write> block per file that you write!" and "do NOT be lazy and ALWAYS write the entire file. It needs to be a complete file."

So I will rewrite the entire `src/components/Invoicing.tsx` file with the requested features.

Features to include:
- Tax toggle (Switch).
- Payment conditions (Advance, Payment at time, Credit).
- Preview before saving (Dialog).
- Updated PDF generation to include these fields.

Let's write the full file.<dyad-write path="src/components/Invoicing.tsx" description="Completing the Invoicing component with tax toggle, payment conditions, and preview functionality.">
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, FileText, Download, Search, CheckCircle2, Eye, CreditCard, ReceiptText } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { InventoryItem } from './Inventory';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface InvoiceItem {
  inventoryId: string;
  name: string;
  quantity: number;
  price: number;
}

export type PaymentCondition = 'Advance' | 'Payment at time' | 'Credit';

export interface Invoice {
  id: string;
  date: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxEnabled: boolean;
  taxAmount: number;
  total: number;
  paymentCondition: PaymentCondition;
  businessDetails: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
}

interface InvoicingProps {
  inventory: InventoryItem[];
  invoices: Invoice[];
  businessDetails: Invoice['businessDetails'];
  onUpdateInventory: (items: InventoryItem[]) => void;
  onSaveInvoice: (invoice: Invoice) => void;
}

const Invoicing = ({ inventory, invoices, businessDetails, onUpdateInventory, onSaveInvoice }: InvoicingProps) => {
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', address: '' });
  const [lineItems, setLineItems] = useState<InvoiceItem[]>([]);
  const [search, setSearch] = useState('');
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [paymentCondition, setPaymentCondition] = useState<PaymentCondition>('Payment at time');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const TAX_RATE = 0.18; // 18% Tax

  const addLineItem = () => {
    setLineItems([...lineItems, { inventoryId: '', name: '', quantity: 1, price: 0 }]);
  };

  const updateLineItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...lineItems];
    if (field === 'inventoryId') {
      const item = inventory.find(i => i.id === value);
      if (item) {
        newItems[index] = {
          ...newItems[index],
          inventoryId: item.id,
          name: item.name,
          price: item.price
        };
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setLineItems(newItems);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return taxEnabled ? calculateSubtotal() * TAX_RATE : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleFinalize = () => {
    if (!clientInfo.name || lineItems.length === 0) {
      showError("Please provide client info and at least one item.");
      return;
    }

    // Check stock
    const stockUpdates: InventoryItem[] = [...inventory];
    let shortage = false;

    for (const lineItem of lineItems) {
      const invItem = stockUpdates.find(i => i.id === lineItem.inventoryId);
      if (!invItem || invItem.stock < lineItem.quantity) {
        shortage = true;
        showError(`Resource Shortage: Not enough stock for ${lineItem.name}`);
        break;
      }
      invItem.stock -= lineItem.quantity;
    }

    if (shortage) return;

    const subtotal = calculateSubtotal();
    const taxAmount = calculateTax();
    const total = calculateTotal();

    const newInvoice: Invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString(),
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      clientAddress: clientInfo.address,
      items: lineItems,
      subtotal,
      taxEnabled,
      taxAmount,
      total,
      paymentCondition,
      businessDetails: { ...businessDetails }
    };

    onUpdateInventory(stockUpdates);
    onSaveInvoice(newInvoice);
    downloadPDF(newInvoice);
    
    // Reset form
    setClientInfo({ name: '', email: '', address: '' });
    setLineItems([]);
    setTaxEnabled(false);
    setPaymentCondition('Payment at time');
    setIsPreviewOpen(false);
    showSuccess("Invoice generated and stock updated!");
  };

  const downloadPDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(245, 158, 11); // Amber
    doc.setFontSize(24);
    doc.text(invoice.businessDetails.name.toUpperCase() || 'CODENOVA ERM', 20, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('INVOICE', 170, 25);
    
    // Business Info
    doc.setTextColor(100, 100, 100);
    doc.text(invoice.businessDetails.address || 'No Address Set', 20, 50);
    doc.text(invoice.businessDetails.phone || 'No Phone Set', 20, 55);
    doc.text(invoice.businessDetails.email || 'No Email Set', 20, 60);
    
    // Invoice Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.id}`, 140, 50);
    doc.text(`Date: ${invoice.date}`, 140, 57);
    doc.text(`Payment: ${invoice.paymentCondition}`, 140, 64);
    
    // Client Info
    doc.setFontSize(14);
    doc.text('BILL TO:', 20, 80);
    doc.setFontSize(11);
    doc.text(invoice.clientName, 20, 87);
    doc.text(invoice.clientAddress || 'No Address', 20, 94);
    doc.text(invoice.clientEmail || 'No Email', 20, 101);
    
    // Table
    const tableData = invoice.items.map(item => [
      item.name,
      item.quantity.toString(),
      `Rs. ${item.price.toFixed(2)}`,
      `Rs. ${(item.price * item.quantity).toFixed(2)}`
    ]);
    
    (doc as any).autoTable({
      startY: 115,
      head: [['Item Description', 'Qty', 'Unit Price', 'Total']],
      body: tableData,
      headStyles: { fillColor: [234, 88, 12], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY;
    
    // Totals
    doc.setFontSize(11);
    doc.text(`Subtotal: Rs. ${invoice.subtotal.toFixed(2)}`, 140, finalY + 15);
    if (invoice.taxEnabled) {
      doc.text(`Tax (18%): Rs. ${invoice.taxAmount.toFixed(2)}`, 140, finalY + 22);
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Grand Total: Rs. ${invoice.total.toFixed(2)}`, 140, finalY + 32);
    
    doc.save(`${invoice.id}_${invoice.clientName.replace(/\s+/g, '_')}.pdf`);
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.clientName.toLowerCase().includes(search.toLowerCase()) || 
    inv.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white">Invoicing & Billing</h2>
        <p className="text-gray-400 mt-1">Generate professional invoices and track payment history.</p>
      </header>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="bg-[#1E1E1E] border border-amber-900/20 p-1 rounded-xl mb-6">
          <TabsTrigger value="create" className="rounded-lg data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            Create Invoice
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            Invoice History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client Info & Settings */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="bg-[#1E1E1E] border-amber-900/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-amber-500 text-lg">Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">Client Name</Label>
                    <Input 
                      value={clientInfo.name}
                      onChange={e => setClientInfo({...clientInfo, name: e.target.value})}
                      className="bg-[#121212] border-amber-900/30 text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Client Email</Label>
                    <Input 
                      value={clientInfo.email}
                      onChange={e => setClientInfo({...clientInfo, email: e.target.value})}
                      className="bg-[#121212] border-amber-900/30 text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Billing Address</Label>
                    <Input 
                      value={clientInfo.address}
                      onChange={e => setClientInfo({...clientInfo, address: e.target.value})}
                      className="bg-[#121212] border-amber-900/30 text-white"
                      placeholder="456 Client St, City, State"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#1E1E1E] border-amber-900/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-amber-500 text-lg">Billing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-300">Apply Tax (18%)</Label>
                      <p className="text-xs text-gray-500">Include GST/Tax in total</p>
                    </div>
                    <Switch 
                      checked={taxEnabled} 
                      onCheckedChange={setTaxEnabled}
                      className="data-[state=checked]:bg-amber-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Payment Condition</Label>
                    <Select 
                      value={paymentCondition} 
                      onValueChange={v => setPaymentCondition(v as PaymentCondition)}
                    >
                      <SelectTrigger className="bg-[#121212] border-amber-900/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1E1E1E] border-amber-900/20 text-white">
                        <SelectItem value="Advance">Advance</SelectItem>
                        <SelectItem value="Payment at time">Payment at time</SelectItem>
                        <SelectItem value="Credit">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Line Items */}
            <Card className="bg-[#1E1E1E] border-amber-900/20 shadow-xl lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-amber-500 text-lg">Invoice Items</CardTitle>
                <Button onClick={addLineItem} variant="outline" className="border-amber-600 text-amber-500 hover:bg-amber-600 hover:text-white">
                  <Plus size={16} className="mr-2" /> Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-amber-900/20">
                      <TableHead className="text-gray-400">Resource</TableHead>
                      <TableHead className="text-gray-400 w-24">Qty</TableHead>
                      <TableHead className="text-gray-400 w-32">Price</TableHead>
                      <TableHead className="text-gray-400 w-32">Total</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={index} className="border-amber-900/10">
                        <TableCell>
                          <Select 
                            value={item.inventoryId} 
                            onValueChange={v => updateLineItem(index, 'inventoryId', v)}
                          >
                            <SelectTrigger className="bg-[#121212] border-amber-900/30 text-white">
                              <SelectValue placeholder="Select item..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1E1E1E] border-amber-900/20 text-white">
                              {inventory.map(inv => (
                                <SelectItem key={inv.id} value={inv.id} disabled={inv.stock <= 0}>
                                  {inv.name} ({inv.stock} in stock)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={item.quantity}
                            onChange={e => updateLineItem(index, 'quantity', parseInt(e.target.value))}
                            className="bg-[#121212] border-amber-900/30 text-white"
                          />
                        </TableCell>
                        <TableCell className="text-white font-mono">
                          ₹{item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-amber-500 font-bold font-mono">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeLineItem(index)}
                            className="text-gray-600 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {lineItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-gray-500 italic">
                          No items added yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <div className="mt-8 flex flex-col items-end gap-4">
                  <div className="text-right space-y-1">
                    <div className="flex justify-end gap-8 text-sm text-gray-400">
                      <span>Subtotal:</span>
                      <span>₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    {taxEnabled && (
                      <div className="flex justify-end gap-8 text-sm text-amber-500/70">
                        <span>Tax (18%):</span>
                        <span>₹{calculateTax().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-end gap-8 pt-2">
                      <span className="text-gray-400">Grand Total:</span>
                      <span className="text-4xl font-bold text-white">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        disabled={!clientInfo.name || lineItems.length === 0}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-7 rounded-xl text-lg shadow-lg shadow-amber-600/20"
                      >
                        <Eye className="mr-2" size={24} />
                        Preview Invoice
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1E1E1E] border-amber-900/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-amber-500 flex items-center gap-2">
                          <ReceiptText size={20} />
                          Invoice Preview
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6 py-4 border-y border-amber-900/10">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-amber-500 font-bold text-xl">{businessDetails.name || 'CODENOVA ERM'}</h4>
                            <p className="text-xs text-gray-400">{businessDetails.address}</p>
                            <p className="text-xs text-gray-400">{businessDetails.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-white">INVOICE</p>
                            <p className="text-xs text-gray-400">Date: {new Date().toLocaleDateString()}</p>
                            <p className="text-xs text-amber-500 font-bold">Payment: {paymentCondition}</p>
                          </div>
                        </div>

                        <div className="bg-[#121212] p-4 rounded-lg border border-amber-900/10">
                          <p className="text-[10px] text-amber-500 font-bold uppercase mb-1">Bill To</p>
                          <p className="font-bold text-white">{clientInfo.name}</p>
                          <p className="text-xs text-gray-400">{clientInfo.address}</p>
                          <p className="text-xs text-gray-400">{clientInfo.email}</p>
                        </div>

                        <Table>
                          <TableHeader>
                            <TableRow className="border-amber-900/10">
                              <TableHead className="text-[10px] text-gray-500">Item</TableHead>
                              <TableHead className="text-[10px] text-gray-500 text-right">Qty</TableHead>
                              <TableHead className="text-[10px] text-gray-500 text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {lineItems.map((item, i) => (
                              <TableRow key={i} className="border-amber-900/5">
                                <TableCell className="text-xs text-gray-300">{item.name}</TableCell>
                                <TableCell className="text-xs text-gray-300 text-right">{item.quantity}</TableCell>
                                <TableCell className="text-xs text-white text-right font-mono">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        <div className="space-y-1 text-right">
                          <p className="text-xs text-gray-500">Subtotal: ₹{calculateSubtotal().toFixed(2)}</p>
                          {taxEnabled && <p className="text-xs text-amber-500/70">Tax (18%): ₹{calculateTax().toFixed(2)}</p>}
                          <p className="text-lg font-bold text-white pt-2">Total: ₹{calculateTotal().toFixed(2)}</p>
                        </div>
                      </div>

                      <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsPreviewOpen(false)} className="text-gray-400 hover:text-white">
                          Edit Details
                        </Button>
                        <Button onClick={handleFinalize} className="bg-amber-600 hover:bg-amber-700 text-white">
                          <CheckCircle2 className="mr-2" size={18} />
                          Confirm & Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-[#1E1E1E] border-amber-900/20 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-amber-500">Invoice History</CardTitle>
                <CardDescription className="text-gray-400">View and download past transactions.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                <Input 
                  placeholder="Search invoices..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-[#121212] border-amber-900/30 pl-10 text-white"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-amber-900/20">
                    <TableHead className="text-gray-400">Invoice ID</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Client</TableHead>
                    <TableHead className="text-gray-400">Payment</TableHead>
                    <TableHead className="text-gray-400">Total</TableHead>
                    <TableHead className="text-gray-400 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((inv) => (
                    <TableRow key={inv.id} className="border-amber-900/10 hover:bg-amber-900/5">
                      <TableCell className="font-mono text-amber-500 font-bold">{inv.id}</TableCell>
                      <TableCell className="text-gray-300">{inv.date}</TableCell>
                      <TableCell>
                        <div className="text-white font-medium">{inv.clientName}</div>
                        <div className="text-xs text-gray-500">{inv.clientEmail}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-amber-900/20 text-amber-400 border border-amber-900/30">
                          {inv.paymentCondition}
                        </span>
                      </TableCell>
                      <TableCell className="text-white font-bold">₹{inv.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-amber-900/30 text-amber-500 hover:bg-amber-600 hover:text-white"
                          onClick={() => downloadPDF(inv)}
                        >
                          <Download size={14} className="mr-2" /> PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-gray-500 italic">
                        No invoices found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Invoicing;