
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
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

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  // Generate a unique ID for each preview
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

  // Helper function to create file reader promise
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
          // Convert the file to data URL
          const dataUrl = await readFileAsDataURL(files[i]);
          
          // Create an image element to get dimensions
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
          // Continue with the next image
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
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>JPG to PDF Converter | Free Online Tool | Tool Vault</title>
        <meta name="description" content="Convert your JPG, JPEG, or PNG images to PDF online for free. No watermark, high quality, and easy to use." />
        <meta name="keywords" content="jpg to pdf, image to pdf, convert jpg to pdf, free pdf converter, png to pdf, jpeg to pdf, online converter" />
      </Helmet>
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">JPG to PDF Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert your JPG, JPEG, or PNG images to PDF quickly and easily. Maintain quality and create multi-page documents.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg overflow-hidden premium-shadow border border-border/50 backdrop-blur-sm">
          <div className="bg-accent/10 p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <FileImage className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-semibold">Image to PDF Converter</h2>
            </div>
            <p className="text-muted-foreground mt-1">
              Upload your images and convert them to a single PDF document
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            <div 
              className="border-2 border-dashed border-accent/30 rounded-xl p-10 text-center hover:border-accent transition-all duration-300 cursor-pointer bg-accent/5"
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
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImagePlus className="w-10 h-10 text-accent" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-3">Drag & Drop Images Here</h3>
              <p className="text-muted-foreground mb-5 max-w-md mx-auto">Select JPG, JPEG, or PNG files from your device or drag them directly into this area</p>
              <Button variant="outline" size="lg" className="gap-2 border-accent text-accent hover:bg-accent hover:text-white">
                <Upload className="w-4 h-4" /> Browse Files
              </Button>
            </div>

            {previews.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">Selected Images</h3>
                    <span className="bg-accent/20 text-accent px-2 py-1 rounded-md text-sm font-medium">{previews.length}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearAllImages} className="text-red-500 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4 mr-2" /> Clear All
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previews.map((preview, index) => (
                    <div key={preview.id} className="relative group bg-muted/30 rounded-lg overflow-hidden aspect-square border border-border transition-all duration-300 hover:shadow-md">
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={preview.url}
                          alt={`Image ${index + 1}`}
                          className="max-w-full max-h-full object-contain p-2"
                        />
                      </div>
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
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white text-xs py-1.5 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        {files[index]?.name || `Image ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isConverting && (
              <div className="space-y-2 bg-accent/5 p-4 rounded-lg border border-accent/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="animate-pulse">
                    <FilePlus className="w-5 h-5 text-accent" />
                  </div>
                  <p className="font-medium">Creating your PDF...</p>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs text-muted-foreground">{Math.round(progress)}%</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-border/50 p-6 bg-muted/30">
            <Button 
              onClick={convertToPdf} 
              disabled={isConverting || previews.length === 0}
              className="w-full gap-2 bg-accent hover:bg-accent/90 text-white"
              size="lg"
            >
              <Download className="w-5 h-5" /> 
              {isConverting ? 'Converting...' : 'Convert to PDF'}
            </Button>
          </div>
        </div>
        
        {/* Features section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">Why Use Our JPG to PDF Converter?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-medium mb-2">Free & Easy</h3>
              <p className="text-muted-foreground">No signup required. Just upload and convert your images instantly.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-medium mb-2">High Quality</h3>
              <p className="text-muted-foreground">Maintains image quality during conversion for professional-looking PDFs.</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-medium mb-2">Privacy First</h3>
              <p className="text-muted-foreground">Your images are processed locally. We never store or share your files.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JPGtoPDFConverter;
