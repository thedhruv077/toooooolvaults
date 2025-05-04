
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { 
  Calculator, 
  QrCode, 
  ArrowRight, 
  Lock, 
  BarChart3, 
  Home, 
  FileUp, 
  Grid, 
  PiggyBank,
  Percent,
  CreditCard,
  Receipt,
  AreaChart,
  FileImage,
  CalendarDays
} from "lucide-react";
import { Helmet } from "react-helmet-async";

interface Tool {
  name: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  category: 'financial' | 'utility' | 'converter';
  badge?: string;
}

const tools: Tool[] = [
  {
    name: "Percentage Calculator",
    description: "Calculate percentages, increases, decreases, and conversions",
    route: "/calculators/percentage",
    icon: <Percent className="w-5 h-5 text-accent" />,
    category: "financial"
  },
  {
    name: "EMI Calculator",
    description: "Calculate loan EMIs, total interest and payment schedules",
    route: "/calculators/emi",
    icon: <CreditCard className="w-5 h-5 text-accent" />,
    category: "financial"
  },
  {
    name: "GST Calculator",
    description: "Calculate GST, inclusive and exclusive amounts",
    route: "/calculators/gst",
    icon: <Receipt className="w-5 h-5 text-accent" />,
    category: "financial"
  },
  {
    name: "Area Calculator",
    description: "Calculate area of different shapes and convert units",
    route: "/calculators/area",
    icon: <AreaChart className="w-5 h-5 text-accent" />,
    category: "financial"
  },
  {
    name: "SIP Calculator",
    description: "Calculate returns on systematic investment plans",
    route: "/calculators/sip",
    icon: <BarChart3 className="w-5 h-5 text-accent" />,
    category: "financial"
  },
  {
    name: "Real Estate Calculator",
    description: "Calculate mortgage EMIs and property investment returns",
    route: "/calculators/real-estate",
    icon: <Home className="w-5 h-5 text-accent" />,
    category: "financial"
  },
  {
    name: "Age Calculator",
    description: "Calculate your exact age from birth date",
    route: "/calculators/age",
    icon: <CalendarDays className="w-5 h-5 text-accent" />,
    category: "financial",
    badge: "New"
  },
  {
    name: "Date Difference Calculator",
    description: "Calculate difference between any two dates",
    route: "/calculators/date-difference",
    icon: <CalendarDays className="w-5 h-5 text-accent" />,
    category: "financial",
    badge: "New"
  },
  {
    name: "QR Code Generator",
    description: "Generate QR codes for URLs, text, or contact information",
    route: "/utilities/qr-code",
    icon: <QrCode className="w-5 h-5 text-accent" />,
    category: "utility"
  },
  {
    name: "Password Generator",
    description: "Create strong, secure passwords with custom options",
    route: "/utilities/password",
    icon: <Lock className="w-5 h-5 text-accent" />,
    category: "utility"
  },
  {
    name: "Invoice Generator",
    description: "Create professional invoices in PDF format",
    route: "/utilities/invoice",
    icon: <FileImage className="w-5 h-5 text-accent" />,
    category: "utility"
  },
  {
    name: "JPG to PDF Converter",
    description: "Convert JPG, JPEG, and PNG images to PDF",
    route: "/utilities/jpg-to-pdf",
    icon: <FileImage className="w-5 h-5 text-accent" />,
    category: "converter"
  }
];

const financialTools = tools.filter(tool => tool.category === 'financial');
const utilityTools = tools.filter(tool => tool.category === 'utility');
const converterTools = tools.filter(tool => tool.category === 'converter');

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Tool Vault - Premium Calculators & Utilities for Everyone</title>
        <meta name="description" content="Free premium tools and calculators for everyone. Financial calculators, QR code generators, password generators and more utilities." />
        <meta name="keywords" content="tool vault, calculators, utilities, financial calculators, QR code generator, password generator, invoice generator, GST calculator, percentage calculator, EMI calculator, SIP calculator, real estate calculator, JPG to PDF converter" />
        <meta property="og:title" content="Tool Vault - Premium Calculators & Utilities" />
        <meta property="og:description" content="Free premium tools and calculators for everyone. Financial calculators, QR code generators, password generators and more utilities." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tool Vault - Premium Calculators & Utilities" />
        <meta name="twitter:description" content="Free premium tools and calculators for everyone. Financial calculators, QR code generators, password generators and more utilities." />
        <link rel="canonical" href="https://toolvault.com/" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-glass">
              All Tools
            </h2>
            <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
              Explore our collection of free premium utilities designed to simplify 
              calculations, generate useful resources, and improve productivity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              
              <div className="glass-panel glass-panel-dark rounded-xl overflow-hidden">
                <div className="bg-accent/10 p-4 border-b border-border flex items-center justify-between">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-accent" />
                    <span>Financial Calculators</span>
                  </h3>
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                    {financialTools.length} tools
                  </span>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {financialTools.map((tool, index) => (
                      <li key={index}>
                        <Link 
                          to={tool.route} 
                          className="flex items-center p-3 rounded-lg hover:bg-accent/10 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mr-3 group-hover:bg-accent/20 transition-colors">
                            {tool.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <h4 className="font-medium truncate">{tool.name}</h4>
                              {tool.badge && (
                                <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground/70 truncate">{tool.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="glass-panel glass-panel-dark rounded-xl overflow-hidden">
                <div className="bg-accent/10 p-4 border-b border-border flex items-center justify-between">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Grid className="w-5 h-5 text-accent" />
                    <span>Utility Tools</span>
                  </h3>
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                    {utilityTools.length} tools
                  </span>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {utilityTools.map((tool, index) => (
                      <li key={index}>
                        <Link 
                          to={tool.route} 
                          className="flex items-center p-3 rounded-lg hover:bg-accent/10 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mr-3 group-hover:bg-accent/20 transition-colors">
                            {tool.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <h4 className="font-medium truncate">{tool.name}</h4>
                              {tool.badge && (
                                <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground/70 truncate">{tool.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="glass-panel glass-panel-dark rounded-xl overflow-hidden">
                <div className="bg-accent/10 p-4 border-b border-border flex items-center justify-between">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <FileUp className="w-5 h-5 text-accent" />
                    <span>Converters</span>
                  </h3>
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                    {converterTools.length} tools
                  </span>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {converterTools.map((tool, index) => (
                      <li key={index}>
                        <Link 
                          to={tool.route} 
                          className="flex items-center p-3 rounded-lg hover:bg-accent/10 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mr-3 group-hover:bg-accent/20 transition-colors">
                            {tool.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <h4 className="font-medium truncate">{tool.name}</h4>
                              {tool.badge && (
                                <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground/70 truncate">{tool.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto max-w-4xl">
              <div className="glass-panel glass-panel-dark rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-3">
                  <PiggyBank className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">About Us</h3>
                <p className="text-foreground/70 mb-4 text-sm">
                  Learn about our mission to provide premium tools and calculators.
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
                  <QrCode className="w-5 h-5 text-accent" />
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
                  <Lock className="w-5 h-5 text-accent" />
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
