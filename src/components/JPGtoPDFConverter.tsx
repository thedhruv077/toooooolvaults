import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileImage, Upload, Trash2, Download, Check, AlertCircle, Image, ImagePlus, FilePlus, Zap, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import { ThemeToggle } from "./ui/theme-toggle";

import { jsPDF } from "jspdf";

const JPGtoPDFConverter: React.FC = () => {
  // ... [keep all your existing state and functions until the return statement] ...

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
        
        {/* ... [rest of your JSX remains exactly the same] ... */}
      </main>
      
      <Footer />
    </div>
  );
};

export default JPGtoPDFConverter;
