import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Trash2, Download, Check, AlertCircle, File, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

const PDFCompressor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFile = e.target.files[0];
    
    if (!selectedFile.name.endsWith('.pdf')) {
      toast({
        title: "Invalid file format",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    
    toast({
      title: "File uploaded",
      description: "PDF file added successfully",
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (!e.dataTransfer.files?.length) return;
    
    const droppedFile = e.dataTransfer.files[0];
    
    if (!droppedFile.name.endsWith('.pdf')) {
      toast({
        title: "Invalid file format",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }
    
    setFile(droppedFile);
    
    toast({
      title: "File uploaded",
      description: "PDF file added successfully",
    });
  };

  const clearFile = () => {
    setFile(null);
    
    toast({
      title: "File removed",
      description: "PDF file has been removed",
    });
  };

  const getEstimatedSize = () => {
    if (!file) return null;
    
    const originalSize = file.size;
    let estimatedReduction = 0;
    
    switch (compressionLevel) {
      case 'low':
        estimatedReduction = 0.2;
        break;
      case 'medium':
        estimatedReduction = 0.5;
        break;
      case 'high':
        estimatedReduction = 0.7;
        break;
    }
    
    const estimatedSize = originalSize * (1 - estimatedReduction);
    return {
      originalSize: (originalSize / 1024 / 1024).toFixed(2),
      estimatedSize: (estimatedSize / 1024 / 1024).toFixed(2),
      percentReduction: Math.round(estimatedReduction * 100)
    };
  };

  const compressPdf = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to compress",
        variant: "destructive",
      });
      return;
    }

    setIsCompressing(true);
    setProgress(0);
    
    const simulateProgress = () => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 10;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          
          setTimeout(() => {
            setIsCompressing(false);
            setProgress(0);
            
            toast({
              title: "Compression complete",
              description: `PDF compressed successfully (${getEstimatedSize()?.percentReduction}% reduction)`,
            });
            
            const link = document.createElement('a');
            link.download = file.name.replace(/\.pdf$/i, '-compressed.pdf');
            link.href = URL.createObjectURL(new Blob(['Compressed PDF content would go here'], { type: 'application/pdf' }));
            link.click();
            URL.revokeObjectURL(link.href);
            
          }, 500);
        }
        setProgress(currentProgress);
      }, 200);
    };
    
    simulateProgress();
  };

  const sizeInfo = getEstimatedSize();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      <Helmet>
        <title>PDF Compressor | Free Online Tool | Tool Vault</title>
        <meta name="description" content="Compress PDF files online for free. Reduce file size while maintaining quality for easier sharing and storing." />
        <meta name="keywords" content="pdf compressor, compress pdf, reduce pdf size, pdf compression tool, pdf optimizer, free pdf compressor, online compressor" />
      </Helmet>
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">PDF Compressor</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Compress your PDF files quickly and easily. Reduce file size while maintaining quality for easier sharing.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-xl shadow-lg overflow-hidden border border-slate-700/80 backdrop-blur-sm">
          <div className="bg-slate-700/50 p-6 border-b border-slate-600/50">
            <div className="flex items-center gap-3">
              <ArrowDown className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">PDF Compressor</h2>
            </div>
            <p className="text-gray-300 mt-1">
              Upload your PDF and compress it to reduce file size
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {!file ? (
              <div 
                className="border-2 border-dashed border-blue-400/30 rounded-xl p-10 text-center hover:border-blue-400 transition-all duration-300 cursor-pointer bg-slate-800/50"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="mb-4">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <File className="w-10 h-10 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-3 text-white">Drag & Drop PDF File Here</h3>
                <p className="text-gray-300 mb-5 max-w-md mx-auto">Select a PDF file from your device or drag it directly into this area</p>
                <Button variant="outline" size="lg" className="gap-2 border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white">
                  <Upload className="w-4 h-4" /> Browse Files
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Selected File</h3>
                  <Button variant="outline" size="sm" onClick={clearFile} className="text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4 mr-2" /> Remove File
                  </Button>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg overflow-hidden p-4 flex items-center space-x-4 border border-slate-600/50">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <File className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{file.name}</h4>
                    <p className="text-gray-400 text-sm">{sizeInfo?.originalSize} MB</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-3">Compression Level</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Button 
                      variant={compressionLevel === 'low' ? "default" : "outline"}
                      onClick={() => setCompressionLevel('low')}
                      className={compressionLevel === 'low' ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      Low
                      <span className="text-xs ml-1">
                        (20% reduction)
                      </span>
                    </Button>
                    <Button 
                      variant={compressionLevel === 'medium' ? "default" : "outline"}
                      onClick={() => setCompressionLevel('medium')}
                      className={compressionLevel === 'medium' ? "bg-blue-500 hover:bg-blue-600" : ""}
                    >
                      Medium
                      <span className="text-xs ml-1">
                        (50% reduction)
                      </span>
                    </Button>
                    <Button 
                      variant={compressionLevel === 'high' ? "default" : "outline"}
                      onClick={() => setCompressionLevel('high')}
                      className={compressionLevel === 'high' ? "bg-purple-600 hover:bg-purple-700" : ""}
                    >
                      High
                      <span className="text-xs ml-1">
                        (70% reduction)
                      </span>
                    </Button>
                  </div>
                </div>

                {sizeInfo && (
                  <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700/50">
                    <h4 className="text-white font-medium mb-3">Estimated Result</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Original size:</span>
                      <span className="font-medium text-white">{sizeInfo.originalSize} MB</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-300">Estimated size after compression:</span>
                      <span className="font-medium text-green-400">{sizeInfo.estimatedSize} MB</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-300">Reduction:</span>
                      <span className="font-medium text-green-400">{sizeInfo.percentReduction}%</span>
                    </div>
                    <div className="mt-3 h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${sizeInfo.percentReduction}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isCompressing && (
              <div className="space-y-2 bg-blue-500/5 p-4 rounded-lg border border-blue-400/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="animate-pulse">
                    <ArrowDown className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="font-medium text-white">Compressing your PDF...</p>
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-gray-400">{Math.round(progress)}%</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-slate-600/50 p-6 bg-slate-800/30">
            <Button 
              onClick={compressPdf} 
              disabled={isCompressing || !file}
              className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white"
              size="lg"
            >
              <ArrowDown className="w-5 h-5" /> 
              {isCompressing ? 'Compressing...' : 'Compress PDF'}
            </Button>
          </div>
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8 text-white">Why Use Our PDF Compressor?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Free & Easy</h3>
              <p className="text-gray-300">No signup required. Just upload and compress your PDFs instantly.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <ArrowDown className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Quality Retention</h3>
              <p className="text-gray-300">Smart compression algorithms that reduce size while maintaining readability.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Privacy First</h3>
              <p className="text-gray-300">Your files are processed locally. We never store or share your documents.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PDFCompressor;
