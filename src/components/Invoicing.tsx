import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, FileText, Download, Search, CheckCircle2, Eye, Receipt, Mail, Phone, MapPin, Zap } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { InventoryItem } from './Inventory';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface InvoiceItem {
  inventoryId: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export type PaymentCondition = 'Advance' | 'Payment at time' | 'Credit';

export interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  taxEnabled: boolean;
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

const TAX_RATE = 0.18; // 18% GST/Tax

const Invoicing = ({ inventory, invoices, businessDetails, onUpdateInventory, onSaveInvoice }: InvoicingProps) => {
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', address: '' });
  const [lineItems, setLineItems] = useState<InvoiceItem[]>([]);
  const [search, setSearch] = useState('');
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [paymentCondition, setPaymentCondition] = useState<PaymentCondition>('Payment at time');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const addLineItem = () => {
    setLineItems([...lineItems, { inventoryId: '', name: '', description: '', quantity: 1, price: 0 }]);
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
          description: item.description,
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

  const handleGenerate = () => {
    if (!clientInfo.name || lineItems.length === 0) {
      showError("Please provide client info and at least one item.");
      return;
    }

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

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15); // Default 15 days due date

    const newInvoice: Invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: today.toLocaleDateString(),
      dueDate: dueDate.toLocaleDateString(),
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      clientAddress: clientInfo.address,
      items: lineItems,
      subtotal: calculateSubtotal(),
      taxAmount: calculateTax(),
      total: calculateTotal(),
      taxEnabled,
      paymentCondition,
      businessDetails: { ...businessDetails }
    };

    onUpdateInventory(stockUpdates);
    onSaveInvoice(newInvoice);
    downloadPDF(newInvoice);
    
    setClientInfo({ name: '', email: '', address: '' });
    setLineItems([]);
    setTaxEnabled(false);
    setPaymentCondition('Payment at time');
    setIsPreviewOpen(false);
    showSuccess("Invoice generated and stock updated!");
  };

  const downloadPDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    
    // 1. Top-Left Branding Block
    doc.setFillColor(245, 158, 11); // Amber
    doc.roundedRect(20, 15, 15, 15, 3, 3, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text('Z', 25, 25); // Placeholder icon letter

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.businessDetails.name || 'CODENOVA ERM', 40, 26);

    // Contact List with labels (simulating icons)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`E: ${invoice.businessDetails.email || 'N/A'}`, 20, 40);
    doc.text(`P: ${invoice.businessDetails.phone || 'N/A'}`, 20, 45);
    doc.text(`A: ${invoice.businessDetails.address || 'N/A'}`, 20, 50);

    // 2. Top-Right Metadata Block
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 190, 30, { align: 'right' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${invoice.id}`, 190, 40, { align: 'right' });
    doc.text(`Date: ${invoice.date}`, 190, 45, { align: 'right' });
    doc.text(`Due Date: ${invoice.dueDate}`, 190, 50, { align: 'right' });

    // Horizontal Line
    doc.setDrawColor(230, 230, 230);
    doc.line(20, 60, 190, 60);

    // 3. Billing Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', 20, 75);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(invoice.clientName, 20, 82);
    doc.text(invoice.clientAddress, 20, 87);
    doc.text(invoice.clientEmail, 20, 92);

    // Horizontal Line
    doc.line(20, 100, 190, 100);

    // Transactional Table
    const tableData = invoice.items.map(item => [
      { content: `${item.name}\n${item.description}`, styles: { fontSize: 10 } },
      item.quantity.toString(),
      `Rs. ${(item.price * item.quantity).toFixed(2)}`
    ]);
    
    (doc as any).autoTable({
      startY: 110,
      head: [['Item', 'Qty', 'Total Price']],
      body: tableData,
      theme: 'plain',
      headStyles: { fontStyle: 'bold', textColor: [0, 0, 0], borderBottom: { width: 0.5, color: [200, 200, 200] } },
      columnStyles: {
        0: { cellWidth: 110 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' }
      },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY;

    // 4. Financial Summary
    doc.setFontSize(10);
    doc.text('Subtotal:', 140, finalY + 15);
    doc.text(`Rs. ${invoice.subtotal.toFixed(2)}`, 190, finalY + 15, { align: 'right' });
    
    if (invoice.taxEnabled) {
      doc.text('Tax (18%):', 140, finalY + 22);
      doc.text(`Rs. ${invoice.taxAmount.toFixed(2)}`, 190, finalY + 22, { align: 'right' });
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Grand Total:', 140, finalY + 32);
    doc.text(`Rs. ${invoice.total.toFixed(2)}`, 190, finalY + 32, { align: 'right' });
    
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
                  <CardTitle className="text-amber-500 text-lg">Billing Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Apply Taxes (18%)</Label>
                      <p className="text-xs text-gray-500">Toggle GST/VAT calculation</p>
                    </div>
                    <Switch 
                      checked={taxEnabled}
                      onCheckedChange={setTaxEnabled}
                      className="data-[state=checked]:bg-amber-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-400">Payment Condition</Label>
                    <Select 
                      value={paymentCondition} 
                      onValueChange={(v) => setPaymentCondition(v as PaymentCondition)}
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
                      <span className="text-white">₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    {taxEnabled && (
                      <div className="flex justify-end gap-8 text-sm text-gray-400">
                        <span>Tax (18%):</span>
                        <span className="text-white">₹{calculateTax().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-end gap-8 pt-2">
                      <span className="text-gray-400">Grand Total:</span>
                      <span className="text-3xl font-bold text-white">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="border-amber-600 text-amber-500 hover:bg-amber-600 hover:text-white px-6 py-7 rounded-xl"
                          disabled={lineItems.length === 0 || !clientInfo.name}
                        >
                          <Eye className="mr-2" size={20} />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white text-black max-w-3xl p-0 overflow-hidden rounded-2xl">
                        <div className="p-10 space-y-8">
                          {/* Header */}
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <Zap className="text-black" size={32} />
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-2xl font-bold tracking-tight">{businessDetails.name || 'CODENOVA ERM'}</h3>
                                <div className="space-y-0.5 text-sm text-gray-500">
                                  <p className="flex items-center gap-2"><Mail size={12} /> {businessDetails.email}</p>
                                  <p className="flex items-center gap-2"><Phone size={12} /> {businessDetails.phone}</p>
                                  <p className="flex items-center gap-2"><MapPin size={12} /> {businessDetails.address}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <h2 className="text-4xl font-black text-gray-900 mb-2">INVOICE</h2>
                              <div className="text-sm text-gray-500 space-y-1">
                                <p><span className="font-bold text-gray-900">Invoice #:</span> INV-PREVIEW</p>
                                <p><span className="font-bold text-gray-900">Date:</span> {new Date().toLocaleDateString()}</p>
                                <p><span className="font-bold text-gray-900">Due Date:</span> {new Date(Date.now() + 1296000000).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>

                          <div className="h-px bg-gray-100 w-full" />

                          {/* Bill To */}
                          <div>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">BILL TO</h4>
                            <div className="space-y-1">
                              <p className="text-xl font-bold">{clientInfo.name}</p>
                              <p className="text-gray-500">{clientInfo.address}</p>
                              <p className="text-gray-500">{clientInfo.email}</p>
                            </div>
                          </div>

                          <div className="h-px bg-gray-100 w-full" />

                          {/* Table */}
                          <Table>
                            <TableHeader>
                              <TableRow className="border-b-2 border-gray-900 hover:bg-transparent">
                                <TableHead className="text-gray-900 font-bold px-0">Item</TableHead>
                                <TableHead className="text-gray-900 font-bold text-center">Qty</TableHead>
                                <TableHead className="text-gray-900 font-bold text-right px-0">Total Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {lineItems.map((item, i) => (
                                <TableRow key={i} className="border-b border-gray-100 hover:bg-transparent">
                                  <TableCell className="py-4 px-0">
                                    <p className="font-bold text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                  </TableCell>
                                  <TableCell className="text-center py-4">{item.quantity}</TableCell>
                                  <TableCell className="text-right py-4 px-0 font-bold">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>

                          {/* Totals */}
                          <div className="flex justify-end">
                            <div className="w-64 space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-bold">₹{calculateSubtotal().toFixed(2)}</span>
                              </div>
                              {taxEnabled && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Tax (18%)</span>
                                  <span className="font-bold">₹{calculateTax().toFixed(2)}</span>
                                </div>
                              )}
                              <div className="h-px bg-gray-900 w-full" />
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Grand Total</span>
                                <span className="text-2xl font-black text-amber-600">₹{calculateTotal().toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-6 flex gap-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsPreviewOpen(false)}
                            className="flex-1 py-6 rounded-xl border-gray-200"
                          >
                            Back to Edit
                          </Button>
                          <Button 
                            onClick={handleGenerate}
                            className="flex-[2] bg-amber-600 hover:bg-amber-700 text-white py-6 rounded-xl shadow-lg shadow-amber-600/20"
                          >
                            Confirm & Generate Invoice
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      onClick={handleGenerate}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-7 rounded-xl text-lg shadow-lg shadow-amber-600/20"
                      disabled={lineItems.length === 0 || !clientInfo.name}
                    >
                      <CheckCircle2 className="mr-2" size={24} />
                      Generate Invoice
                    </Button>
                  </div>
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
                    <TableHead className="text-gray-400">Terms</TableHead>
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
                        <span className="text-xs bg-amber-900/20 text-amber-400 px-2 py-1 rounded-md border border-amber-900/30">
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