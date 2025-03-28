
import { useState, useEffect, useRef } from "react";
import { Receipt, Plus, Trash2, Download, FileText, Loader2, Save } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
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

const InvoiceGenerator = () => {
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
  const [savedInvoices, setSavedInvoices] = useState<string[]>([]);
  
  // Initialize from localStorage if available
  useEffect(() => {
    const savedInvoicesJSON = localStorage.getItem('savedInvoices');
    if (savedInvoicesJSON) {
      try {
        setSavedInvoices(JSON.parse(savedInvoicesJSON));
      } catch (e) {
        console.error('Error loading saved invoices:', e);
      }
    }
  }, []);
  
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
  
  const saveInvoiceAsDraft = () => {
    if (!companyName || !clientName) {
      toast({ 
        title: "Error", 
        description: "Please enter company and client information", 
        variant: "destructive" 
      });
      return;
    }
    
    const invoiceData = {
      invoiceNumber,
      issueDate,
      dueDate,
      companyName,
      companyAddress,
      clientName,
      clientAddress,
      items,
      notes,
      gstRateType,
      customGstRate
    };
    
    const updatedSavedInvoices = [...savedInvoices, JSON.stringify(invoiceData)];
    setSavedInvoices(updatedSavedInvoices);
    localStorage.setItem('savedInvoices', JSON.stringify(updatedSavedInvoices));
    
    toast({ 
      title: "Success", 
      description: "Invoice saved as draft" 
    });
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
      if (!invoiceContentRef.current) {
        throw new Error('Invoice element not found');
      }
      
      // Create PDF with standard A4 format
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      // Clone the DOM element to avoid affecting the visible UI
      const originalElement = invoiceContentRef.current;
      const clonedElement = originalElement.cloneNode(true) as HTMLElement;
      
      // Prepare temp container for the cloned element
      const tempContainer = document.createElement('div');
      document.body.appendChild(tempContainer);
      tempContainer.appendChild(clonedElement);
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '210mm'; // A4 width
      
      // Style the PDF content for better rendering
      clonedElement.style.width = '210mm';
      clonedElement.style.backgroundColor = 'white';
      clonedElement.style.color = 'black';
      clonedElement.style.padding = '15mm 15mm';
      clonedElement.style.boxSizing = 'border-box';
      
      // Remove UI elements not needed in PDF
      const elementsToRemove = clonedElement.querySelectorAll('button');
      elementsToRemove.forEach(el => el.remove());
      
      // Ensure all text is visible with proper styling
      const allElements = clonedElement.querySelectorAll('*');
      allElements.forEach(el => {
        const element = el as HTMLElement;
        if (element.style) {
          element.style.color = 'black';
          element.style.textOverflow = 'visible';
          element.style.overflow = 'visible';
          element.style.whiteSpace = 'normal';
          
          // Set appropriate font sizes
          if (element.tagName === 'H1') element.style.fontSize = '24px';
          else if (element.tagName === 'H2') element.style.fontSize = '20px';
          else if (element.tagName === 'H3') element.style.fontSize = '16px';
          else element.style.fontSize = '12px';
        }
      });
      
      // Render the invoice to canvas with improved quality
      const canvas = await html2canvas(clonedElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white',
        logging: false,
      });
      
      // Clean up
      document.body.removeChild(tempContainer);
      
      // Convert to image for PDF
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions for PDF
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const aspectRatio = canvas.height / canvas.width;
      const imgWidth = pdfWidth;
      const imgHeight = pdfWidth * aspectRatio;
      
      // Add image to PDF, handling multi-page if needed
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      
      // Add additional pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
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
      
      <main className="flex-grow pt-16 md:pt-24 pb-16 px-3 md:px-4 bg-gradient-to-b from-background to-background/90">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 md:mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/10 text-accent mb-4 md:mb-6 shadow-lg">
              <Receipt size={isMobile ? 28 : 36} />
            </div>
            <h1 className="text-2xl md:text-4xl font-display font-bold mb-3 md:mb-4 text-glass">Invoice Generator</h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Create professional invoices for your business quickly and easily
            </p>
          </div>

          <div className="space-y-8">
            <Card className="border shadow-lg bg-background/80 backdrop-blur-sm rounded-xl overflow-hidden premium-shadow">
              <CardContent className="p-0">
                <div id="invoice-content" ref={invoiceContentRef} className="bg-white dark:bg-background rounded-xl overflow-hidden">
                  <div className="p-6 md:p-8 border-b space-y-6 md:space-y-0">
                    <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8">
                      <div className="mb-4 md:mb-0 space-y-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">INVOICE</h2>
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="invoice-number" className="text-sm font-medium">Invoice Number</Label>
                            <Input
                              id="invoice-number"
                              value={invoiceNumber}
                              onChange={(e) => setInvoiceNumber(e.target.value)}
                              className="bg-background/50"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label htmlFor="issue-date" className="text-sm font-medium">Issue Date</Label>
                              <Input
                                id="issue-date"
                                type="date"
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                                className="bg-background/50"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="due-date" className="text-sm font-medium">Due Date</Label>
                              <Input
                                id="due-date"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="bg-background/50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end">
                        <div className="space-y-1.5 md:text-right w-full">
                          <Label htmlFor="company-name" className="text-sm font-medium">Your Company</Label>
                          <Input
                            id="company-name"
                            placeholder="Your Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="md:text-right bg-background/50"
                          />
                        </div>
                        <div className="space-y-1.5 mt-4 w-full">
                          <Label htmlFor="company-address" className="text-sm font-medium">Company Address</Label>
                          <Textarea
                            id="company-address"
                            placeholder="Your Company Address"
                            value={companyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)}
                            className="resize-none md:text-right bg-background/50"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 border-b space-y-4 bg-accent/5">
                    <h3 className="text-lg font-semibold mb-4">Bill To:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="client-name" className="text-sm font-medium">Client Name</Label>
                        <Input
                          id="client-name"
                          placeholder="Client Name"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="client-address" className="text-sm font-medium">Client Address</Label>
                        <Textarea
                          id="client-address"
                          placeholder="Client Address"
                          value={clientAddress}
                          onChange={(e) => setClientAddress(e.target.value)}
                          className="resize-none bg-background/50"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 border-b space-y-4">
                    <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
                      <h3 className="text-lg font-semibold">Items</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={addItem}
                        className="flex items-center justify-center hover:bg-accent/10 hover:text-accent transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto -mx-4 md:-mx-6 lg:mx-0">
                      <div className="min-w-[640px] px-4 md:px-6 lg:px-0">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-border/60">
                              <th className="py-3 text-left font-medium text-sm text-muted-foreground">Description</th>
                              <th className="py-3 text-right w-16 md:w-20 font-medium text-sm text-muted-foreground">Qty</th>
                              <th className="py-3 text-right w-24 md:w-28 font-medium text-sm text-muted-foreground">Price</th>
                              <th className="py-3 text-right w-24 md:w-28 font-medium text-sm text-muted-foreground">Amount</th>
                              <th className="py-3 w-10"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40">
                            {items.map((item) => (
                              <tr key={item.id} className="hover:bg-accent/5 transition-colors">
                                <td className="py-3 pr-2">
                                  <Input
                                    placeholder="Item description"
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                    className="border-0 bg-transparent focus-visible:ring-1"
                                  />
                                </td>
                                <td className="py-3 px-1">
                                  <Input
                                    type="number"
                                    min="1"
                                    className="text-right border-0 bg-transparent focus-visible:ring-1"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                  />
                                </td>
                                <td className="py-3 px-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="text-right border-0 bg-transparent focus-visible:ring-1"
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
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="mt-8 md:ml-auto md:w-1/2 lg:w-2/5">
                      <div className="mb-5">
                        <Label htmlFor="gst-rate" className="text-sm font-medium">GST Rate</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
                          <Select
                            value={gstRateType}
                            onValueChange={setGstRateType}
                          >
                            <SelectTrigger id="gst-rate" className="w-full bg-background/50">
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
                                className="flex-1 bg-background/50"
                              />
                              <span className="ml-2 text-muted-foreground">%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 rounded-lg bg-accent/5 p-4">
                        <div className="flex justify-between py-2">
                          <span className="font-medium text-muted-foreground">Subtotal:</span>
                          <span>₹{calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <Separator className="my-1 bg-border/40" />
                        <div className="flex justify-between py-2">
                          <span className="font-medium text-muted-foreground">
                            GST ({gstRateType === "custom" ? customGstRate : gstRateType}%):
                          </span>
                          <span>₹{calculateTax().toFixed(2)}</span>
                        </div>
                        <Separator className="my-1 bg-border/40" />
                        <div className="flex justify-between py-3 text-lg font-bold">
                          <span>Total:</span>
                          <span>₹{calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 bg-accent/5">
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any additional notes or payment terms..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="resize-none bg-background/50"
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
                onClick={saveInvoiceAsDraft}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button 
                    onClick={handleGenerateInvoice} 
                    className="flex items-center justify-center bg-accent hover:bg-accent/90 transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-[-2px]"
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
                </HoverCardTrigger>
                <HoverCardContent className="p-4">
                  <p className="text-sm">Download your invoice as a PDF document.</p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InvoiceGenerator;
