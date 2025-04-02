
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ui/theme-toggle";
import {
  Calculator,
  ChevronDown,
  QrCode,
  Menu,
  X,
  FileText,
  Sparkles,
  FileImage,
  FileUp
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
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
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/40 rounded-lg flex items-center justify-center mr-2 shadow-lg group-hover:shadow-accent/20 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-white animate-pulse-slow" />
              </div>
              <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent font-extrabold tracking-tight">Tool</span>
              <span className="text-foreground font-medium">Vault</span>
            </Link>
            
            <div className="hidden md:flex">
              <ThemeToggle />
            </div>
          </div>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1 py-1">
                  <Calculator className="w-4 h-4 text-accent" />
                  <span>Tools</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="glass-panel glass-panel-dark shadow-xl border border-white/10 animate-fade-in">
                  <div className="grid gap-1 p-2 w-[350px]">
                    <NavigationMenuLink asChild>
                      <Link to="/calculators/percentage" className="nav-dropdown-item group">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                          <Calculator className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Percentage Calculator</span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/calculators/emi" className="nav-dropdown-item group">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                          <Calculator className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">EMI Calculator</span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/calculators/area" className="nav-dropdown-item group">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                          <Calculator className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Area Calculator</span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/calculators/gst" className="nav-dropdown-item group">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                          <Calculator className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">GST Calculator</span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/calculators/sip" className="nav-dropdown-item group">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                          <Calculator className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">SIP Calculator</span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/calculators/real-estate" className="nav-dropdown-item group">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                          <Calculator className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Real Estate Calculator</span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1 py-1">
                  <QrCode className="w-4 h-4 text-accent" />
                  <span>Utilities</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="glass-panel glass-panel-dark shadow-xl border border-white/10 animate-fade-in">
                  <div className="grid gap-1 p-2 w-[350px]">
                    <NavigationMenuLink asChild>
                      <Link to="/utilities/qr-code" className="nav-dropdown-item group">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                          <QrCode className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">QR Code Generator</span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/utilities/password" className="nav-dropdown-item group">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                          <FileText className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Password Generator</span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/utilities/invoice" className="nav-dropdown-item group">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                          <FileText className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Invoice Generator</span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1 py-1">
                  <FileUp className="w-4 h-4 text-accent" />
                  <span>Converters</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="glass-panel glass-panel-dark shadow-xl border border-white/10 animate-fade-in">
                  <div className="grid gap-1 p-2 w-[350px]">
                    <NavigationMenuLink asChild>
                      <Link to="/utilities/jpg-to-pdf" className="nav-dropdown-item group">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                          <FileImage className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">JPG to PDF Converter</span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-background border-t border-border shadow-lg animate-in fade-in slide-in-from-top md:hidden">
              <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Tools</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/calculators/percentage" className="mobile-nav-item" onClick={toggleMobileMenu}>
                    <Calculator className="w-4 h-4" />
                    <span>Percentage</span>
                  </Link>
                  <Link to="/calculators/emi" className="mobile-nav-item" onClick={toggleMobileMenu}>
                    <Calculator className="w-4 h-4" />
                    <span>EMI</span>
                  </Link>
                  <Link to="/calculators/area" className="mobile-nav-item" onClick={toggleMobileMenu}>
                    <Calculator className="w-4 h-4" />
                    <span>Area</span>
                  </Link>
                  <Link to="/calculators/gst" className="mobile-nav-item" onClick={toggleMobileMenu}>
                    <Calculator className="w-4 h-4" />
                    <span>GST</span>
                  </Link>
                  <Link to="/calculators/sip" className="mobile-nav-item" onClick={toggleMobileMenu}>
                    <Calculator className="w-4 h-4" />
                    <span>SIP</span>
                  </Link>
                  <Link to="/calculators/real-estate" className="mobile-nav-item" onClick={toggleMobileMenu}>
                    <Calculator className="w-4 h-4" />
                    <span>Real Estate</span>
                  </Link>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <h3 className="font-medium">Utilities</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/utilities/qr-code" className="mobile-nav-item" onClick={toggleMobileMenu}>
                    <QrCode className="w-4 h-4" />
                    <span>QR Code</span>
                  </Link>
                  <Link to="/utilities/password" className="mobile-nav-item" onClick={toggleMobileMenu}>
                    <FileText className="w-4 h-4" />
                    <span>Password</span>
                  </Link>
                  <Link to="/utilities/invoice" className="mobile-nav-item" onClick={toggleMobileMenu}>
                    <FileText className="w-4 h-4" />
                    <span>Invoice</span>
                  </Link>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <h3 className="font-medium">Converters</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/utilities/jpg-to-pdf" className="mobile-nav-item" onClick={toggleMobileMenu}>
                    <FileImage className="w-4 h-4" />
                    <span>JPG to PDF</span>
                  </Link>
                </div>
                <div className="mt-2 flex justify-center">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="pt-20">
        {/* Content padding to account for fixed header */}
      </div>
    </>
  );
};

export default Header;
