
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileImage, Upload, Trash2, Download, Check, AlertCircle, File, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import * as pdfjs from 'pdfjs-dist';

// Set the worker source (required for PDF.js)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFToJPGConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedPages, setConvertedPages] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFile = e.target.files[0];
    
    // Check if file is a PDF file
    if (!selectedFile.name.endsWith('.pdf')) {
      toast({
        title: "Invalid file format",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    setConvertedPages([]);
    setShowPreview(false);
    
    toast({
      title: "File uploaded",
      description: "PDF file added successfully",
    });
    
    // Reset the input
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
    
    // Check if file is a PDF file
    if (!droppedFile.name.endsWith('.pdf')) {
      toast({
        title: "Invalid file format",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }
    
    setFile(droppedFile);
    setConvertedPages([]);
    setShowPreview(false);
    
    toast({
      title: "File uploaded",
      description: "PDF file added successfully",
    });
  };

  const clearFile = () => {
    setFile(null);
    setConvertedPages([]);
    setShowPreview(false);
    
    toast({
      title: "File removed",
      description: "PDF file has been removed",
    });
  };

  const convertToJPG = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to convert",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedPages([]);
    
    try {
      // Load the PDF file
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      const totalPages = pdf.numPages;
      const convertedImages: string[] = [];
      
      // Create a canvas element for rendering PDF pages
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Unable to get canvas context');
      }
      
      // Convert each page to JPG
      for (let i = 1; i <= totalPages; i++) {
        // Get the page
        const page = await pdf.getPage(i);
        
        // Set scale for better quality (adjust as needed)
        const scale = 2.0;
        const viewport = page.getViewport({ scale });
        
        // Set canvas dimensions to match the page
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Render the page to the canvas
        await page.render({
          canvasContext: ctx,
          viewport: viewport
        }).promise;
        
        // Convert canvas to image
        const imageUrl = canvas.toDataURL('image/jpeg', 0.95);
        convertedImages.push(imageUrl);
        
        // Update progress
        setProgress(Math.round((i / totalPages) * 100));
      }
      
      setConvertedPages(convertedImages);
      setShowPreview(true);
      
      toast({
        title: "Conversion complete",
        description: `PDF file has been converted to ${totalPages} JPG image${totalPages > 1 ? 's' : ''}`,
      });
    } catch (error) {
      console.error('PDF conversion error:', error);
      toast({
        title: "Conversion failed",
        description: "An error occurred during conversion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `page-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    // Create a zip file containing all images
    // Note: In a real implementation, we would use JSZip or similar library
    // For simplicity, we'll just download each image individually
    
    convertedPages.forEach((page, index) => {
      downloadImage(page, index);
    });
    
    toast({
      title: "Download started",
      description: "Your converted images are being downloaded",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>PDF to JPG Converter | Free Online Tool | Tool Vault</title>
        <meta name="description" content="Convert PDF files to high-quality JPG images online for free. No watermark, high resolution, and easy to use." />
        <meta name="keywords" content="pdf to jpg, pdf to jpeg, convert pdf to images, pdf converter, image extraction, free image converter, online converter" />
      </Helmet>
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">PDF to JPG Converter</h1>
          <p className="text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
            Convert your PDF documents to high-quality JPG images quickly and easily. Extract all pages as separate images.
          </p>
        </div>

        <Card className="shadow-lg overflow-hidden border">
          <div className="bg-muted/20 p-6 border-b">
            <div className="flex items-center gap-3">
              <File className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold">PDF to JPG Converter</h2>
            </div>
            <p className="text-muted-foreground mt-1">
              Upload your PDF and convert each page to a high-quality JPG image
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {!file ? (
              <div 
                className="border-2 border-dashed border-blue-400/30 rounded-xl p-10 text-center hover:border-blue-400 transition-all duration-300 cursor-pointer bg-background"
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
                <h3 className="text-xl font-medium mb-3">Drag & Drop PDF File Here</h3>
                <p className="text-muted-foreground mb-5 max-w-md mx-auto">Select a PDF file from your device or drag it directly into this area</p>
                <Button variant="outline" size="lg" className="gap-2 border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white">
                  <Upload className="w-4 h-4" /> Browse Files
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Selected File</h3>
                  <Button variant="outline" size="sm" onClick={clearFile} className="text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4 mr-2" /> Remove File
                  </Button>
                </div>
                
                <div className="bg-muted/20 rounded-lg overflow-hidden p-4 flex items-center space-x-4 border">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <File className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{file.name}</h4>
                    <p className="text-muted-foreground text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
            )}

            {isConverting && (
              <div className="space-y-2 bg-blue-500/5 p-4 rounded-lg border border-blue-400/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="animate-pulse">
                    <FileImage className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="font-medium">Creating your JPG images...</p>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-muted-foreground">{Math.round(progress)}%</p>
              </div>
            )}

            {showPreview && convertedPages.length > 0 && (
              <div className="space-y-4 bg-card/50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Converted Images</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadAllImages}
                    className="gap-2 text-blue-500 border-blue-500/30 hover:bg-blue-500/10"
                  >
                    <Download className="w-4 h-4" /> Download All
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {convertedPages.map((page, index) => (
                    <div key={index} className="group relative border rounded-lg overflow-hidden bg-background">
                      <div className="aspect-square overflow-hidden flex items-center justify-center">
                        <img src={page} alt={`Page ${index + 1}`} className="object-contain w-full h-full" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm font-medium">Page {index + 1}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => downloadImage(page, index)}
                            className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden canvas for rendering PDF pages */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
          
          <div className="border-t p-6 bg-muted/10">
            <Button 
              onClick={convertToJPG} 
              disabled={isConverting || !file}
              className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white"
              size="lg"
            >
              <Download className="w-5 h-5" /> 
              {isConverting ? 'Converting...' : 'Convert to JPG Images'}
            </Button>
          </div>
        </Card>
        
        {/* Features section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Why Use Our PDF to JPG Converter?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Free & Easy</h3>
              <p className="text-muted-foreground">No signup required. Just upload and convert your PDF instantly.</p>
            </div>
            <div className="bg-card border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">High Quality</h3>
              <p className="text-muted-foreground">Get high-resolution JPG images that preserve the details of your PDF documents.</p>
            </div>
            <div className="bg-card border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Privacy First</h3>
              <p className="text-muted-foreground">Your files are processed locally. We never store or share your documents.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PDFToJPGConverter;
