
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
          <Route path="/utilities/qr-code" element={<QRCodeGenerator />} />
          <Route path="/utilities/password" element={<PasswordGenerator />} />
          <Route path="/utilities/invoice" element={<InvoiceGenerator />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
