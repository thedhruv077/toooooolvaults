
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { FileImage, Upload, Trash2, Download, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

const JPGtoPDFConverter = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter(file => 
        file.type === "image/jpeg" || 
        file.type === "image/jpg" || 
        file.type === "image/png"
      );
      
      if (validFiles.length !== filesArray.length) {
        toast({
          title: "Invalid file format",
          description: "Only JPG, JPEG, and PNG files are supported",
          variant: "destructive",
        });
      }
      
      if (validFiles.length > 0) {
        // Create URLs for the new images
        const newImageUrls = validFiles.map(file => URL.createObjectURL(file));
        
        // Update the state
        setImages(prevImages => [...prevImages, ...validFiles]);
        setImageUrls(prevUrls => [...prevUrls, ...newImageUrls]);
        
        // Show success toast
        toast({
          title: "Images uploaded",
          description: `${validFiles.length} image${validFiles.length > 1 ? 's' : ''} uploaded successfully`,
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      const validFiles = filesArray.filter(file => 
        file.type === "image/jpeg" || 
        file.type === "image/jpg" || 
        file.type === "image/png"
      );
      
      if (validFiles.length !== filesArray.length) {
        toast({
          title: "Invalid file format",
          description: "Only JPG, JPEG, and PNG files are supported",
          variant: "destructive",
        });
      }
      
      if (validFiles.length > 0) {
        // Create URLs for the new images
        const newImageUrls = validFiles.map(file => URL.createObjectURL(file));
        
        // Update the state
        setImages(prevImages => [...prevImages, ...validFiles]);
        setImageUrls(prevUrls => [...prevUrls, ...newImageUrls]);
        
        // Show success toast
        toast({
          title: "Images uploaded",
          description: `${validFiles.length} image${validFiles.length > 1 ? 's' : ''} dropped successfully`,
        });
      }
    }
  };

  const removeImage = (index: number) => {
    // Free up memory by revoking URL
    URL.revokeObjectURL(imageUrls[index]);
    
    const newImageUrls = [...imageUrls];
    const newImages = [...images];
    
    newImageUrls.splice(index, 1);
    newImages.splice(index, 1);
    
    setImageUrls(newImageUrls);
    setImages(newImages);
  };

  const clearAllImages = () => {
    // Free up memory by revoking all URLs
    imageUrls.forEach(url => URL.revokeObjectURL(url));
    
    setImages([]);
    setImageUrls([]);
    
    toast({
      title: "Cleared all images",
      description: "All images have been removed",
    });
  };

  // Fixed convertToPdf function that correctly handles image conversion
  const convertToPdf = async () => {
    if (images.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image to convert",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setProgress(0);
    
    try {
      // Create PDF with A4 size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Process each image sequentially
      for (let i = 0; i < images.length; i++) {
        // Add a new page for each image after the first one
        if (i > 0) {
          pdf.addPage();
        }
        
        // Process the image using Promise to handle asynchronous file reading
        await new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onload = async (event) => {
            try {
              if (!event.target || !event.target.result) {
                reject(new Error(`Failed to read image ${i + 1}`));
                return;
              }
              
              // Ensure we're working with a data URL string
              const dataUrl = event.target.result as string;
              
              const img = new Image();
              
              // Load the image to get its dimensions
              await new Promise<void>((resolveImg) => {
                img.onload = () => {
                  // Calculate dimensions to fit the image on the page
                  const imgRatio = img.width / img.height;
                  const pageRatio = pdfWidth / pdfHeight;
                  
                  let finalWidth, finalHeight;
                  
                  if (imgRatio > pageRatio) {
                    // Image is wider than the page aspect ratio
                    finalWidth = pdfWidth;
                    finalHeight = pdfWidth / imgRatio;
                  } else {
                    // Image is taller than the page aspect ratio
                    finalHeight = pdfHeight;
                    finalWidth = pdfHeight * imgRatio;
                  }
                  
                  // Center the image on the page
                  const xOffset = (pdfWidth - finalWidth) / 2;
                  const yOffset = (pdfHeight - finalHeight) / 2;
                  
                  // Add image to PDF with correct format
                  const imgFormat = images[i].type === 'image/png' ? 'PNG' : 'JPEG';
                  
                  // Add the image to the PDF - using the DataURL which is guaranteed to be a string
                  pdf.addImage(
                    dataUrl, 
                    imgFormat, 
                    xOffset, 
                    yOffset, 
                    finalWidth, 
                    finalHeight
                  );
                  
                  resolveImg();
                };
                
                img.onerror = () => {
                  reject(new Error(`Failed to load image ${i + 1}`));
                };
                
                img.src = dataUrl;
              });
              
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          
          reader.onerror = () => {
            reject(new Error(`Failed to read image ${i + 1}`));
          };
          
          // Read the image file as data URL to ensure we get a string result
          reader.readAsDataURL(images[i]);
        });
        
        // Update progress after each image is processed
        setProgress(((i + 1) / images.length) * 100);
      }
      
      // Save the PDF
      pdf.save('converted-images.pdf');
      
      // Show success message
      toast({
        title: "Conversion complete",
        description: `Successfully converted ${images.length} image${images.length > 1 ? 's' : ''} to PDF`,
      });
    } catch (error) {
      console.error("Error converting to PDF:", error);
      toast({
        title: "Conversion failed",
        description: "An error occurred while converting the images to PDF",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">JPG to PDF Converter</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Convert your JPG, JPEG, or PNG images to PDF quickly and easily. Maintain quality and create multi-page documents.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="w-5 h-5 text-accent" />
              <span>Image to PDF Converter</span>
            </CardTitle>
            <CardDescription>
              Upload your images and convert them to a single PDF document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-accent/5 transition-colors cursor-pointer"
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
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Drag & Drop Images Here</h3>
              <p className="text-muted-foreground mb-4">Or click to browse your files</p>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" /> Select Images
              </Button>
            </div>

            {imageUrls.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Selected Images ({imageUrls.length})</h3>
                  <Button variant="outline" size="sm" onClick={clearAllImages}>
                    <Trash2 className="w-4 h-4 mr-2" /> Clear All
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative group bg-background border border-border rounded-md overflow-hidden shadow-sm">
                      <div className="aspect-square relative">
                        <img
                          src={url}
                          alt={`Uploaded image ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-contain p-1"
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 px-2 truncate">
                        {images[index]?.name || `Image ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="space-y-2">
                <div className="h-2 w-full bg-accent/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-muted-foreground">Processing images... {Math.round(progress)}%</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={convertToPdf} 
              disabled={loading || imageUrls.length === 0}
              className="w-full transition-all duration-300 relative overflow-hidden group"
            >
              <span className="flex items-center justify-center relative z-10">
                <Download className="w-4 h-4 mr-2" /> 
                {loading ? 'Converting...' : 'Convert to PDF'}
              </span>
              <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 group-hover:w-full"></span>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default JPGtoPDFConverter;
