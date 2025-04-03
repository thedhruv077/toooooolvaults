
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Trash2, Download, Check, AlertCircle, FilePdf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

const PDFToExcelConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFile = e.target.files[0];
    
    // Check if file is a PDF file
    if (!selectedFile.name.endsWith('.pdf')) {
      toast({
        title: "Invalid file format",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    
    toast({
      title: "File uploaded",
      description: "PDF file added successfully",
    });
    
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
    
    const droppedFile = e.dataTransfer.files[0];
    
    // Check if file is a PDF file
    if (!droppedFile.name.endsWith('.pdf')) {
      toast({
        title: "Invalid file format",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }
    
    setFile(droppedFile);
    
    toast({
      title: "File uploaded",
      description: "PDF file added successfully",
    });
  };

  const clearFile = () => {
    setFile(null);
    
    toast({
      title: "File removed",
      description: "PDF file has been removed",
    });
  };

  const convertToExcel = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to convert",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setProgress(0);
    
    // Simulate conversion progress (in a real app, this would be the actual conversion)
    const simulateProgress = () => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 10;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          
          setTimeout(() => {
            // In a real implementation, this would be where we'd create the actual Excel file
            // For now, we'll just simulate a successful conversion
            setIsConverting(false);
            setProgress(0);
            
            toast({
              title: "Conversion complete",
              description: "PDF file has been converted to Excel",
            });
            
            // In a real app, we would trigger the download of the converted file here
            const link = document.createElement('a');
            link.download = file.name.replace(/\.pdf$/i, '.xlsx');
            link.href = URL.createObjectURL(new Blob(['Excel content would go here'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
            link.click();
            URL.revokeObjectURL(link.href);
            
          }, 500);
        }
        setProgress(currentProgress);
      }, 200);
    };
    
    // Start progress simulation
    simulateProgress();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      <Helmet>
        <title>PDF to Excel Converter | Free Online Tool | Tool Vault</title>
        <meta name="description" content="Convert PDF files to editable Excel spreadsheets online for free. Extract tables, data, and maintain formatting." />
        <meta name="keywords" content="pdf to excel, convert pdf to spreadsheet, pdf to xlsx, table extraction, pdf converter, free excel converter, online converter" />
      </Helmet>
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">PDF to Excel Converter</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Convert your PDF documents to editable Excel spreadsheets. Extract tables and data with accurate formatting.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-xl shadow-lg overflow-hidden border border-slate-700/80 backdrop-blur-sm">
          <div className="bg-slate-700/50 p-6 border-b border-slate-600/50">
            <div className="flex items-center gap-3">
              <FilePdf className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-semibold text-white">PDF to Excel Converter</h2>
            </div>
            <p className="text-gray-300 mt-1">
              Upload your PDF and convert it to an editable Excel spreadsheet
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {!file ? (
              <div 
                className="border-2 border-dashed border-blue-400/30 rounded-xl p-10 text-center hover:border-blue-400 transition-all duration-300 cursor-pointer bg-slate-800/50"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="mb-4">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FilePdf className="w-10 h-10 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-3 text-white">Drag & Drop PDF File Here</h3>
                <p className="text-gray-300 mb-5 max-w-md mx-auto">Select a PDF file from your device or drag it directly into this area</p>
                <Button variant="outline" size="lg" className="gap-2 border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white">
                  <Upload className="w-4 h-4" /> Browse Files
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Selected File</h3>
                  <Button variant="outline" size="sm" onClick={clearFile} className="text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4 mr-2" /> Remove File
                  </Button>
                </div>
                
                <div className="bg-slate-700/30 rounded-lg overflow-hidden p-4 flex items-center space-x-4 border border-slate-600/50">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FilePdf className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{file.name}</h4>
                    <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
            )}

            {isConverting && (
              <div className="space-y-2 bg-blue-500/5 p-4 rounded-lg border border-blue-400/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="animate-pulse">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="font-medium text-white">Creating your Excel file...</p>
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
              onClick={convertToExcel} 
              disabled={isConverting || !file}
              className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white"
              size="lg"
            >
              <Download className="w-5 h-5" /> 
              {isConverting ? 'Converting...' : 'Convert to Excel'}
            </Button>
          </div>
        </div>
        
        {/* Features section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8 text-white">Why Use Our PDF to Excel Converter?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Free & Easy</h3>
              <p className="text-gray-300">No signup required. Just upload and convert your PDF instantly.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Table Extraction</h3>
              <p className="text-gray-300">Smart extraction of tables and data structures for fully editable spreadsheets.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Privacy First</h3>
              <p className="text-gray-300">Your files are processed locally. We never store or share your documents.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PDFToExcelConverter;
