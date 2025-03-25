
import React, { useState, useEffect } from "react";
import { Calculator, DollarSign, ArrowDown, ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const GSTCalculator = () => {
  const [calculationType, setCalculationType] = useState<"exclusive" | "inclusive">("exclusive");
  const [amount, setAmount] = useState<string>("1000.00");
  const [gstRate, setGstRate] = useState<string>("18.00");
  const [gstAmount, setGstAmount] = useState<string>("180.00");
  const [totalAmount, setTotalAmount] = useState<string>("1180.00");
  const [animateResult, setAnimateResult] = useState(false);
  
  useEffect(() => {
    calculateGST();
  }, [amount, gstRate, calculationType]);
  
  const calculateGST = () => {
    const baseAmount = parseFloat(amount) || 0;
    const rate = parseFloat(gstRate) || 0;
    
    if (baseAmount < 0 || rate < 0) {
      setGstAmount("0.00");
      setTotalAmount("0.00");
      return;
    }
    
    let gst, total;
    
    if (calculationType === "exclusive") {
      // GST is added to the base amount
      gst = baseAmount * (rate / 100);
      total = baseAmount + gst;
    } else {
      // GST is included in the total amount
      gst = baseAmount * (rate / (100 + rate));
      total = baseAmount;
      // baseAmount here is actually the total, so we calculate the base price
      const basePrice = baseAmount - gst;
      // For inclusive calculation, we don't update the amount input
    }
    
    setGstAmount(gst.toFixed(2));
    setTotalAmount(total.toFixed(2));
    
    setAnimateResult(true);
    setTimeout(() => setAnimateResult(false), 500);
  };
  
  const reset = () => {
    setAmount("1000.00");
    setGstRate("18.00");
    setCalculationType("exclusive");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
            <div className="border-b border-border/50 p-6 flex items-center gap-3">
              <Calculator className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-semibold">GST Calculator</h1>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">GST Calculator</h2>
                <p className="text-foreground/70 mb-4">
                  Calculate GST (Goods and Services Tax) for product prices quickly. This tool helps you understand tax calculations for your purchases.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                      calculationType === "exclusive"
                        ? "bg-accent/20 border-accent"
                        : "hover:bg-accent/10 border-transparent"
                    } border flex items-center gap-2`}
                    onClick={() => setCalculationType("exclusive")}
                  >
                    <ArrowUp className="w-4 h-4" /> Add GST to Price
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                      calculationType === "inclusive"
                        ? "bg-accent/20 border-accent"
                        : "hover:bg-accent/10 border-transparent"
                    } border flex items-center gap-2`}
                    onClick={() => setCalculationType("inclusive")}
                  >
                    <ArrowDown className="w-4 h-4" /> Extract GST from Price
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> 
                      {calculationType === "exclusive" ? "Amount (Excluding GST)" : "Amount (Including GST)"}
                    </label>
                    <Input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full"
                      placeholder="Enter amount"
                      inputMode="decimal"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> GST Rate (%)
                    </label>
                    <Input
                      type="text"
                      value={gstRate}
                      onChange={(e) => setGstRate(e.target.value)}
                      className="w-full"
                      placeholder="Enter GST rate"
                      inputMode="decimal"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={reset}
                    className="mr-2"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {gstAmount && (
                <div
                  className={`mt-8 p-6 rounded-lg glass-panel glass-panel-dark ${
                    animateResult ? "animate-scale-in" : ""
                  }`}
                >
                  <h2 className="text-lg font-medium mb-4">GST Calculation Results</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-accent/10 text-center">
                      <p className="text-sm font-medium mb-1">Base Amount</p>
                      <p className="text-2xl font-bold text-glass">
                        {calculationType === "exclusive" ? amount : (parseFloat(totalAmount) - parseFloat(gstAmount)).toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 text-center">
                      <p className="text-sm font-medium mb-1">GST Amount</p>
                      <p className="text-2xl font-bold text-glass">{gstAmount}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 text-center">
                      <p className="text-sm font-medium mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-glass">{totalAmount}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-foreground/70 text-center">
                    You can copy these results and use them for your tax calculations.
                  </p>
                </div>
              )}
              
              <div className="mt-8 p-4 rounded-lg bg-background/30">
                <h3 className="font-medium mb-2">Tips for Using GST Calculations</h3>
                <ul className="space-y-1 text-sm text-foreground/70">
                  <li>• Include GST calculations when preparing invoices</li>
                  <li>• Explain tax implications for different price points</li>
                  <li>• Compare pre-tax and post-tax values for better context</li>
                  <li>• Note that GST rates may vary by country and product category</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GSTCalculator;
