
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
  
  const generateQRUrl = (content: string) => {
    if (!content) return "";
    
    // Properly encode the content and handle special characters
    const encodedContent = encodeURIComponent(content);
    const color = qrColor.replace("#", "");
    const bgColor = qrBgColor.replace("#", "");
    
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodedContent}&size=${qrSize}x${qrSize}&color=${color}&bgcolor=${bgColor}&margin=10`;
  };
  
  const handleContactInfoChange = (field: string, value: string) => {
    const updatedInfo = {
      ...contactInfo,
      [field]: value
    };
    setContactInfo(updatedInfo);
    
    // Generate contact vcard content
    const content = `BEGIN:VCARD\nVERSION:3.0\nN:${updatedInfo.name}\nEMAIL:${updatedInfo.email}\nTEL:${updatedInfo.phone}\nEND:VCARD`;
    setQrContent(content);
  };
  
  const handleGenerateQR = () => {
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
    
    if (!content) {
      toast({ title: "Error", description: "Please enter content for the QR code", variant: "destructive" });
      return;
    }
    
    // Generate QR code URL
    const qrUrl = generateQRUrl(content);
    setQrImageUrl(qrUrl);
    
    toast({ title: "Success", description: "QR code generated successfully" });
  };
  
  const downloadQRCode = () => {
    if (!qrImageUrl) {
      toast({ title: "Error", description: "Please generate a QR code first", variant: "destructive" });
      return;
    }
    
    const a = document.createElement("a");
    a.href = qrImageUrl;
    a.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({ title: "Success", description: "QR code downloaded successfully" });
  };

  const copyQRUrl = () => {
    if (!qrImageUrl) {
      toast({ title: "Error", description: "Please generate a QR code first", variant: "destructive" });
      return;
    }
    
    navigator.clipboard.writeText(qrImageUrl);
    setCopied(true);
    
    toast({ title: "Success", description: "QR code URL copied to clipboard" });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
              Create custom QR codes for your website, contact info, or any text.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Create Your QR Code</CardTitle>
                  <CardDescription>
                    Customize your QR code and download it for free
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="url" value={qrType} onValueChange={setQrType}>
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="url">URL</TabsTrigger>
                      <TabsTrigger value="text">Text</TabsTrigger>
                      <TabsTrigger value="email">Email</TabsTrigger>
                      <TabsTrigger value="phone">Phone</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="url" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="url-input">Website URL</Label>
                        <Input
                          id="url-input"
                          type="text"
                          placeholder="Enter website URL, e.g. example.com"
                          value={qrContent}
                          onChange={e => setQrContent(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Enter the URL of the website you want to create a QR code for.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="text" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="text-input">Text Content</Label>
                        <Textarea
                          id="text-input"
                          placeholder="Enter any text content..."
                          value={qrContent}
                          onChange={e => setQrContent(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="email" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-input">Email Address</Label>
                        <Input
                          id="email-input"
                          type="email"
                          placeholder="Enter email address"
                          value={qrContent}
                          onChange={e => setQrContent(e.target.value)}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="phone" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone-input">Phone Number</Label>
                        <Input
                          id="phone-input"
                          type="tel"
                          placeholder="Enter phone number"
                          value={qrContent}
                          onChange={e => setQrContent(e.target.value)}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="contact" className="mt-4 space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Name</Label>
                          <Input
                            id="contact-name"
                            placeholder="Enter name"
                            value={contactInfo.name}
                            onChange={e => handleContactInfoChange('name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-email">Email</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            placeholder="Enter email address"
                            value={contactInfo.email}
                            onChange={e => handleContactInfoChange('email', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">Phone</Label>
                          <Input
                            id="contact-phone"
                            type="tel"
                            placeholder="Enter phone number"
                            value={contactInfo.phone}
                            onChange={e => handleContactInfoChange('phone', e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-semibold">Customize</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="qr-color">QR Code Color</Label>
                        <div className="flex gap-2">
                          <div className="relative w-10 h-10 rounded overflow-hidden border">
                            <Input
                              id="qr-color"
                              type="color"
                              value={qrColor}
                              onChange={e => setQrColor(e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-full h-full" style={{ backgroundColor: qrColor }}></div>
                          </div>
                          <Input
                            type="text"
                            value={qrColor}
                            onChange={e => setQrColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="qr-bg-color">Background Color</Label>
                        <div className="flex gap-2">
                          <div className="relative w-10 h-10 rounded overflow-hidden border">
                            <Input
                              id="qr-bg-color"
                              type="color"
                              value={qrBgColor}
                              onChange={e => setQrBgColor(e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-full h-full" style={{ backgroundColor: qrBgColor }}></div>
                          </div>
                          <Input
                            type="text"
                            value={qrBgColor}
                            onChange={e => setQrBgColor(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="qr-size">Size (pixels)</Label>
                      <Select value={qrSize} onValueChange={setQrSize}>
                        <SelectTrigger id="qr-size">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100px</SelectItem>
                          <SelectItem value="200">200px</SelectItem>
                          <SelectItem value="300">300px</SelectItem>
                          <SelectItem value="400">400px</SelectItem>
                          <SelectItem value="500">500px</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleGenerateQR}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate QR Code
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Your QR Code</CardTitle>
                  <CardDescription>
                    Preview and download your custom QR code
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center justify-center">
                  {qrImageUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="border border-border p-4 bg-white rounded-lg mb-4">
                        <img 
                          src={qrImageUrl} 
                          alt="Generated QR Code" 
                          className="max-w-full"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Scan with a QR code reader or smartphone camera
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-muted mb-4">
                        <QrCode className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-2">No QR Code Generated</h3>
                      <p className="text-sm text-muted-foreground">
                        Fill out the form and click "Generate QR Code" to see your QR code here.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={copyQRUrl}
                      disabled={!qrImageUrl}
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Link className="mr-2 h-4 w-4" />
                          Copy URL
                        </>
                      )}
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={!qrImageUrl}
                      onClick={downloadQRCode}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  {qrImageUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={handleGenerateQR}
                    >
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Regenerate QR Code
                    </Button>
                  )}
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
