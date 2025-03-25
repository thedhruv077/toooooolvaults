
import { useState, useEffect, useRef } from "react";
import { Receipt, Plus, Trash2, Download, FileText, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { useIsMobile } from "@/hooks/use-mobile";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

const gstRates = [
  { value: "0", label: "0% (No GST)" },
  { value: "3", label: "3% (Special Rate)" },
  { value: "5", label: "5% (Standard Rate)" },
  { value: "12", label: "12% (Standard Rate)" },
  { value: "18", label: "18% (Standard Rate)" },
  { value: "28", label: "28% (Luxury Rate)" },
  { value: "custom", label: "Custom Rate" }
];

const InvoiceMaker = () => {
  const isMobile = useIsMobile();
  const invoiceContentRef = useRef<HTMLDivElement>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>(`INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`);
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });
  
  const [companyName, setCompanyName] = useState<string>("");
  const [companyAddress, setCompanyAddress] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [clientAddress, setClientAddress] = useState<string>("");
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, price: 0 }
  ]);

  const [notes, setNotes] = useState<string>("");
  const [gstRateType, setGstRateType] = useState<string>("18");
  const [customGstRate, setCustomGstRate] = useState<string>(""); 
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        price: 0
      }
    ]);
  };
  
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      toast({ title: "Info", description: "Invoice must have at least one item" });
    }
  };
  
  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };
  
  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };
  
  const getEffectiveGstRate = () => {
    if (gstRateType === "custom") {
      return parseFloat(customGstRate) || 0;
    }
    return parseFloat(gstRateType);
  };
  
  const calculateTax = () => {
    return calculateSubtotal() * (getEffectiveGstRate() / 100);
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };
  
  const handleGenerateInvoice = async () => {
    if (!companyName || !clientName) {
      toast({ 
        title: "Error", 
        description: "Please enter company and client information", 
        variant: "destructive" 
      });
      return;
    }
    
    if (items.some(item => !item.description)) {
      toast({ 
        title: "Error", 
        description: "Please fill in all item descriptions", 
        variant: "destructive" 
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Create a new PDF with A4 format
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      // Set appropriate scaling based on device
      const scale = isMobile ? 2 : 3;

      if (!invoiceContentRef.current) {
        throw new Error('Invoice element not found');
      }

      // Clone the invoice element to avoid modifying the visible content
      const invoiceClone = invoiceContentRef.current.cloneNode(true) as HTMLElement;
      const tempContainer = document.createElement('div');
      tempContainer.appendChild(invoiceClone);
      document.body.appendChild(tempContainer);
      
      // Set explicit width for better rendering
      invoiceClone.style.width = '210mm'; // A4 width
      invoiceClone.style.padding = '10mm';
      invoiceClone.style.backgroundColor = 'white';
      invoiceClone.style.color = 'black';

      // Improve rendering quality with html2canvas options
      const canvas = await html2canvas(invoiceClone, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: invoiceClone.scrollWidth,
        windowHeight: invoiceClone.scrollHeight
      });

      // Remove the temporary element
      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Add new pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      // Save the PDF
      doc.save(`Invoice-${invoiceNumber}.pdf`);
      
      toast({ 
        title: "Success", 
        description: "Invoice downloaded successfully!" 
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({ 
        title: "Error", 
        description: "Failed to generate PDF. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16 md:pt-24 pb-16 px-3 md:px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-6 md:mb-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-accent/10 text-accent mb-3 md:mb-5">
              <Receipt size={isMobile ? 24 : 32} />
            </div>
            <h1 className="text-xl md:text-3xl font-display font-bold mb-2 md:mb-3">Invoice Maker</h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Create professional invoices with our easy-to-use tool
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border shadow-md bg-background/60 backdrop-blur-sm">
              <CardContent className="p-0">
                <div id="invoice-content" ref={invoiceContentRef} className="bg-white dark:bg-background rounded-xl overflow-hidden">
                  <div className="p-4 md:p-6 border-b space-y-6 md:space-y-0">
                    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6">
                      <div className="mb-4 md:mb-0">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">INVOICE</h2>
                        <div className="mt-3 md:mt-4 space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="invoice-number">Invoice Number</Label>
                            <Input
                              id="invoice-number"
                              value={invoiceNumber}
                              onChange={(e) => setInvoiceNumber(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="issue-date">Issue Date</Label>
                              <Input
                                id="issue-date"
                                type="date"
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="due-date">Due Date</Label>
                              <Input
                                id="due-date"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end">
                        <div className="space-y-1 md:text-right w-full">
                          <Label htmlFor="company-name">Your Company</Label>
                          <Input
                            id="company-name"
                            placeholder="Your Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="md:text-right"
                          />
                        </div>
                        <div className="space-y-1 mt-3 w-full">
                          <Label htmlFor="company-address">Company Address</Label>
                          <Textarea
                            id="company-address"
                            placeholder="Your Company Address"
                            value={companyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)}
                            className="resize-none md:text-right"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 border-b space-y-4">
                    <h3 className="text-lg font-semibold mb-3">Bill To:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="client-name">Client Name</Label>
                        <Input
                          id="client-name"
                          placeholder="Client Name"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="client-address">Client Address</Label>
                        <Textarea
                          id="client-address"
                          placeholder="Client Address"
                          value={clientAddress}
                          onChange={(e) => setClientAddress(e.target.value)}
                          className="resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 border-b space-y-4">
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                      <h3 className="text-lg font-semibold">Items</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={addItem}
                        className="flex items-center w-full md:w-auto justify-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto -mx-4 md:mx-0">
                      <div className="min-w-[640px] px-4 md:px-0">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="py-2 text-left">Description</th>
                              <th className="py-2 text-right w-16 md:w-20">Qty</th>
                              <th className="py-2 text-right w-24 md:w-28">Price</th>
                              <th className="py-2 text-right w-24 md:w-28">Amount</th>
                              <th className="py-2 w-10"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item) => (
                              <tr key={item.id} className="border-b">
                                <td className="py-3 pr-2">
                                  <Input
                                    placeholder="Item description"
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                  />
                                </td>
                                <td className="py-3 px-1">
                                  <Input
                                    type="number"
                                    min="1"
                                    className="text-right"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                  />
                                </td>
                                <td className="py-3 px-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="text-right"
                                    value={item.price}
                                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                  />
                                </td>
                                <td className="py-3 px-1 text-right font-medium">
                                  ₹{(item.quantity * item.price).toFixed(2)}
                                </td>
                                <td className="py-3 pl-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeItem(item.id)}
                                    className="h-8 w-8"
                                  >
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="mt-6 md:ml-auto md:w-1/2">
                      <div className="mb-4">
                        <Label htmlFor="gst-rate">GST Rate</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Select
                            value={gstRateType}
                            onValueChange={setGstRateType}
                          >
                            <SelectTrigger id="gst-rate" className="w-full">
                              <SelectValue placeholder="Select GST rate" />
                            </SelectTrigger>
                            <SelectContent>
                              {gstRates.map((rate) => (
                                <SelectItem key={rate.value} value={rate.value}>
                                  {rate.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {gstRateType === "custom" && (
                            <div className="flex items-center">
                              <Input
                                id="custom-gst-rate"
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="Enter custom rate"
                                value={customGstRate}
                                onChange={(e) => setCustomGstRate(e.target.value)}
                                className="flex-1"
                              />
                              <span className="ml-2">%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Subtotal:</span>
                        <span>₹{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">
                          GST ({gstRateType === "custom" ? customGstRate : gstRateType}%):
                        </span>
                        <span>₹{calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 text-lg font-bold">
                        <span>Total:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any additional notes or payment terms..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button 
                variant="outline" 
                className="flex items-center justify-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                onClick={handleGenerateInvoice} 
                className="flex items-center justify-center"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InvoiceMaker;
