
import React from "react";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 mt-16 glass-panel glass-panel-dark border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/70">
            Made by Tool Vault with ❤️
          </p>
          <a
            href="https://instagram.com/toolvaults23"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-foreground/70 hover:text-accent transition-colors duration-200"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow on Instagram</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
