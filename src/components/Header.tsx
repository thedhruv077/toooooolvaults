
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ui/theme-toggle";
import { Menu, X } from "lucide-react";
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
