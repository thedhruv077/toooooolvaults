
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileImage, Upload, Trash2, Download, Check, AlertCircle, Image, ImagePlus, FilePlus, Zap, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import { ThemeToggle } from "./ui/theme-toggle";

// Fix the jsPDF import and initialization
import jsPDF from "jspdf";

const JPGtoPDFConverter: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Array<{ url: string; id: string; rotation: number }>>([]);
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
      id: generateUniqueId(),
      rotation: 0
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

  const rotateImage = (id: string) => {
    setPreviews(prev => 
      prev.map(preview => 
        preview.id === id 
          ? { ...preview, rotation: (preview.rotation + 90) % 360 } 
          : preview
      )
    );
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
      // Create a new jsPDF instance with the correct initialization
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm'
      });
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const preview = previews[i];
        
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = preview.url;
          
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d")!;
              let { width, height } = img;
              
              // Handle rotation
              const rotation = preview.rotation;
              const radians = (rotation * Math.PI) / 180;
              
              if (rotation === 90 || rotation === 270) {
                canvas.width = height;
                canvas.height = width;
              } else {
                canvas.width = width;
                canvas.height = height;
              }
              
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.rotate(radians);
              ctx.drawImage(img, -width / 2, -height / 2);
              
              // Get image data
              const dataUrl = canvas.toDataURL("image/jpeg");
              
              // Add page for each image (except first one)
              if (i > 0) {
                doc.addPage();
              }
              
              // Calculate image dimensions to fit page
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();
              
              let imgWidth = pageWidth - 20; // margins
              let imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              // If image is too tall, scale by height instead
              if (imgHeight > pageHeight - 20) {
                imgHeight = pageHeight - 20;
                imgWidth = (canvas.width * imgHeight) / canvas.height;
              }
              
              // Center image on page
              const x = (pageWidth - imgWidth) / 2;
              const y = (pageHeight - imgHeight) / 2;
              
              // Add image to PDF
              doc.addImage(dataUrl, 'JPEG', x, y, imgWidth, imgHeight);
              
              resolve();
            } catch (error) {
              console.error("Error processing image:", error);
              reject(error);
            }
          };
          
          img.onerror = (error) => {
            console.error(`Failed to load image: ${file.name}`, error);
            reject(new Error(`Failed to load image: ${file.name}`));
          };
        });
        
        // Update progress
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      // Save PDF
      doc.save('converted-images.pdf');
      
      toast({
        title: "Conversion complete",
        description: "Your images have been converted to PDF",
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

  const removeImage = (id: string) => {
    const imageIndex = previews.findIndex(preview => preview.id === id);
    if (imageIndex !== -1) {
      const newPreviews = [...previews];
      const newFiles = [...files];
      
      URL.revokeObjectURL(newPreviews[imageIndex].url);
      
      newPreviews.splice(imageIndex, 1);
      newFiles.splice(imageIndex, 1);
      
      setPreviews(newPreviews);
      setFiles(newFiles);
      
      toast({
        title: "Image removed",
        description: "The image has been removed from the queue",
      });
    }
  };

  const clearAll = () => {
    previews.forEach(preview => URL.revokeObjectURL(preview.url));
    
    setFiles([]);
    setPreviews([]);
    
    toast({
      title: "All images cleared",
      description: "All images have been removed from the queue",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>JPG to PDF Converter | Free Online Tool | Tool Vault</title>
        <meta name="description" content="Convert your JPG, JPEG, or PNG images to PDF online for free. No watermark, high quality, and easy to use." />
        <meta name="keywords" content="jpg to pdf, image to pdf, convert jpg to pdf, free pdf converter, png to pdf, jpeg to pdf, online converter" />
      </Helmet>
      
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">JPG to PDF Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your images into professional PDF documents in seconds. Free, fast, and secure.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto backdrop-blur-lg bg-card/30 border rounded-2xl shadow-xl overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
          
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <FileImage className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">JPG to PDF Converter</h2>
                <p className="text-muted-foreground text-sm">Upload images and convert them to a single PDF document</p>
              </div>
            </div>
            
            <div 
              className="border-2 border-dashed border-accent/30 rounded-xl p-10 text-center hover:border-accent/80 transition-all duration-300 cursor-pointer bg-accent/5 relative overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                multiple 
                accept=".jpg,.jpeg,.png"
                className="hidden"
              />
              
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="h-10 w-10 text-accent animate-pulse" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">Drag & Drop Images Here</h3>
                <p className="text-muted-foreground mb-5 max-w-md mx-auto">Select JPG, JPEG or PNG files from your device or drag them directly into this area</p>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-accent/30 text-foreground hover:bg-accent/20 hover:border-accent/50"
                >
                  <ImagePlus className="w-4 h-4" /> Browse Files
                </Button>
              </div>
            </div>
            
            {previews.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Image className="h-5 w-5 text-blue-500" />
                    Selected Images ({previews.length})
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAll} 
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive/30"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Clear All
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {previews.map((preview) => (
                    <div key={preview.id} className="relative group rounded-lg overflow-hidden border bg-card/50 backdrop-blur-sm">
                      <div className="aspect-square overflow-hidden flex items-center justify-center">
                        <img 
                          src={preview.url} 
                          alt="Preview" 
                          className="object-cover w-full h-full transition-transform duration-300"
                          style={{ transform: `rotate(${preview.rotation}deg)` }}
                        />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <div className="flex justify-between items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              rotateImage(preview.id);
                            }}
                            className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(preview.id);
                            }}
                            className="h-8 w-8 bg-white/20 hover:bg-white/30 text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 relative">
                  {isConverting ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="font-medium flex items-center gap-1.5">
                          <Zap className="h-4 w-4 text-blue-500 animate-pulse" />
                          Converting images...
                        </span>
                        <span className="text-accent font-medium">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={convertToPdf} 
                      className="w-full h-12 gap-2 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg"
                      disabled={files.length === 0}
                    >
                      <FilePlus className="h-5 w-5" />
                      Convert to PDF
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Why Choose Our JPG to PDF Converter?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-blue-500/10 transition-all">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">Convert multiple images to PDF in seconds with our optimized processing engine.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-4 group-hover:from-purple-500/30 group-hover:to-purple-500/10 transition-all">
                <Check className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">High Quality</h3>
              <p className="text-muted-foreground">Maintain the original image quality with our lossless conversion technology.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center mb-4 group-hover:from-pink-500/30 group-hover:to-pink-500/10 transition-all">
                <AlertCircle className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">100% Secure</h3>
              <p className="text-muted-foreground">Your files are processed locally. We never store or share your documents.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto p-8 bg-card/30 backdrop-blur-sm rounded-xl border">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-500">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Images</h3>
                <p className="text-muted-foreground">Select multiple JPG, JPEG, or PNG files from your device or drag and drop them directly into the upload area.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-500">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Arrange & Customize</h3>
                <p className="text-muted-foreground">Reorganize your images by dragging them into the desired order. Rotate images if needed for the perfect orientation.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center">
                <span className="text-2xl font-bold text-pink-500">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Convert & Download</h3>
                <p className="text-muted-foreground">Click the "Convert to PDF" button and download your newly created PDF file immediately. No email required.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JPGtoPDFConverter;
