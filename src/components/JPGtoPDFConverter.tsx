import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Image, ImagePlus, FilePlus, Zap, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";

const JPGtoPDFConverter = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{url: string, id: string, rotation: number}[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Clean up object URLs
  useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const validFiles = Array.from(e.target.files).filter(file => 
      ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
    );
    
    if (validFiles.length > 0) {
      const newPreviews = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        id: Date.now() + '-' + Math.random().toString(36).slice(2, 9),
        rotation: 0
      }));
      
      setFiles(prev => [...prev, ...validFiles]);
      setPreviews(prev => [...prev, ...newPreviews]);
      toast({
        title: `${validFiles.length} image${validFiles.length > 1 ? 's' : ''} added`,
        description: 'Your images are ready for conversion'
      });
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const convertToPdf = async () => {
    if (files.length === 0) {
      toast({
        title: 'No images selected',
        description: 'Please add images first',
        variant: 'destructive'
      });
      return;
    }

    setIsConverting(true);
    
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      for (let i = 0; i < files.length; i++) {
        const preview = previews[i];
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.src = preview.url;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            
            // Handle rotation
            if (preview.rotation === 90 || preview.rotation === 270) {
              canvas.width = img.height;
              canvas.height = img.width;
            } else {
              canvas.width = img.width;
              canvas.height = img.height;
            }
            
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((preview.rotation * Math.PI) / 180);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            
            const imgData = canvas.toDataURL('image/jpeg');
            if (i > 0) doc.addPage();
            
            // Calculate dimensions to fit page with margins
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 10; // 10mm margin on each side
            
            let imgWidth = pageWidth - margin * 2;
            let imgHeight = (img.height * imgWidth) / img.width;
            
            if (imgHeight > pageHeight - margin * 2) {
              imgHeight = pageHeight - margin * 2;
              imgWidth = (img.width * imgHeight) / img.height;
            }
            
            // Center image
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;
            
            doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
            resolve();
          };
        });
      }
      
      doc.save('converted-images.pdf');
      toast({
        title: 'Conversion complete',
        description: 'PDF downloaded successfully'
      });
    } catch (error) {
      toast({
        title: 'Conversion failed',
        description: 'An error occurred during conversion',
        variant: 'destructive'
      });
    } finally {
      setIsConverting(false);
    }
  };

  const removeImage = (id: string) => {
    const index = previews.findIndex(p => p.id === id);
    if (index !== -1) {
      URL.revokeObjectURL(previews[index].url);
      setFiles(f => f.filter((_, i) => i !== index));
      setPreviews(p => p.filter((_, i) => i !== index));
      toast({
        title: 'Image removed',
        description: 'Image removed from conversion queue'
      });
    }
  };

  const rotateImage = (id: string) => {
    setPreviews(prev => prev.map(p => 
      p.id === id ? {...p, rotation: (p.rotation + 90) % 360} : p
    ));
  };

  const clearAll = () => {
    previews.forEach(p => URL.revokeObjectURL(p.url));
    setFiles([]);
    setPreviews([]);
    toast({
      title: 'Cleared all',
      description: 'All images removed'
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">JPG to PDF Converter</h1>
        <p className="text-gray-600">Convert your images to PDF in seconds</p>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/jpeg, image/jpg, image/png"
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Select your images</h2>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 mt-4"
          >
            <ImagePlus className="w-4 h-4" /> Choose Files
          </Button>
        </div>
      </div>
      
      {previews.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium">Selected Images ({previews.length})</h2>
            <Button 
              variant="outline" 
              onClick={clearAll}
              className="text-red-500"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {previews.map((preview) => (
              <div key={preview.id} className="relative group">
                <div className="aspect-square overflow-hidden rounded-md border bg-gray-100">
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{ transform: `rotate(${preview.rotation}deg)` }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => rotateImage(preview.id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => removeImage(preview.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={convertToPdf}
            className="w-full py-6 text-lg"
            disabled={isConverting}
          >
            {isConverting ? (
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 animate-pulse" />
                <span>Converting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FilePlus className="h-5 w-5" />
                <span>Convert to PDF</span>
              </div>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default JPGtoPDFConverter;
