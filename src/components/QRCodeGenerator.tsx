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

  // Rest of your component remains exactly the same...
  // Keep all the JSX return statement as is
