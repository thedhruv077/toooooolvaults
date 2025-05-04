
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PercentageCalculator from "./pages/calculators/PercentageCalculator";
import EMICalculator from "./pages/calculators/EMICalculator";
import GSTCalculator from "./pages/calculators/GSTCalculator";
import QRCodeGenerator from "./components/QRCodeGenerator";
import PasswordGenerator from "./components/PasswordGenerator";
import AreaCalculator from "./components/AreaCalculator";
import InvoiceGenerator from "./components/InvoiceGenerator";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import SEOTools from "./components/SEOTools";
import SIPCalculator from "./components/SIPCalculator";
import RealEstateCalculator from "./components/RealEstateCalculator";
import RealEstateAreaCalculator from "./components/RealEstateAreaCalculator";
import JPGtoPDFConverter from "./components/JPGtoPDFConverter";
import PDFToJPGConverter from "./components/PDFToJPGConverter";
import AgeCalculator from "./components/AgeCalculator";
import DateDifferenceCalculator from "./components/DateDifferenceCalculator";

// ScrollToTop component to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calculators/percentage" element={<PercentageCalculator />} />
            <Route path="/calculators/emi" element={<EMICalculator />} />
            <Route path="/calculators/gst" element={<GSTCalculator />} />
            <Route path="/calculators/area" element={<AreaCalculator />} />
            <Route path="/calculators/sip" element={<SIPCalculator />} />
            <Route path="/calculators/real-estate" element={<RealEstateCalculator />} />
            <Route path="/calculators/real-estate-area" element={<RealEstateAreaCalculator />} />
            <Route path="/calculators/age" element={<AgeCalculator />} />
            <Route path="/calculators/date-difference" element={<DateDifferenceCalculator />} />
            <Route path="/utilities/qr-code" element={<QRCodeGenerator />} />
            <Route path="/utilities/password" element={<PasswordGenerator />} />
            <Route path="/utilities/invoice" element={<InvoiceGenerator />} />
            <Route path="/utilities/jpg-to-pdf" element={<JPGtoPDFConverter />} />
            <Route path="/utilities/pdf-to-jpg" element={<PDFToJPGConverter />} />
            <Route path="/seo-tools" element={<SEOTools />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<ContactUs />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
