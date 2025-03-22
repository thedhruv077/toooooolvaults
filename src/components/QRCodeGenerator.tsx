
import React, { useState, useEffect } from "react";
import { QrCode, Download, Copy, CheckCircle2, RefreshCw, Sliders } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  }, [text, size, errorCorrectionLevel, color, bgColor]);

  const generateQRCode = () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    
    // Convert hex colors to RGB for URL encoding
    const colorRGB = hexToRgb(color);
    const bgColorRGB = hexToRgb(bgColor);
    
    // Using Google Charts API to generate QR code
    const encodedText = encodeURIComponent(text);
    const url = `https://chart.googleapis.com/chart?cht=qr&chl=${encodedText}&chs=${size}x${size}&choe=UTF-8&chld=${errorCorrectionLevel}&chco=${color.replace('#', '')}`;
    
    setQrCodeUrl(url);
    setIsGenerating(false);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "blog-qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyQRCodeUrl = () => {
    if (!qrCodeUrl) return;
    
    navigator.clipboard.writeText(qrCodeUrl);
    setCopied(true);
    
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
            <div className="border-b border-border/50 p-6 flex items-center gap-3">
              <QrCode className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-semibold">QR Code Generator for Blog Content</h1>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Text or URL
                    </label>
                    <Input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full"
                      placeholder="Enter URL or text"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Sliders className="w-4 h-4" /> 
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
                  
                  <div className="mb-6">
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
                              ? "bg-accent text-white"
                              : "bg-accent/10 hover:bg-accent/20"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        QR Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="h-10 w-10 rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="h-10 w-10 rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button 
                      variant="outline" 
                      onClick={resetAll}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset
                    </Button>
                    
                    <Button 
                      onClick={downloadQRCode}
                      className="flex items-center gap-2"
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
                      <div className="p-6 bg-white rounded-xl mb-6 border shadow-md">
                        <img
                          src={qrCodeUrl}
                          alt="QR Code"
                          className="max-w-full h-auto"
                          style={{ minWidth: "200px", minHeight: "200px" }}
                        />
                      </div>

                      <button
                        onClick={copyQRCodeUrl}
                        className="flex items-center gap-2 px-4 py-2 rounded-md glass-panel border border-border/50 font-medium transition-all duration-200 hover:bg-accent/10 active:scale-95"
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
                </div>
              </div>

              <div className="mt-8 p-4 rounded-lg bg-background/30">
                <h3 className="font-medium mb-2">Quick Tips</h3>
                <ul className="space-y-1 text-sm text-foreground/70">
                  <li>• Higher error correction levels (M, Q, H) make your QR code more reliable but may need to be larger</li>
                  <li>• For blog posts, use medium size QR codes (250-350px) for optimal scanning</li>
                  <li>• Custom colors can match your blog's branding</li>
                  <li>• Test your QR codes on multiple devices before publishing</li>
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
