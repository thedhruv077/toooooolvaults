
import { useState, useEffect, ChangeEvent } from "react";
import { QrCode, Download, Link, RefreshCw, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const QRCodeGenerator = () => {
  const [qrContent, setQrContent] = useState<string>("");
  const [qrColor, setQrColor] = useState<string>("#000000");
  const [qrBgColor, setQrBgColor] = useState<string>("#FFFFFF");
  const [qrSize, setQrSize] = useState<string>("200");
  const [qrType, setQrType] = useState<string>("url");
  const [qrImageUrl, setQrImageUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  // Generate QR code on initial render
  useEffect(() => {
    if (qrContent) {
      handleGenerateQR();
    }
  }, [qrColor, qrBgColor, qrSize]);
  
  const handleContactInfoChange = (field: string, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update QR content
    const content = `BEGIN:VCARD\nVERSION:3.0\nN:${contactInfo.name}\nEMAIL:${contactInfo.email}\nTEL:${contactInfo.phone}\nEND:VCARD`;
    setQrContent(content);
  };
  
  const handleGenerateQR = () => {
    if (!qrContent && qrType !== 'contact') {
      toast({ title: "Error", description: "Please enter content for the QR code", variant: "destructive" });
      return;
    }
    
    let content = qrContent;
    
    // Format content based on type
    if (qrType === "url" && content && !content.match(/^https?:\/\//i)) {
      content = "https://" + content;
    } else if (qrType === "email" && content) {
      content = "mailto:" + content;
    } else if (qrType === "phone" && content) {
      content = "tel:" + content;
    } else if (qrType === "contact") {
      if (!contactInfo.name && !contactInfo.email && !contactInfo.phone) {
        toast({ title: "Error", description: "Please enter at least one contact detail", variant: "destructive" });
        return;
      }
      content = `BEGIN:VCARD\nVERSION:3.0\nN:${contactInfo.name}\nEMAIL:${contactInfo.email}\nTEL:${contactInfo.phone}\nEND:VCARD`;
    }
    
    // Generate QR code using API
    const placeholderUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(content)}&size=${qrSize}x${qrSize}&color=${qrColor.replace("#", "")}&bgcolor=${qrBgColor.replace("#", "")}`;
    
    setQrImageUrl(placeholderUrl);
    toast({ title: "Success", description: "QR code generated successfully" });
  };
  
  const downloadQRCode = () => {
    if (!qrImageUrl) {
      toast({ title: "Error", description: "Please generate a QR code first", variant: "destructive" });
      return;
    }
    
    // Create a temporary link element
    const a = document.createElement("a");
    a.href = qrImageUrl;
    a.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({ title: "Success", description: "QR code downloaded successfully" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-6">
              <QrCode size={36} />
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">QR Code Generator</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create custom QR codes for websites, contacts, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>QR Code Content</CardTitle>
                  <CardDescription>
                    Enter the content for your QR code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="url" className="w-full" value={qrType} onValueChange={setQrType}>
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="url">URL</TabsTrigger>
                      <TabsTrigger value="text">Text</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="url" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="url-input">Website URL</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                            https://
                          </span>
                          <Input
                            id="url-input"
                            placeholder="example.com"
                            value={qrContent}
                            onChange={(e) => setQrContent(e.target.value)}
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="text" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="text-input">Text Content</Label>
                        <Textarea
                          id="text-input"
                          placeholder="Enter text content for your QR code"
                          value={qrContent}
                          onChange={(e) => setQrContent(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="contact" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name-input">Name</Label>
                        <Input
                          id="name-input"
                          placeholder="Full Name"
                          value={contactInfo.name}
                          onChange={(e) => handleContactInfoChange('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-input">Email</Label>
                        <Input
                          id="email-input"
                          placeholder="email@example.com"
                          value={contactInfo.email}
                          onChange={(e) => handleContactInfoChange('email', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone-input">Phone</Label>
                        <Input
                          id="phone-input"
                          placeholder="+1 (555) 123-4567"
                          value={contactInfo.phone}
                          onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="qr-color">QR Code Color</Label>
                      <div className="flex">
                        <Input
                          id="qr-color"
                          type="color"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className="w-12 h-10 p-1 border-0"
                        />
                        <Input
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="qr-bg-color">Background Color</Label>
                      <div className="flex">
                        <Input
                          id="qr-bg-color"
                          type="color"
                          value={qrBgColor}
                          onChange={(e) => setQrBgColor(e.target.value)}
                          className="w-12 h-10 p-1 border-0"
                        />
                        <Input
                          value={qrBgColor}
                          onChange={(e) => setQrBgColor(e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="qr-size">QR Code Size</Label>
                    <Select value={qrSize} onValueChange={setQrSize}>
                      <SelectTrigger id="qr-size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">Small (100x100)</SelectItem>
                        <SelectItem value="200">Medium (200x200)</SelectItem>
                        <SelectItem value="300">Large (300x300)</SelectItem>
                        <SelectItem value="400">X-Large (400x400)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleGenerateQR}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate QR Code
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card className="glass-card h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Your QR Code</CardTitle>
                  <CardDescription>
                    Preview and download your custom QR code
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center justify-center">
                  {qrImageUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="border border-border p-4 rounded-xl bg-white">
                        <img 
                          src={qrImageUrl} 
                          alt="Generated QR Code"
                          className="max-w-full h-auto"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        Scan this QR code to access your content
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <QrCode className="h-24 w-24 mx-auto opacity-20 mb-4" />
                      <p className="text-muted-foreground">
                        Enter your content and click "Generate QR Code" to create a custom QR code
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handleGenerateQR}
                    className="flex items-center"
                    disabled={!qrContent && qrType !== 'contact'}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button
                    onClick={downloadQRCode}
                    className="flex items-center"
                    disabled={!qrImageUrl}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QRCodeGenerator;
