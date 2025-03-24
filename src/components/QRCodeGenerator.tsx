
import React, { useState, useEffect } from "react";
import { QrCode, Download, Copy, CheckCircle2, RefreshCw, Sliders, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "./Header";
import Footer from "./Footer";

const QRCodeGenerator = () => {
  const [text, setText] = useState("https://yourblog.com");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [size, setSize] = useState(300);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");
  const [isGenerating, setIsGenerating] = useState(false);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = () => {
    if (!text.trim()) {
      toast.error("Please enter a valid URL or text");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Using Google Charts API to generate QR code
      const encodedText = encodeURIComponent(text);
      const colorParam = color.replace('#', '');
      const bgColorParam = bgColor.replace('#', '');
      const url = `https://chart.googleapis.com/chart?cht=qr&chl=${encodedText}&chs=${size}x${size}&choe=UTF-8&chld=${errorCorrectionLevel}&chco=${bgColorParam}|${colorParam}`;
      
      setQrCodeUrl(url);
      setIsGenerating(false);
    } catch (error) {
      toast.error("Failed to generate QR code");
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded successfully!");
  };

  const copyQRCodeUrl = () => {
    if (!qrCodeUrl) return;
    
    navigator.clipboard.writeText(qrCodeUrl);
    setCopied(true);
    toast.success("QR code URL copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const resetAll = () => {
    setText("https://yourblog.com");
    setSize(300);
    setErrorCorrectionLevel("M");
    setColor("#000000");
    setBgColor("#FFFFFF");
    toast.info("All settings reset to default");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden shadow-lg border border-accent/20 premium-shadow">
            <div className="border-b border-border/50 p-6 flex items-center gap-3 bg-accent/5">
              <QrCode className="w-6 h-6 text-accent" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">QR Code Generator</h1>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-accent" />
                      URL or Text Content
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full pr-24 border-accent/20 focus:border-accent"
                        placeholder="Enter URL or text"
                      />
                      <Button 
                        size="sm"
                        onClick={generateQRCode}
                        className="absolute right-1 top-1 bg-accent hover:bg-accent/90 button-glow"
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-accent" /> 
                      QR Code Size
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="100"
                        max="500"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="flex-grow h-2 rounded-lg appearance-none bg-accent/30 cursor-pointer"
                      />
                      <span className="text-sm font-medium w-16 text-right">{size}px</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium mb-2">
                      Error Correction Level
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["L", "M", "Q", "H"].map((level) => (
                        <button
                          key={level}
                          onClick={() => setErrorCorrectionLevel(level)}
                          className={`py-2 rounded-md text-center transition-all duration-200 ${
                            errorCorrectionLevel === level
                              ? "bg-accent text-white shadow-md"
                              : "bg-accent/10 hover:bg-accent/20"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium mb-2">
                        QR Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="h-10 w-10 rounded cursor-pointer border border-border"
                        />
                        <Input
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-full border-accent/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium mb-2">
                        Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="h-10 w-10 rounded cursor-pointer border border-border"
                        />
                        <Input
                          type="text"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-full border-accent/20"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button 
                      variant="outline" 
                      onClick={resetAll}
                      className="flex items-center gap-2 border-accent/20 hover:bg-accent/10"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset
                    </Button>
                    
                    <Button 
                      onClick={downloadQRCode}
                      className="flex items-center gap-2 bg-accent hover:bg-accent/90 button-glow"
                      disabled={!qrCodeUrl}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  {qrCodeUrl && (
                    <div className="flex flex-col items-center">
                      <div className="p-6 bg-white rounded-xl mb-6 border shadow-xl transform transition-all duration-300 hover:shadow-accent/20 hover:scale-105 premium-shadow">
                        <img
                          src={qrCodeUrl}
                          alt="QR Code"
                          className="max-w-full h-auto"
                          style={{ minWidth: "200px", minHeight: "200px" }}
                        />
                      </div>

                      <button
                        onClick={copyQRCodeUrl}
                        className="flex items-center gap-2 px-4 py-2 rounded-md glass-panel border border-accent/20 font-medium transition-all duration-200 hover:bg-accent/10 active:scale-95"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {!qrCodeUrl && text && isGenerating && (
                    <div className="flex justify-center mt-8">
                      <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {!qrCodeUrl && !isGenerating && (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-accent/30 rounded-xl">
                      <QrCode className="w-16 h-16 text-accent/30 mb-4" />
                      <p className="text-foreground/60 text-center">Enter your URL or text and click Generate to create a QR code</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 p-6 rounded-lg bg-background/30 border border-accent/10">
                <h3 className="font-bold mb-3 text-accent">Quick Tips</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Higher error correction levels (M, Q, H) make your QR code more reliable but may need to be larger</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>For blog posts, use medium size QR codes (250-350px) for optimal scanning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Custom colors can match your blog's branding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>Test your QR codes on multiple devices before publishing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default QRCodeGenerator;
