
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { Calculator, QrCode, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Feature Sections */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-glass">
              Premium Tools for Every Need
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-4xl">
              {/* Calculators */}
              <div className="glass-panel glass-panel-dark rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Calculators</h3>
                <p className="text-foreground/70 mb-4">
                  Quickly solve complex calculations with our suite of specialized calculators for your blog content.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <Link to="/calculators/percentage" className="hover:text-accent transition-colors">
                      Percentage Calculator
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <Link to="/calculators/emi" className="hover:text-accent transition-colors">
                      EMI Calculator
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <Link to="/calculators/gst" className="hover:text-accent transition-colors">
                      GST Calculator
                    </Link>
                  </li>
                </ul>
                <Link
                  to="/calculators/percentage"
                  className="flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  <span>Try Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {/* Utilities */}
              <div className="glass-panel glass-panel-dark rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <QrCode className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Utilities</h3>
                <p className="text-foreground/70 mb-4">
                  Enhance your blog content with our collection of useful utilities.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <Link to="/utilities/qr-code" className="hover:text-accent transition-colors">
                      QR Code Generator
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>Password Generator (Coming Soon)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>Text Tools (Coming Soon)</span>
                  </li>
                </ul>
                <Link
                  to="/utilities/qr-code"
                  className="flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  <span>Explore Utilities</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
