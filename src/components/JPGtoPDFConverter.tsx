import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileImage, Upload, Trash2, Download, Check, AlertCircle, Image as ImageIcon, ImagePlus, FilePlus, Zap, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

// Correct import for jsPDF v3
import { jsPDF } from "jspdf";

const JPGtoPDFConverter: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Array<{ url: string; id: string; rotation: number }>>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Clean up object URLs
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
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      
      for (let i = 0; i < files.length; i++) {
        const preview = previews[i];
        
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
              }
              
              if (preview.rotation % 180 === 90) {
                canvas.width = img.height;
                canvas.height = img.width;
              } else {
                canvas.width = img.width;
                canvas.height = img.height;
              }

              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.save();
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.rotate((preview.rotation * Math.PI) / 180);
              ctx.drawImage(img, -img.width / 2, -img.height / 2);
              ctx.restore();

              const imgData = canvas.toDataURL("image/jpeg", 0.95);
              
              if (i > 0) doc.addPage();
              
              let imgWidth = pageWidth - 2 * margin;
              let imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              if (imgHeight > pageHeight - 2 * margin) {
                imgHeight = pageHeight - 2 * margin;
                imgWidth = (canvas.width * imgHeight) / canvas.height;
              }
              
              const x = (pageWidth - imgWidth) / 2;
              const y = (pageHeight - imgHeight) / 2;
              
              doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
              resolve();
            } catch (error) {
              console.error("Image processing error:", error);
              reject(new Error(`Failed to process image: ${files[i].name}`));
            }
          };

          img.onerror = () => {
            console.error(`Failed to load image: ${files[i].name}`);
            reject(new Error(`Failed to load image: ${files[i].name}`));
          };

          img.src = preview.url;
        });

        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      doc.save('converted-images.pdf');
      toast({
        title: "Conversion complete",
        description: "Your PDF has been downloaded successfully",
      });
    } catch (error) {
      console.error('PDF conversion failed:', error);
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">JPG to PDF Converter</h1>
          <p className="text-foreground/70 mb-8">
            Convert your JPG, JPEG, or PNG images to PDF with our free online converter. No watermark, high quality output.
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5 text-accent" />
                <span>Upload Images</span>
              </CardTitle>
              <CardDescription>
                Select or drag & drop your image files (JPG, JPEG, PNG)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-accent/5 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple 
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <ImagePlus className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-foreground/70">JPG, JPEG, or PNG files</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {previews.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FilePlus className="h-5 w-5 text-accent" />
                    <span>Image Preview</span>
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAll} 
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                <CardDescription>
                  {previews.length} image{previews.length > 1 ? 's' : ''} selected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {previews.map((preview, index) => (
                    <div key={preview.id} className="relative rounded-lg overflow-hidden border border-border group">
                      <div style={{ position: "relative", paddingTop: "75%" }}>
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            transform: `rotate(${preview.rotation}deg)`,
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => rotateImage(preview.id)}
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeImage(preview.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur-sm py-1 px-2 text-xs">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                {isConverting ? (
                  <div className="w-full">
                    <div className="mb-2 flex items-center justify-between">
                      <span>Converting...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-accent/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={convertToPdf}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Convert to PDF
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                <span>How to Convert JPG to PDF</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 ml-2">
                <li className="text-foreground/80">
                  <span className="font-medium text-foreground">Upload Images:</span> Click the upload area or drag and drop your JPG, JPEG, or PNG files.
                </li>
                <li className="text-foreground/80">
                  <span className="font-medium text-foreground">Arrange & Rotate:</span> Preview your images, rotate if needed, and arrange them in the desired order.
                </li>
                <li className="text-foreground/80">
                  <span className="font-medium text-foreground">Convert:</span> Click the "Convert to PDF" button to create your PDF document.
                </li>
                <li className="text-foreground/80">
                  <span className="font-medium text-foreground">Download:</span> Your PDF will be generated and automatically downloaded to your device.
                </li>
              </ol>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-foreground/70">
                <div className="flex items-center gap-1 mb-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Free to use - No registration required</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>No watermarks on converted PDF files</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Files converted locally - your data never leaves your device</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JPGtoPDFConverter;
