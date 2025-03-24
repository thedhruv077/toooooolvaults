
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
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 glass-panel glass-panel-dark shadow-xl border-b border-white/5"
          : "py-5 bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-2xl font-bold flex items-center group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-accent to-accent/40 rounded-lg flex items-center justify-center mr-2 shadow-lg group-hover:shadow-accent/20 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
            </div>
            <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent font-extrabold tracking-tight">Tool</span>
            <span className="text-foreground font-medium">Vault</span>
          </Link>
          
          <div className="hidden md:flex ml-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Desktop Navigation - Using Radix UI NavigationMenu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-1 py-2">
                <Calculator className="w-4 h-4 text-accent" />
                <span>Calculators</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="glass-panel glass-panel-dark shadow-xl border border-white/10 animate-fade-in">
                <div className="grid gap-2 p-3 w-[400px]">
                  <NavigationMenuLink asChild>
                    <Link to="/calculators/percentage" className="nav-dropdown-item group">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                        <Calculator className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Percentage Calculator</span>
                        <span className="text-xs text-muted-foreground">Calculate percentages quickly</span>
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
                        <span className="text-xs text-muted-foreground">Calculate loan EMIs</span>
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
                        <span className="text-xs text-muted-foreground">Calculate areas of shapes</span>
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
                        <span className="text-xs text-muted-foreground">Calculate GST amounts</span>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-1 py-2">
                <QrCode className="w-4 h-4 text-accent" />
                <span>Utilities</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="glass-panel glass-panel-dark shadow-xl border border-white/10 animate-fade-in">
                <div className="grid gap-2 p-3 w-[400px]">
                  <NavigationMenuLink asChild>
                    <Link to="/utilities/qr-code" className="nav-dropdown-item group">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                        <QrCode className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">QR Code Generator</span>
                        <span className="text-xs text-muted-foreground">Create custom QR codes</span>
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
                        <span className="text-xs text-muted-foreground">Generate secure passwords</span>
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
                        <span className="text-xs text-muted-foreground">Create professional invoices</span>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex">
            <Button asChild variant="ghost" className="text-sm hover:bg-accent/10 hover:text-accent">
              <Link to="/about">About</Link>
            </Button>
            <Button asChild variant="ghost" className="text-sm hover:bg-accent/10 hover:text-accent">
              <Link to="/contact">Contact</Link>
            </Button>
            <Button asChild variant="outline" className="text-sm bg-accent/5 border-accent/30 hover:bg-accent/10 hover:text-accent transition-all">
              <Link to="/privacy">Privacy</Link>
            </Button>
          </div>
          
          {/* Mobile Theme Toggle */}
          <div className="md:hidden flex">
            <ThemeToggle />
          </div>
          
          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-40 md:hidden transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-20 px-6 pb-10 overflow-y-auto">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-accent">
              <Calculator className="w-5 h-5 text-accent" />
              Calculators
            </h3>
            <div className="flex flex-col gap-4 mb-8">
              <Link
                to="/calculators/percentage"
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                onClick={toggleMobileMenu}
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-medium">Percentage Calculator</div>
                  <div className="text-xs text-muted-foreground">Calculate percentages quickly</div>
                </div>
              </Link>
              <Link
                to="/calculators/emi"
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                onClick={toggleMobileMenu}
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-medium">EMI Calculator</div>
                  <div className="text-xs text-muted-foreground">Calculate loan EMIs</div>
                </div>
              </Link>
              <Link
                to="/calculators/area"
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                onClick={toggleMobileMenu}
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-medium">Area Calculator</div>
                  <div className="text-xs text-muted-foreground">Calculate areas of shapes</div>
                </div>
              </Link>
              <Link
                to="/calculators/gst"
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                onClick={toggleMobileMenu}
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-medium">GST Calculator</div>
                  <div className="text-xs text-muted-foreground">Calculate GST amounts</div>
                </div>
              </Link>
            </div>

            <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-accent">
              <QrCode className="w-5 h-5 text-accent" />
              Utilities
            </h3>
            <div className="flex flex-col gap-4 mb-8">
              <Link
                to="/utilities/qr-code"
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                onClick={toggleMobileMenu}
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-medium">QR Code Generator</div>
                  <div className="text-xs text-muted-foreground">Create custom QR codes</div>
                </div>
              </Link>
              <Link
                to="/utilities/password"
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                onClick={toggleMobileMenu}
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-medium">Password Generator</div>
                  <div className="text-xs text-muted-foreground">Generate secure passwords</div>
                </div>
              </Link>
              <Link
                to="/utilities/invoice"
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                onClick={toggleMobileMenu}
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-medium">Invoice Generator</div>
                  <div className="text-xs text-muted-foreground">Create professional invoices</div>
                </div>
              </Link>
            </div>
            
            {/* Additional pages for mobile */}
            <div className="mt-auto pt-8 border-t border-border/30">
              <div className="grid grid-cols-3 gap-3">
                <Button asChild variant="outline" className="bg-accent/5 border-accent/20 hover:bg-accent/10 w-full justify-start">
                  <Link to="/about" onClick={toggleMobileMenu}>About</Link>
                </Button>
                <Button asChild variant="outline" className="bg-accent/5 border-accent/20 hover:bg-accent/10 w-full justify-start">
                  <Link to="/contact" onClick={toggleMobileMenu}>Contact</Link>
                </Button>
                <Button asChild variant="outline" className="bg-accent/5 border-accent/20 hover:bg-accent/10 w-full justify-start">
                  <Link to="/privacy" onClick={toggleMobileMenu}>Privacy</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
