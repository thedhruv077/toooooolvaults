
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ui/theme-toggle";
import { Menu, X, Calculator, FileUp, Grid, Sparkles, Zap, CheckCircle2, BookOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
          ? "py-2 bg-background/80 shadow-xl border-b border-border backdrop-blur-xl" 
          : "py-3 bg-background/40 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-bold flex items-center group relative">
              <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full animate-pulse-slow opacity-70"></div>
              <span className="relative text-foreground font-medium flex items-center z-10">
                <Sparkles className="w-5 h-5 mr-1 text-blue-500 animate-pulse-slow" />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent font-bold tracking-tight">[𝙩𝘰𝘰Ꙇ𝙫𝕒𝙪𝙡𝙩𝚜]</span>
              </span>
            </Link>
            <ThemeToggle className="ml-2" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <span className="text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-full group-hover:text-accent">
                <Calculator className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Calculators</span>
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-[calc(100%-30px)] -translate-x-1/2 transition-all duration-300"></span>
              </span>
              <div className="absolute top-full left-0 mt-1 w-56 bg-card backdrop-blur-lg border shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-left scale-95 group-hover:scale-100 z-50">
                <div className="p-2 space-y-1">
                  <Link to="/calculators/percentage" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-blue-500/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Percentage Calculator</span>
                  </Link>
                  <Link to="/calculators/emi" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-blue-500/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                    <span>EMI Calculator</span>
                  </Link>
                  <Link to="/calculators/gst" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-blue-500/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                    <span>GST Calculator</span>
                  </Link>
                  <Link to="/calculators/area" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-blue-500/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Area Calculator</span>
                  </Link>
                  <Link to="/calculators/sip" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-blue-500/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                    <span>SIP Calculator</span>
                  </Link>
                  <Link to="/calculators/real-estate" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-blue-500/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Real Estate Calculator</span>
                  </Link>
                  <Link to="/calculators/real-estate-area" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-blue-500/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Real Estate Area Calculator</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative group">
              <span className="text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-full group-hover:text-accent">
                <Grid className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Utilities</span>
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-[calc(100%-30px)] -translate-x-1/2 transition-all duration-300"></span>
              </span>
              <div className="absolute top-full left-0 mt-1 w-56 bg-card backdrop-blur-lg border shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-left scale-95 group-hover:scale-100 z-50">
                <div className="p-2 space-y-1">
                  <Link to="/utilities/qr-code" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-purple-500/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-purple-500" />
                    <span>QR Code Generator</span>
                  </Link>
                  <Link to="/utilities/password" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-purple-500/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-purple-500" />
                    <span>Password Generator</span>
                  </Link>
                  <Link to="/utilities/invoice" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-purple-500/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-purple-500" />
                    <span>Invoice Generator</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative group">
              <span className="text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer bg-primary/5 hover:bg-primary/10 px-4 py-2.5 rounded-full group-hover:text-accent">
                <FileUp className="w-4 h-4 text-green-500" />
                <span className="font-medium">Converters</span>
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-green-500 to-teal-500 group-hover:w-[calc(100%-30px)] -translate-x-1/2 transition-all duration-300"></span>
              </span>
              <div className="absolute top-full left-0 mt-1 w-56 bg-card backdrop-blur-lg border shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-left scale-95 group-hover:scale-100 z-50">
                <div className="p-2 space-y-1">
                  <Link to="/utilities/jpg-to-pdf" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-green-500/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    <span>JPG to PDF</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost"
              size="icon" 
              onClick={toggleMobileMenu} 
              className="md:hidden relative bg-primary/5 hover:bg-primary/10"
            >
              {mobileMenuOpen ? 
                <X className="w-5 h-5 text-foreground/80" /> : 
                <Menu className="w-5 h-5 text-foreground/80" />
              }
              {!mobileMenuOpen && <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>}
            </Button>
          </div>
          
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-card border-t border-border shadow-xl animate-in slide-in-from-top-5 fade-in-20 md:hidden">
              <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-2">
                  <h3 className="font-medium text-lg flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">Tool Categories</span>
                  </h3>
                </div>
                
                <div className="px-3 py-3 rounded-xl bg-primary/5 mb-2">
                  <h4 className="font-medium mb-2 text-sm flex items-center gap-1.5 text-blue-500 uppercase tracking-wide">
                    <Calculator className="w-4 h-4" /> Calculators
                  </h4>
                  <div className="space-y-2 ml-6 mt-3">
                    <Link to="/calculators/percentage" className="block py-1.5 text-sm hover:text-blue-500 transition-colors flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                      Percentage Calculator
                    </Link>
                    <Link to="/calculators/emi" className="block py-1.5 text-sm hover:text-blue-500 transition-colors flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                      EMI Calculator
                    </Link>
                    <Link to="/calculators/gst" className="block py-1.5 text-sm hover:text-blue-500 transition-colors flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                      GST Calculator
                    </Link>
                    <Link to="/calculators/area" className="block py-1.5 text-sm hover:text-blue-500 transition-colors flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                      Area Calculator
                    </Link>
                    <Link to="/calculators/sip" className="block py-1.5 text-sm hover:text-blue-500 transition-colors flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                      SIP Calculator
                    </Link>
                    <Link to="/calculators/real-estate" className="block py-1.5 text-sm hover:text-blue-500 transition-colors flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                      Real Estate Calculator
                    </Link>
                    <Link to="/calculators/real-estate-area" className="block py-1.5 text-sm hover:text-blue-500 transition-colors flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                      Real Estate Area
                    </Link>
                  </div>
                </div>
                
                <div className="px-3 py-3 rounded-xl bg-primary/5 mb-2">
                  <h4 className="font-medium mb-2 text-sm flex items-center gap-1.5 text-purple-500 uppercase tracking-wide">
                    <Grid className="w-4 h-4" /> Utilities
                  </h4>
                  <div className="space-y-2 ml-6 mt-3">
                    <Link to="/utilities/qr-code" className="block py-1.5 text-sm hover:text-purple-500 transition-colors flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                      QR Code Generator
                    </Link>
                    <Link to="/utilities/password" className="block py-1.5 text-sm hover:text-purple-500 transition-colors flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                      Password Generator
                    </Link>
                    <Link to="/utilities/invoice" className="block py-1.5 text-sm hover:text-purple-500 transition-colors flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                      Invoice Generator
                    </Link>
                  </div>
                </div>
                
                <div className="px-3 py-3 rounded-xl bg-primary/5">
                  <h4 className="font-medium mb-2 text-sm flex items-center gap-1.5 text-green-500 uppercase tracking-wide">
                    <FileUp className="w-4 h-4" /> Converters
                  </h4>
                  <div className="space-y-2 ml-6 mt-3">
                    <Link to="/utilities/jpg-to-pdf" className="block py-1.5 text-sm hover:text-green-500 transition-colors flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                      JPG to PDF
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="pt-16 md:pt-20">
        {/* Content padding to account for fixed header */}
      </div>
    </>
  );
};

export default Header;
