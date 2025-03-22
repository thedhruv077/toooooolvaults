
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { Calculator, QrCode, ArrowRight, Lock, SquareCode, Users, Mail, FileText } from "lucide-react";

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
              Premium Tools for Every Blog
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-4xl">
              {/* Calculators */}
              <div className="glass-panel glass-panel-dark rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Financial Calculators</h3>
                <p className="text-foreground/70 mb-4">
                  Powerful financial calculators for your blog content. Create engaging financial examples and accurate calculations.
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
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <Link to="/calculators/area" className="hover:text-accent transition-colors">
                      Area Calculator
                    </Link>
                  </li>
                </ul>
                <Link
                  to="/calculators/percentage"
                  className="flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  <span>Try Financial Calculators</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {/* Utilities */}
              <div className="glass-panel glass-panel-dark rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <QrCode className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Blogging Utilities</h3>
                <p className="text-foreground/70 mb-4">
                  Essential utilities to enhance your blog content and reader experience. Generate useful elements for your posts.
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
                    <Link to="/utilities/password" className="hover:text-accent transition-colors">
                      Password Generator
                    </Link>
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
            
            {/* About and Contact Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto max-w-4xl">
              <div className="glass-panel glass-panel-dark rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">About Us</h3>
                <p className="text-foreground/70 mb-4 text-sm">
                  Learn about our mission to provide premium blog tools and calculators.
                </p>
                <Link
                  to="/about"
                  className="flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  <span>About Us</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="glass-panel glass-panel-dark rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Contact</h3>
                <p className="text-foreground/70 mb-4 text-sm">
                  Questions or suggestions? We'd love to hear from you.
                </p>
                <Link
                  to="/contact"
                  className="flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="glass-panel glass-panel-dark rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Privacy</h3>
                <p className="text-foreground/70 mb-4 text-sm">
                  Learn how we protect your data and privacy while using our tools.
                </p>
                <Link
                  to="/privacy"
                  className="flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  <span>Privacy Policy</span>
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
