
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
} from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          ? "py-3 glass-panel glass-panel-dark shadow-lg"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <ThemeToggle />
          
          <Link
            to="/"
            className="text-2xl font-medium text-glass animate-fade-in"
          >
            <span className="font-bold">Tool</span>Vault
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <div className="group relative">
            <button className="flex items-center gap-1 py-2 highlight-hover px-3 rounded-md">
              <Calculator className="w-4 h-4" />
              <span>Calculators</span>
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="nav-dropdown">
              <Link to="/calculators/percentage" className="nav-dropdown-item">
                Percentage Calculator
              </Link>
              <Link to="/calculators/emi" className="nav-dropdown-item">
                EMI Calculator
              </Link>
              <Link to="/calculators/area" className="nav-dropdown-item">
                Area Calculator
              </Link>
              <Link to="/calculators/gst" className="nav-dropdown-item">
                GST Calculator
              </Link>
            </div>
          </div>

          <div className="group relative">
            <button className="flex items-center gap-1 py-2 highlight-hover px-3 rounded-md">
              <QrCode className="w-4 h-4" />
              <span>Utilities</span>
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="nav-dropdown">
              <Link to="/utilities/qr-code" className="nav-dropdown-item">
                QR Code Generator
              </Link>
              <Link to="/utilities/password" className="nav-dropdown-item">
                Password Generator
              </Link>
              <Link to="/utilities/invoice" className="nav-dropdown-item">
                Invoice Generator
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md highlight-hover"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-40 md:hidden transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-20 px-6 pb-10 overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Calculators</h3>
            <div className="flex flex-col gap-2 mb-6">
              <Link
                to="/calculators/percentage"
                className="nav-dropdown-item"
                onClick={toggleMobileMenu}
              >
                Percentage Calculator
              </Link>
              <Link
                to="/calculators/emi"
                className="nav-dropdown-item"
                onClick={toggleMobileMenu}
              >
                EMI Calculator
              </Link>
              <Link
                to="/calculators/area"
                className="nav-dropdown-item"
                onClick={toggleMobileMenu}
              >
                Area Calculator
              </Link>
              <Link
                to="/calculators/gst"
                className="nav-dropdown-item"
                onClick={toggleMobileMenu}
              >
                GST Calculator
              </Link>
            </div>

            <h3 className="text-lg font-medium mb-4">Utilities</h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/utilities/qr-code"
                className="nav-dropdown-item"
                onClick={toggleMobileMenu}
              >
                QR Code Generator
              </Link>
              <Link
                to="/utilities/password"
                className="nav-dropdown-item"
                onClick={toggleMobileMenu}
              >
                Password Generator
              </Link>
              <Link
                to="/utilities/invoice"
                className="nav-dropdown-item"
                onClick={toggleMobileMenu}
              >
                Invoice Generator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
