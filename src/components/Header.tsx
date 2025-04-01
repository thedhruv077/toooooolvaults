
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
// src/components/Header.tsx
//import { GoogleAd } from "./GoogleAd";


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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-2 glass-panel glass-panel-dark shadow-xl border-b border-white/5"
            : "py-3 bg-background/40 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-xl font-bold flex items-center group"
            >
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

          <div className="flex items-center gap-2">
            <div className="md:hidden flex">
              <ThemeToggle />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden flex"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          <div
            className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-40 md:hidden transition-transform duration-300 ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full pt-16 px-4 pb-8 overflow-y-auto">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-accent">
                <Calculator className="w-5 h-5 text-accent" />
                Tools
              </h3>
              <div className="flex flex-col gap-2 mb-6">
                <Link
                  to="/calculators/percentage"
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm font-medium">Percentage Calculator</div>
                </Link>
                <Link
                  to="/calculators/emi"
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm font-medium">EMI Calculator</div>
                </Link>
                <Link
                  to="/calculators/area"
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm font-medium">Area Calculator</div>
                </Link>
                <Link
                  to="/calculators/gst"
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm font-medium">GST Calculator</div>
                </Link>
                <Link
                  to="/calculators/sip"
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm font-medium">SIP Calculator</div>
                </Link>
                <Link
                  to="/calculators/real-estate"
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm font-medium">Real Estate Calculator</div>
                </Link>
              </div>

              <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-accent">
                <QrCode className="w-5 h-5 text-accent" />
                Utilities
              </h3>
              <div className="flex flex-col gap-2 mb-6">
                <Link
                  to="/utilities/qr-code"
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm font-medium">QR Code Generator</div>
                </Link>
                <Link
                  to="/utilities/password"
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm font-medium">Password Generator</div>
                </Link>
                <Link
                  to="/utilities/invoice"
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm font-medium">Invoice Generator</div>
                </Link>
              </div>

              <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-accent">
                <FileUp className="w-5 h-5 text-accent" />
                Converters
              </h3>
              <div className="flex flex-col gap-2 mb-6">
                <Link
                  to="/utilities/jpg-to-pdf"
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  onClick={toggleMobileMenu}
                >
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileImage className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm font-medium">JPG to PDF Converter</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="w-full pt-16 pb-1 px-4">
        <div className="container mx-auto">
          <GoogleAd slot="below-header-ad-slot" format="horizontal" className="mx-auto" />
        </div>
      </div>
    </>
  );
};

export default Header;
