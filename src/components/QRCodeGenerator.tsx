
import React, { useState, useEffect } from "react";
import { QrCode, Download, Copy, CheckCircle2 } from "lucide-react";

const QRCodeGenerator = () => {
  const [text, setText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (text.trim()) {
      generateQRCode();
    }
  }, [text]);

  const generateQRCode = () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    
    // Using Google Charts API to generate QR code
    const encodedText = encodeURIComponent(text);
    const url = `https://chart.googleapis.com/chart?cht=qr&chl=${encodedText}&chs=300x300&choe=UTF-8`;
    
    setQrCodeUrl(url);
    setIsGenerating(false);
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "qrcode.png";
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

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
          <div className="border-b border-border/50 p-6 flex items-center gap-3">
            <QrCode className="w-5 h-5 text-accent" />
            <h1 className="text-xl font-semibold">QR Code Generator</h1>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Enter text or URL
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                placeholder="https://example.com"
              />
            </div>

            {qrCodeUrl && (
              <div className="flex flex-col items-center mt-8 animate-fade-in">
                <div className="p-4 bg-white rounded-xl mb-6">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-52 h-52 object-contain"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={downloadQRCode}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-white font-medium transition-all duration-200 hover:bg-accent/90 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={copyQRCodeUrl}
                    className="flex items-center gap-2 px-4 py-2 rounded-md glass-panel glass-panel-dark border border-border/50 font-medium transition-all duration-200 hover:bg-accent/10 active:scale-95"
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
              </div>
            )}

            {!qrCodeUrl && text && isGenerating && (
              <div className="flex justify-center mt-8">
                <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
              </div>
            )}

            {!qrCodeUrl && !text && (
              <div className="mt-8 p-8 rounded-lg glass-panel glass-panel-dark text-center">
                <QrCode className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                <p className="text-foreground/60">
                  Enter text or URL above to generate a QR code
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
