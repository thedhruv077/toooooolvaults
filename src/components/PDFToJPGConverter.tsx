
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileImage, Upload, Trash2, Download, Check, AlertCircle, File, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Unable to get canvas context');
      }
      
      // Convert each page to JPG
      for (let i = 1; i <= totalPages; i++) {
        try {
          // Get the page
          const page = await pdf.getPage(i);
          
          // Set scale for better quality (adjust as needed)
          const scale = 2.0;
          const viewport = page.getViewport({ scale });
          
          // Set canvas dimensions to match the page
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          // Clear canvas before rendering new page
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
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
        } catch (pageError) {
          console.error(`Error processing page ${i}:`, pageError);
          // Continue with other pages even if one fails
          continue;
        }
      }
      
      setConvertedPages(convertedImages);
      setShowPreview(true);
      
      toast({
        title: "Conversion complete",
        description: `PDF file has been converted to ${convertedImages.length} JPG image${convertedImages.length > 1 ? 's' : ''}`,
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
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `page-${index + 1}.jpg`;
      
      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Download failed",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadAllImages = () => {
    if (convertedPages.length === 0) {
      toast({
        title: "No images to download",
        description: "Please convert a PDF file first",
        variant: "destructive",
      });
      return;
    }
    
    // Download each image individually with a delay between downloads
    convertedPages.forEach((page, index) => {
      setTimeout(() => {
        downloadImage(page, index);
      }, index * 100);
    });
    
    toast({
      title: "Download started",
      description: "Your converted images are being downloaded",
    });
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 bg-white">
      <Helmet>
        <title>PDF to JPG Converter | Free Online PDF to Image Tool | Tool Vault</title>
        <meta name="description" content="Convert PDF files to high-quality JPG images online for free. Extract pages as separate images with our fast, secure converter. No watermark, no registration." />
        <meta name="keywords" content="pdf to jpg, pdf to jpeg, convert pdf to images, pdf converter, image extraction, free pdf converter, online pdf tool, extract pdf pages, pdf to image converter" />
        <meta property="og:title" content="PDF to JPG Converter | Free Online Tool" />
        <meta property="og:description" content="Convert PDF files to high-quality JPG images online for free. No registration or watermarks." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://toolvault.com/utilities/pdf-to-jpg" />
      </Helmet>
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">PDF to JPG Converter</h1>
            <ThemeToggle className="ml-4" />
          </div>
          <p className="dark:text-gray-300 text-gray-700 max-w-2xl mx-auto">
            Convert your PDF documents to high-quality JPG images quickly and easily. Extract all pages as separate images.
          </p>
        </div>

        <Card className="shadow-lg overflow-hidden border dark:border-slate-700/80 backdrop-blur-sm dark:bg-slate-800/50 bg-white">
          <div className="dark:bg-slate-700/50 bg-gray-50 p-6 border-b dark:border-slate-600/50 border-gray-100">
            <div className="flex items-center gap-3">
              <File className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold dark:text-white text-slate-900">PDF to JPG Converter</h2>
            </div>
            <p className="dark:text-gray-300 text-gray-700 mt-1">
              Upload your PDF and convert each page to a high-quality JPG image
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {!file ? (
              <div 
                className="border-2 border-dashed border-blue-400/30 rounded-xl p-10 text-center hover:border-blue-400 transition-all duration-300 cursor-pointer dark:bg-slate-800/50 bg-gray-50"
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
                <h3 className="text-xl font-medium mb-3 dark:text-white text-slate-900">Drag & Drop PDF File Here</h3>
                <p className="dark:text-gray-300 text-gray-700 mb-5 max-w-md mx-auto">Select a PDF file from your device or drag it directly into this area</p>
                <Button variant="outline" size="lg" className="gap-2 border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white">
                  <Upload className="w-4 h-4" /> Browse Files
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium dark:text-white text-slate-900">Selected File</h3>
                  <Button variant="outline" size="sm" onClick={clearFile} className="text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4 mr-2" /> Remove File
                  </Button>
                </div>
                
                <div className="dark:bg-slate-700/30 bg-gray-50 rounded-lg overflow-hidden p-4 flex items-center space-x-4 border dark:border-slate-600/50 border-gray-200">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <File className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="dark:text-white text-slate-900 font-medium truncate">{file.name}</h4>
                    <p className="dark:text-gray-400 text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
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
                  <p className="font-medium dark:text-white text-slate-900">Creating your JPG images...</p>
                </div>
                <div className="h-2 w-full dark:bg-slate-700 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs dark:text-gray-400 text-gray-500">{Math.round(progress)}%</p>
              </div>
            )}

            {showPreview && convertedPages.length > 0 && (
              <div className="space-y-4 dark:bg-slate-900/40 bg-gray-50 p-4 rounded-lg border dark:border-slate-700/50 border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium dark:text-white text-slate-900">Converted Images</h3>
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
                    <div key={index} className="group relative border dark:border-slate-600/50 border-gray-200 rounded-lg overflow-hidden dark:bg-slate-800/50 bg-white">
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

            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
          
          <div className="border-t dark:border-slate-600/50 border-gray-100 p-6 dark:bg-slate-800/30 bg-gray-50">
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
        
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8 dark:text-white text-slate-900">Why Use Our PDF to JPG Converter?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white text-slate-900">Free & Easy</h3>
              <p className="dark:text-gray-300 text-gray-700">No signup required. Just upload and convert your PDF instantly.</p>
            </div>
            <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white text-slate-900">High Quality</h3>
              <p className="dark:text-gray-300 text-gray-700">Get high-resolution JPG images that preserve the details of your PDF documents.</p>
            </div>
            <div className="dark:bg-slate-800/50 bg-white border dark:border-slate-700/50 border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white text-slate-900">Privacy First</h3>
              <p className="dark:text-gray-300 text-gray-700">Your files are processed locally. We never store or share your documents.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 dark:bg-slate-800/30 bg-gray-50 p-6 rounded-xl border dark:border-slate-700/50 border-gray-200">
          <h2 className="text-xl font-semibold mb-4 dark:text-white text-slate-900">How to Convert PDF to JPG</h2>
          <div className="space-y-4 dark:text-gray-300 text-gray-700">
            <p>Converting PDF documents to JPG images is simple with our tool:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Upload:</strong> Select a PDF file by clicking the upload area or dragging and dropping it.</li>
              <li><strong>Convert:</strong> Click the "Convert to JPG Images" button to process your document.</li>
              <li><strong>Download:</strong> Once conversion is complete, download individual images or all pages at once.</li>
            </ol>
            <p>Our tool converts each page of your PDF to a separate high-quality JPG image, making it perfect for presentations, social media sharing, or printing.</p>
            <p>The conversion happens entirely in your browser - your sensitive documents never leave your computer.</p>
          </div>
        </div>

        <div className="mt-12 dark:bg-slate-800/30 bg-gray-50 p-6 rounded-xl border dark:border-slate-700/50 border-gray-200">
          <h2 className="text-xl font-semibold mb-4 dark:text-white text-slate-900">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium dark:text-white text-slate-900 mb-2">What file formats does this tool support?</h3>
              <p className="dark:text-gray-300 text-gray-700">Our tool supports PDF files (.pdf) as input and converts them to JPG image format.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium dark:text-white text-slate-900 mb-2">Is there a limit to the file size I can convert?</h3>
              <p className="dark:text-gray-300 text-gray-700">Since conversion happens locally in your browser, the file size limit depends on your device's memory. We recommend files under 100MB for optimal performance.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium dark:text-white text-slate-900 mb-2">What image quality can I expect?</h3>
              <p className="dark:text-gray-300 text-gray-700">Our converter produces high-resolution JPG images that maintain the visual quality of your original PDF. The images are rendered at 2x scale for maximum clarity.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium dark:text-white text-slate-900 mb-2">Is this service really free?</h3>
              <p className="dark:text-gray-300 text-gray-700">Yes, our PDF to JPG converter is completely free to use with no watermarks on the converted images.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PDFToJPGConverter;
