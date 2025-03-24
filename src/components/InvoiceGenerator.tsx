
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, Download, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";

const InvoiceGenerator = () => {
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [fromName, setFromName] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromPhone, setFromPhone] = useState("");
  const [toName, setToName] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [items, setItems] = useState([
    { description: "", quantity: 1, price: 0 }
  ]);
  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(0);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'quantity' || field === 'price' 
      ? parseFloat(value) || 0 
      : value;
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const generateInvoicePDF = () => {
    // In a real app, this would generate a PDF
    // For now, we'll just show a success toast
    toast({
      title: "Invoice Generated",
      description: "Your invoice has been generated and is ready to download.",
    });
    
    // Simulate download after 1 second
    setTimeout(() => {
      toast({
        title: "Invoice Downloaded",
        description: "Your invoice has been downloaded successfully.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-10 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-glass mb-4">Invoice Generator</h1>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Create professional invoices for your clients. Fill in the details below and generate a PDF invoice.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 glass-panel glass-panel-dark">
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>Fill in the invoice information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Invoice Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="invoice-number">Invoice Number</Label>
                    <Input 
                      id="invoice-number" 
                      value={invoiceNumber} 
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="issue-date">Issue Date</Label>
                    <Input 
                      id="issue-date" 
                      type="date" 
                      value={issueDate} 
                      onChange={(e) => setIssueDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input 
                      id="due-date" 
                      type="date" 
                      value={dueDate} 
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* From Information */}
                <div>
                  <h3 className="text-lg font-medium mb-2">From</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="from-name">Name / Business Name</Label>
                      <Input 
                        id="from-name" 
                        value={fromName} 
                        onChange={(e) => setFromName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="from-email">Email</Label>
                      <Input 
                        id="from-email" 
                        type="email" 
                        value={fromEmail} 
                        onChange={(e) => setFromEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="from-address">Address</Label>
                      <Textarea 
                        id="from-address" 
                        value={fromAddress} 
                        onChange={(e) => setFromAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="from-phone">Phone</Label>
                      <Input 
                        id="from-phone" 
                        value={fromPhone} 
                        onChange={(e) => setFromPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* To Information */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Bill To</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="to-name">Client Name / Business</Label>
                      <Input 
                        id="to-name" 
                        value={toName} 
                        onChange={(e) => setToName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="to-email">Email</Label>
                      <Input 
                        id="to-email" 
                        type="email" 
                        value={toEmail} 
                        onChange={(e) => setToEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="to-address">Address</Label>
                      <Textarea 
                        id="to-address" 
                        value={toAddress} 
                        onChange={(e) => setToAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="to-phone">Phone</Label>
                      <Input 
                        id="to-phone" 
                        value={toPhone} 
                        onChange={(e) => setToPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Invoice Items</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addItem}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Add Item</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-3 p-3 border border-border rounded-md">
                        <div className="flex-grow">
                          <Label htmlFor={`item-description-${index}`}>Description</Label>
                          <Input
                            id={`item-description-${index}`}
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Item description"
                          />
                        </div>
                        <div className="w-full md:w-24">
                          <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                          <Input
                            id={`item-quantity-${index}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          />
                        </div>
                        <div className="w-full md:w-32">
                          <Label htmlFor={`item-price-${index}`}>Price</Label>
                          <Input
                            id={`item-price-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', e.target.value)}
                          />
                        </div>
                        <div className="w-full md:w-32 flex items-end">
                          <div className="flex justify-between w-full">
                            <div className="text-sm font-medium pt-2">
                              {formatCurrency(item.quantity * item.price)}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                              disabled={items.length <= 1}
                              className="self-end"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tax Rate */}
                <div className="w-full md:w-1/3 ml-auto">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Payment terms, bank details, additional information..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview/Summary */}
            <Card className="glass-panel glass-panel-dark">
              <CardHeader>
                <CardTitle>Invoice Summary</CardTitle>
                <CardDescription>Preview your invoice details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-foreground/70">Invoice Number</p>
                    <p className="font-medium">{invoiceNumber}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-foreground/70">Issue Date</p>
                      <p className="font-medium">{issueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground/70">Due Date</p>
                      <p className="font-medium">{dueDate}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-foreground/70 mb-1">From</p>
                    <p className="font-medium">{fromName || "Your Name"}</p>
                    {fromEmail && <p className="text-sm">{fromEmail}</p>}
                    {fromPhone && <p className="text-sm">{fromPhone}</p>}
                    {fromAddress && <p className="text-sm whitespace-pre-line">{fromAddress}</p>}
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-foreground/70 mb-1">To</p>
                    <p className="font-medium">{toName || "Client Name"}</p>
                    {toEmail && <p className="text-sm">{toEmail}</p>}
                    {toPhone && <p className="text-sm">{toPhone}</p>}
                    {toAddress && <p className="text-sm whitespace-pre-line">{toAddress}</p>}
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-foreground/70 mb-1">Summary</p>
                    <div className="flex justify-between py-1">
                      <span>Subtotal</span>
                      <span>{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Tax ({taxRate}%)</span>
                      <span>{formatCurrency(calculateTax())}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold border-t border-border mt-2">
                      <span>Total</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={generateInvoicePDF}
                  disabled={!fromName || !toName}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate Invoice PDF
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InvoiceGenerator;
