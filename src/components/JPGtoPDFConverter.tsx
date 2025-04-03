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
      </main>
      <Footer />
    </div>
  );
};

export default JPGtoPDFConverter;
