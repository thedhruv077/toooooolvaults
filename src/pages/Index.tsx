
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { Calculator, QrCode, Search, ArrowRight } from "lucide-react";

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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Calculators */}
              <div className="glass-panel glass-panel-dark rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Calculators</h3>
                <p className="text-foreground/70 mb-4">
                  Quickly solve complex calculations with our suite of specialized calculators.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>Percentage Calculator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>EMI Calculator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>GST Calculator</span>
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
                  Enhance your productivity with our collection of useful utilities.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>QR Code Generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>Password Generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>Text Tools</span>
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
              
              {/* SEO Tools */}
              <div className="glass-panel glass-panel-dark rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">SEO Tools</h3>
                <p className="text-foreground/70 mb-4">
                  Optimize your content and improve your search engine rankings.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>Meta Tag Generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>Keyword Research</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span>SEO Analysis</span>
                  </li>
                </ul>
                <Link
                  to="/seo/meta-tags"
                  className="flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  <span>Boost Your SEO</span>
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
