
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import { FileImage, Upload, Trash2, Download, Check, AlertCircle, Image, ImagePlus, FilePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

const JPGtoPDFConverter = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Array<{ url: string; id: string }>>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const createPreviews = (selectedFiles: File[]) => {
    return selectedFiles.map(file => ({
      url: URL.createObjectURL(file),
      id: generateUniqueId()
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => 
      file.type === "image/jpeg" || 
      file.type === "image/jpg" || 
      file.type === "image/png"
    );
    
    if (validFiles.length !== selectedFiles.length) {
      toast({
        title: "Invalid file format",
        description: "Only JPG, JPEG, and PNG files are supported",
        variant: "destructive",
      });
    }
    
    if (validFiles.length > 0) {
      const newPreviews = createPreviews(validFiles);
      
      setFiles(prev => [...prev, ...validFiles]);
      setPreviews(prev => [...prev, ...newPreviews]);
      
      toast({
        title: "Images uploaded",
        description: `${validFiles.length} image${validFiles.length > 1 ? 's' : ''} added successfully`,
      });
    }

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
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.type === "image/jpeg" || 
      file.type === "image/jpg" || 
      file.type === "image/png"
    );
    
    if (validFiles.length !== droppedFiles.length) {
      toast({
        title: "Invalid file format",
        description: "Only JPG, JPEG, and PNG files are supported",
        variant: "destructive",
      });
    }
    
    if (validFiles.length > 0) {
      const newPreviews = createPreviews(validFiles);
      
      setFiles(prev => [...prev, ...validFiles]);
      setPreviews(prev => [...prev, ...newPreviews]);
      
      toast({
        title: "Images uploaded",
        description: `${validFiles.length} image${validFiles.length > 1 ? 's' : ''} added successfully`,
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
    
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const clearAllImages = () => {
    previews.forEach(preview => URL.revokeObjectURL(preview.url));
    setPreviews([]);
    setFiles([]);
    
    toast({
      title: "Cleared all images",
      description: "All images have been removed",
    });
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const convertToPdf = async () => {
    if (files.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image to convert",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    
    try {
      // Initialize jsPDF correctly with the right import and constructor
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      for (let i = 0; i < files.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        try {
          const dataUrl = await readFileAsDataURL(files[i]);
          
          const img = new Image();
          await new Promise<void>((resolveImg, rejectImg) => {
            img.onload = () => resolveImg();
            img.onerror = () => rejectImg(new Error(`Failed to load image ${i + 1}`));
            img.src = dataUrl;
          });
          
          const imgRatio = img.width / img.height;
          const pageRatio = pdfWidth / pdfHeight;
          
          let finalWidth, finalHeight;
          
          if (imgRatio > pageRatio) {
            finalWidth = pdfWidth;
            finalHeight = pdfWidth / imgRatio;
          } else {
            finalHeight = pdfHeight;
            finalWidth = pdfHeight * imgRatio;
          }
          
          const xOffset = (pdfWidth - finalWidth) / 2;
          const yOffset = (pdfHeight - finalHeight) / 2;
          
          const imgFormat = files[i].type === 'image/png' ? 'PNG' : 'JPEG';
          
          pdf.addImage(
            dataUrl, 
            imgFormat, 
            xOffset, 
            yOffset, 
            finalWidth, 
            finalHeight
          );
          
          setProgress(((i + 1) / files.length) * 100);
        } catch (err) {
          console.error(`Error processing image ${i + 1}:`, err);
        }
      }
      
      pdf.save('converted-images.pdf');
      
      toast({
        title: "Conversion complete",
        description: `Successfully converted ${files.length} image${files.length > 1 ? 's' : ''} to PDF`,
      });
    } catch (error) {
      console.error("Error converting to PDF:", error);
      toast({
        title: "Conversion failed",
        description: "An error occurred while converting the images to PDF",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      <Helmet>
        <title>JPG to PDF Converter | Free Online Tool | Tool Vault</title>
        <meta name="description" content="Convert your JPG, JPEG, or PNG images to PDF online for free. No watermark, high quality, and easy to use." />
        <meta name="keywords" content="jpg to pdf, image to pdf, convert jpg to pdf, free pdf converter, png to pdf, jpeg to pdf, online converter" />
      </Helmet>
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">JPG to PDF Converter</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Convert your JPG, JPEG, or PNG images to PDF quickly and easily. Maintain quality and create multi-page documents.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-xl shadow-lg overflow-hidden border border-slate-700/80 backdrop-blur-sm">
          <div className="bg-slate-700/50 p-6 border-b border-slate-600/50">
            <div className="flex items-center gap-3">
              <FileImage className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">Image to PDF Converter</h2>
            </div>
            <p className="text-gray-300 mt-1">
              Upload your images and convert them to a single PDF document
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            <div 
              className="border-2 border-dashed border-blue-400/30 rounded-xl p-10 text-center hover:border-blue-400 transition-all duration-300 cursor-pointer bg-slate-800/50"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="mb-4">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImagePlus className="w-10 h-10 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Drag & Drop Images Here</h3>
              <p className="text-gray-300 mb-5 max-w-md mx-auto">Select JPG, JPEG, or PNG files from your device or drag them directly into this area</p>
              <Button variant="outline" size="lg" className="gap-2 border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white">
                <Upload className="w-4 h-4" /> Browse Files
              </Button>
            </div>

            {previews.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-white">Selected Images</h3>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md text-sm font-medium">{previews.length}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearAllImages} className="text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4 mr-2" /> Clear All
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previews.map((preview, index) => (
                    <div key={preview.id} className="relative group bg-slate-700/30 rounded-lg overflow-hidden aspect-square border border-slate-600/50 transition-all duration-300 hover:shadow-md">
                      <img
                        src={preview.url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          console.error("Image failed to load:", preview.url);
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                          e.currentTarget.classList.add("p-4");
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white text-xs py-1.5 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 truncate">
                        {files[index]?.name || `Image ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isConverting && (
              <div className="space-y-2 bg-blue-500/5 p-4 rounded-lg border border-blue-400/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="animate-pulse">
                    <FilePlus className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="font-medium text-white">Creating your PDF...</p>
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
              onClick={convertToPdf} 
              disabled={isConverting || previews.length === 0}
              className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white"
              size="lg"
            >
              <Download className="w-5 h-5" /> 
              {isConverting ? 'Converting...' : 'Convert to PDF'}
            </Button>
          </div>
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8 text-white">Why Use Our JPG to PDF Converter?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Free & Easy</h3>
              <p className="text-gray-300">No signup required. Just upload and convert your images instantly.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">High Quality</h3>
              <p className="text-gray-300">Maintains image quality during conversion for professional-looking PDFs.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Privacy First</h3>
              <p className="text-gray-300">Your images are processed locally. We never store or share your files.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JPGtoPDFConverter;
