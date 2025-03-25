
import React from "react";
import { Instagram, Heart, Info, Mail, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-8 mt-16 glass-panel glass-panel-dark border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-glass">Tool Vault</h3>
            <p className="text-sm text-foreground/70 mb-4">
              A collection of useful tools and calculators for bloggers and content creators.
              Enhance your content with our high-quality utilities.
            </p>
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <span>Made by Tool Vault with </span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span> by Dhruv</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-glass">Quick Links</h3>
            <div className="grid grid-cols-1 gap-2">
              <Link to="/about" className="text-sm text-foreground/70 hover:text-accent transition-colors flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>About Us</span>
              </Link>
              <Link to="/contact" className="text-sm text-foreground/70 hover:text-accent transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Contact Us</span>
              </Link>
              <Link to="/privacy" className="text-sm text-foreground/70 hover:text-accent transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Privacy Policy</span>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-glass">Connect With Us</h3>
            <a
              href="https://instagram.com/toolvaults23"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-foreground/70 hover:text-accent transition-colors mb-3"
            >
              <Instagram className="w-5 h-5" />
              <span>Follow on Instagram</span>
            </a>
            <p className="text-sm text-foreground/70">
              Stay updated with our latest tools and features.
            </p>
          </div>
        </div>
        
        <div className="border-t border-border/20 pt-6 text-center">
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} Tool Vault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
