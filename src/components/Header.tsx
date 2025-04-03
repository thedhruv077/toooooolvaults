
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ui/theme-toggle";
import { Menu, X, Calculator, FileUp, Grid } from "lucide-react";
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2 glass-panel glass-panel-dark shadow-xl border-b border-white/5" : "py-3 bg-background/40 backdrop-blur-sm"}`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-bold flex items-center group">
              <span className="text-foreground font-medium">[𝙩𝘰𝘰Ꙇ𝙫𝕒𝙪𝙡𝙩𝚜]</span>
            </Link>
            <ThemeToggle className="ml-2" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">
              Home
            </Link>
            <div className="relative group">
              <span className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1 cursor-pointer">
                <Calculator className="w-4 h-4" />
                Calculators
              </span>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background/95 backdrop-blur-lg border border-border/30 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2 space-y-1">
                  <Link to="/calculators/percentage" className="block px-3 py-1.5 rounded text-sm hover:bg-accent/10 transition-colors">
                    Percentage Calculator
                  </Link>
                  <Link to="/calculators/emi" className="block px-3 py-1.5 rounded text-sm hover:bg-accent/10 transition-colors">
                    EMI Calculator
                  </Link>
                  <Link to="/calculators/gst" className="block px-3 py-1.5 rounded text-sm hover:bg-accent/10 transition-colors">
                    GST Calculator
                  </Link>
                  <Link to="/calculators/area" className="block px-3 py-1.5 rounded text-sm hover:bg-accent/10 transition-colors">
                    Area Calculator
                  </Link>
                  <Link to="/calculators/sip" className="block px-3 py-1.5 rounded text-sm hover:bg-accent/10 transition-colors">
                    SIP Calculator
                  </Link>
                  <Link to="/calculators/real-estate" className="block px-3 py-1.5 rounded text-sm hover:bg-accent/10 transition-colors">
                    Real Estate Calculator
                  </Link>
                  <Link to="/calculators/real-estate-area" className="block px-3 py-1.5 rounded text-sm hover:bg-accent/10 transition-colors">
                    Real Estate Area Calculator
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative group">
              <span className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1 cursor-pointer">
                <Grid className="w-4 h-4" />
                Utilities
              </span>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background/95 backdrop-blur-lg border border-border/30 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2 space-y-1">
                  <Link to="/utilities/qr-code" className="block px-3 py-1.5 rounded text-sm hover:bg-accent/10 transition-colors">
                    QR Code Generator
                  </Link>
                  <Link to="/utilities/password" className="block px-3 py-1.5 rounded text-sm hover:bg-accent/10 transition-colors">
                    Password Generator
                  </Link>
                  <Link to="/utilities/invoice" className="block px-3 py-1.5 rounded text-sm hover:bg-accent/10 transition-colors">
                    Invoice Generator
                  </Link>
                  <Link to="/utilities/jpg-to-pdf" className="block px-3 py-1.5 rounded text-sm hover:bg-accent/10 transition-colors">
                    JPG to PDF Converter
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative group">
              <span className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1 cursor-pointer">
                <FileUp className="w-4 h-4" />
                Converters
              </span>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background/95 backdrop-blur-lg border border-border/30 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2 space-y-1">
                  <Link to="/utilities/jpg-to-pdf" className="block px-3 py-1.5 rounded text-sm hover:bg-accent/10 transition-colors">
                    JPG to PDF
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/about" className="text-sm font-medium hover:text-accent transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:text-accent transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu} 
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
          
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg border-t border-border/30 shadow-lg animate-in fade-in slide-in-from-right md:hidden">
              <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border/20 pb-3 mb-2">
                  <h3 className="font-medium text-lg">Menu</h3>
                </div>
                
                <Link to="/" className="px-2 py-2 hover:bg-accent/10 rounded-md transition-colors">
                  Home
                </Link>
                
                <div className="border-t border-border/20 my-2"></div>
                
                <div className="px-2 py-2">
                  <h4 className="font-medium mb-2 text-sm text-foreground/70 flex items-center gap-1">
                    <Calculator className="w-4 h-4" /> Calculators
                  </h4>
                  <div className="space-y-1 ml-4">
                    <Link to="/calculators/percentage" className="block py-1.5 text-sm hover:text-accent transition-colors">
                      Percentage Calculator
                    </Link>
                    <Link to="/calculators/emi" className="block py-1.5 text-sm hover:text-accent transition-colors">
                      EMI Calculator
                    </Link>
                    <Link to="/calculators/gst" className="block py-1.5 text-sm hover:text-accent transition-colors">
                      GST Calculator
                    </Link>
                    <Link to="/calculators/area" className="block py-1.5 text-sm hover:text-accent transition-colors">
                      Area Calculator
                    </Link>
                    <Link to="/calculators/sip" className="block py-1.5 text-sm hover:text-accent transition-colors">
                      SIP Calculator
                    </Link>
                    <Link to="/calculators/real-estate" className="block py-1.5 text-sm hover:text-accent transition-colors">
                      Real Estate Calculator
                    </Link>
                    <Link to="/calculators/real-estate-area" className="block py-1.5 text-sm hover:text-accent transition-colors">
                      Real Estate Area
                    </Link>
                  </div>
                </div>
                
                <div className="px-2 py-2">
                  <h4 className="font-medium mb-2 text-sm text-foreground/70 flex items-center gap-1">
                    <Grid className="w-4 h-4" /> Utilities
                  </h4>
                  <div className="space-y-1 ml-4">
                    <Link to="/utilities/qr-code" className="block py-1.5 text-sm hover:text-accent transition-colors">
                      QR Code Generator
                    </Link>
                    <Link to="/utilities/password" className="block py-1.5 text-sm hover:text-accent transition-colors">
                      Password Generator
                    </Link>
                    <Link to="/utilities/invoice" className="block py-1.5 text-sm hover:text-accent transition-colors">
                      Invoice Generator
                    </Link>
                    <Link to="/utilities/jpg-to-pdf" className="block py-1.5 text-sm hover:text-accent transition-colors">
                      JPG to PDF
                    </Link>
                  </div>
                </div>
                
                <div className="border-t border-border/20 my-2"></div>
                
                <Link to="/about" className="px-2 py-2 hover:bg-accent/10 rounded-md transition-colors">
                  About
                </Link>
                <Link to="/contact" className="px-2 py-2 hover:bg-accent/10 rounded-md transition-colors">
                  Contact
                </Link>
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
