
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

  useEffect(() => {
    if (text.trim()) {
      generateQRCode();
    }
  }, [text, size, errorCorrectionLevel]);

  const generateQRCode = () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    
    // Using Google Charts API to generate QR code
    const encodedText = encodeURIComponent(text);
    const url = `https://chart.googleapis.com/chart?cht=qr&chl=${encodedText}&chs=${size}x${size}&choe=UTF-8&chld=${errorCorrectionLevel}`;
    
    setQrCodeUrl(url);
    setIsGenerating(false);
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
            <div className="border-b border-border/50 p-6 flex items-center gap-3">
              <QrCode className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-semibold">QR Code Generator</h1>
            </div>

            <div className="p-6">
              <div className="mb-6">
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

              {qrCodeUrl && (
                <div className="mt-8 flex flex-col items-center">
                  <div className="p-6 bg-white rounded-xl mb-6">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="max-w-full"
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

              {/* Tips Section */}
              <div className="mt-8 p-4 rounded-lg bg-background/30">
                <h3 className="font-medium mb-2">Quick Tips</h3>
                <ul className="space-y-1 text-sm text-foreground/70">
                  <li>• Use tab key to move between fields</li>
                  <li>• Results update automatically</li>
                  <li>• Recent calculations are saved</li>
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
