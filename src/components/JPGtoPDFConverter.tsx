
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
      
      for (let i = 0; i < previews.length; i++) {
        try {
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
        } catch (imageError) {
          console.error(`Error processing image ${i}:`, imageError);
          // Continue with other images
          continue;
        }
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      <Helmet>
        <title>JPG to PDF Converter | Free Online Image to PDF Tool | Tool Vault</title>
        <meta name="description" content="Convert your JPG, JPEG, or PNG images to PDF online for free. Combine multiple images into one PDF document. No registration, no watermarks." />
        <meta name="keywords" content="jpg to pdf, jpeg to pdf, png to pdf, image to pdf, combine images, photo to pdf, convert jpg to pdf, free pdf converter, online pdf creator" />
        <meta property="og:title" content="JPG to PDF Converter | Free Online Tool" />
        <meta property="og:description" content="Convert your images to PDF online for free. No registration or watermarks." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://toolvault.com/utilities/jpg-to-pdf" />
      </Helmet>
      
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">JPG to PDF Converter</h1>
          <p className="text-gray-300 mb-8 max-w-2xl">
            Convert your JPG, JPEG, or PNG images to PDF with our free online converter. Combine multiple images into a single document with no watermarks.
          </p>
          
          <Card className="mb-8 shadow-lg overflow-hidden border border-slate-700/80 backdrop-blur-sm bg-slate-800/50">
            <CardHeader className="bg-slate-700/50 border-b border-slate-600/50">
              <CardTitle className="flex items-center gap-2 text-white">
                <FileImage className="h-5 w-5 text-blue-400" />
                <span>Upload Images</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Select or drag & drop your image files (JPG, JPEG, PNG)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                className="border-2 border-dashed border-blue-400/30 rounded-lg p-8 text-center cursor-pointer hover:bg-slate-700/20 transition-colors bg-slate-800/50"
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
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <ImagePlus className="h-8 w-8 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-400">JPG, JPEG, or PNG files</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {previews.length > 0 && (
            <Card className="mb-8 shadow-lg overflow-hidden border border-slate-700/80 backdrop-blur-sm bg-slate-800/50">
              <CardHeader className="bg-slate-700/50 border-b border-slate-600/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <FilePlus className="h-5 w-5 text-blue-400" />
                    <span>Image Preview</span>
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearAll} 
                    className="text-red-400 hover:text-red-400 hover:bg-red-500/10 border-red-400/30"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                <CardDescription className="text-gray-300">
                  {previews.length} image{previews.length > 1 ? 's' : ''} selected
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {previews.map((preview, index) => (
                    <div key={preview.id} className="relative rounded-lg overflow-hidden border border-slate-600/50 group bg-slate-800/50">
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
                          className="h-7 w-7 bg-white/20 hover:bg-white/30"
                          onClick={() => rotateImage(preview.id)}
                        >
                          <RotateCcw className="h-3.5 w-3.5 text-white" />
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
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm py-1 px-2 text-xs text-white">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4 bg-slate-800/30 border-t border-slate-600/50 p-6">
                {isConverting ? (
                  <div className="w-full">
                    <div className="mb-2 flex items-center justify-between text-white">
                      <span>Converting...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white" 
                    size="lg"
                    onClick={convertToPdf}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Convert to PDF
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
          
          <Card className="shadow-lg overflow-hidden border border-slate-700/80 backdrop-blur-sm bg-slate-800/50">
            <CardHeader className="bg-slate-700/50 border-b border-slate-600/50">
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-blue-400" />
                <span>How to Convert JPG to PDF</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ol className="list-decimal list-inside space-y-3 ml-2 text-gray-300">
                <li>
                  <span className="font-medium text-white">Upload Images:</span> Click the upload area or drag and drop your JPG, JPEG, or PNG files.
                </li>
                <li>
                  <span className="font-medium text-white">Arrange & Rotate:</span> Preview your images, rotate if needed, and arrange them in the desired order.
                </li>
                <li>
                  <span className="font-medium text-white">Convert:</span> Click the "Convert to PDF" button to create your PDF document.
                </li>
                <li>
                  <span className="font-medium text-white">Download:</span> Your PDF will be generated and automatically downloaded to your device.
                </li>
              </ol>
            </CardContent>
            <CardFooter className="p-6 bg-slate-900/40 border-t border-slate-600/50">
              <div className="text-sm text-gray-300 space-y-2">
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Free to use - No registration required</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>No watermarks on converted PDF files</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Files converted locally - your data never leaves your device</span>
                </div>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-12 bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-xl font-semibold mb-4 text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">What image formats can I convert to PDF?</h3>
                <p className="text-gray-300">Our converter supports JPG (JPEG) and PNG image formats. You can upload multiple images in these formats to combine them into a single PDF.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Is there a limit to how many images I can convert?</h3>
                <p className="text-gray-300">While there is no strict limit on the number of images, we recommend keeping it under 50 images per PDF for optimal performance. Very large collections of high-resolution images may cause browser performance issues.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">What happens to my images after conversion?</h3>
                <p className="text-gray-300">Your images are processed entirely within your browser and are never uploaded to our servers. Once you close the page or clear your browser cache, all temporary image data is removed.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Can I change the order of images in the PDF?</h3>
                <p className="text-gray-300">Currently, the images are arranged in the PDF in the order they were uploaded. For specific ordering, you should upload your images in the desired sequence.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
            <h2 className="text-xl font-semibold mb-4 text-white">Benefits of Converting JPG to PDF</h2>
            <div className="space-y-3 text-gray-300">
              <p>Converting your JPG images to PDF format offers several advantages:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><span className="font-medium text-white">Document Organization:</span> Combine multiple images into a single, easy-to-manage PDF file.</li>
                <li><span className="font-medium text-white">Professional Sharing:</span> PDF files maintain their format across all devices and platforms, making them ideal for professional sharing.</li>
                <li><span className="font-medium text-white">Smaller File Size:</span> Converting multiple images to a PDF can result in a smaller overall file size compared to the original images.</li>
                <li><span className="font-medium text-white">Easy Printing:</span> PDFs are optimized for printing, ensuring your images print exactly as they appear on screen.</li>
                <li><span className="font-medium text-white">Security:</span> PDF format offers more security options than standard image formats.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JPGtoPDFConverter;
