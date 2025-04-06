import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileImage, Upload, Trash2, Download, Check, AlertCircle, Image, ImagePlus, FilePlus, Zap, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import { ThemeToggle } from "./ui/theme-toggle";

// Fixed import for jsPDF v3.0.1
import { jsPDF } from "jspdf";

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
      // Fixed initialization for jsPDF v3.0.1
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true
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
              
              const dataUrl = canvas.toDataURL("image/jpeg");
              
              if (i > 0) {
                doc.addPage();
              }
              
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();
              
              let imgWidth = pageWidth - 20;
              let imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              if (imgHeight > pageHeight - 20) {
                imgHeight = pageHeight - 20;
                imgWidth = (canvas.width * imgHeight) / canvas.height;
              }
              
              const x = (pageWidth - imgWidth) / 2;
              const y = (pageHeight - imgHeight) / 2;
              
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

  // ... (keep all other functions exactly the same: removeImage, clearAll)

  return (
    // ... (keep your entire JSX return section exactly as is)
  );
};

export default JPGtoPDFConverter;
