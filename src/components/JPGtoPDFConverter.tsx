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
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      let firstPageAdded = false;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const imageLoadPromise = new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          
          img.onload = () => {
            const imgWidth = doc.internal.pageSize.getWidth();
            const imgHeight = (img.height * imgWidth) / img.width;
            
            if (firstPageAdded) {
              doc.addPage();
            } else {
              firstPageAdded = true;
            }
            
            doc.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
            URL.revokeObjectURL(img.src);
            resolve();
          };
          
          img.onerror = () => {
            reject(new Error(`Failed to load image: ${file.name}`));
          };
        });
        
        await imageLoadPromise;
        
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">JPG to PDF Converter</h1>
          <p className="text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
            Convert your JPG, JPEG, or PNG images to PDF quickly and easily. Maintain quality and create multi-page documents.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-6 w-6 text-blue-400" />
              Upload Images
            </CardTitle>
            <CardDescription>
              Select JPG, JPEG, or PNG files to convert to PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
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
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Drag and drop your images here</h3>
              <p className="text-sm text-muted-foreground mb-4">Or click to browse your files</p>
              <Button variant="outline" className="mx-auto">
                <ImagePlus className="mr-2 h-4 w-4" />
                Select Images
              </Button>
            </div>
          </CardContent>
        </Card>

        {previews.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-6 w-6 text-blue-400" />
                  Preview Images ({previews.length})
                </CardTitle>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previews.map((preview) => (
                  <div key={preview.id} className="relative group">
                    <img 
                      src={preview.url} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-md border border-border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(preview.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isConverting ? (
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <span>Converting...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={convertToPdf} 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <FilePlus className="mr-2 h-5 w-5" />
                  Convert to PDF
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-blue-400" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <Upload className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Upload Images</h3>
                  <p className="text-sm text-muted-foreground">Select or drag and drop your JPG, JPEG, or PNG images.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <Check className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Prepare Images</h3>
                  <p className="text-sm text-muted-foreground">Review and arrange your images in the desired order.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <Download className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Convert & Download</h3>
                  <p className="text-sm text-muted-foreground">Click convert and download your PDF file instantly.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default JPGtoPDFConverter;
