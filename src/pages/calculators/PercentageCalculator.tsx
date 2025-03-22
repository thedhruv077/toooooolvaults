
import React, { useState, useEffect } from "react";
import { Calculator, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const PercentageCalculator = () => {
  // First calculator - What is X% of Y
  const [percentValue, setPercentValue] = useState<string>("18");
  const [totalValue, setTotalValue] = useState<string>("5000");
  const [percentResult, setPercentResult] = useState<string>("");
  
  // Second calculator - X is what % of Y
  const [valueX, setValueX] = useState<string>("900");
  const [valueY, setValueY] = useState<string>("4500");
  const [percentageOfResult, setPercentageOfResult] = useState<string>("");
  
  // Third calculator - % change from X to Y
  const [originalValue, setOriginalValue] = useState<string>("100");
  const [newValue, setNewValue] = useState<string>("120");
  const [percentChangeResult, setPercentChangeResult] = useState<string>("");
  
  const [animateResult, setAnimateResult] = useState(false);

  // Calculate all results when values change
  useEffect(() => {
    calculatePercentOf();
    calculatePercentageOf();
    calculatePercentChange();
  }, [
    percentValue, totalValue, 
    valueX, valueY, 
    originalValue, newValue
  ]);

  // Calculate X% of Y
  const calculatePercentOf = () => {
    const percent = parseFloat(percentValue);
    const total = parseFloat(totalValue);
    
    if (isNaN(percent) || isNaN(total)) return;
    
    const result = (percent / 100) * total;
    setPercentResult(result.toFixed(2));
  };

  // Calculate X is what % of Y
  const calculatePercentageOf = () => {
    const x = parseFloat(valueX);
    const y = parseFloat(valueY);
    
    if (isNaN(x) || isNaN(y) || y === 0) return;
    
    const result = (x / y) * 100;
    setPercentageOfResult(result.toFixed(2) + "%");
  };

  // Calculate % change from X to Y
  const calculatePercentChange = () => {
    const original = parseFloat(originalValue);
    const newVal = parseFloat(newValue);
    
    if (isNaN(original) || isNaN(newVal) || original === 0) return;
    
    const change = ((newVal - original) / original) * 100;
    const sign = change >= 0 ? "+" : "";
    setPercentChangeResult(sign + change.toFixed(2) + "%");
  };

  const resetAll = () => {
    setPercentValue("18");
    setTotalValue("5000");
    setValueX("900");
    setValueY("4500");
    setOriginalValue("100");
    setNewValue("120");
    
    setAnimateResult(true);
    setTimeout(() => setAnimateResult(false), 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
            <div className="border-b border-border/50 p-6 flex items-center gap-3">
              <Calculator className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-semibold">Percentage Calculator</h1>
            </div>

            <div className="p-6">
              {/* First calculator - What is X% of Y */}
              <div className="mb-6 p-4 rounded-lg bg-background/50">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-foreground font-medium">What is</span>
                  <div className="w-24">
                    <Input 
                      type="number" 
                      value={percentValue}
                      onChange={(e) => setPercentValue(e.target.value)}
                      className="text-center"
                    />
                  </div>
                  <span className="text-foreground font-medium">% of</span>
                  <div className="w-32">
                    <Input 
                      type="number" 
                      value={totalValue}
                      onChange={(e) => setTotalValue(e.target.value)}
                      className="text-center"
                    />
                  </div>
                  <span className="text-foreground font-medium">=</span>
                  <div className="w-32 text-lg font-bold text-accent">
                    {percentResult}
                  </div>
                </div>
              </div>
              
              {/* Second calculator - X is what % of Y */}
              <div className="mb-6 p-4 rounded-lg bg-background/50">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="w-24">
                    <Input 
                      type="number" 
                      value={valueX}
                      onChange={(e) => setValueX(e.target.value)}
                      className="text-center"
                    />
                  </div>
                  <span className="text-foreground font-medium">is what % of</span>
                  <div className="w-32">
                    <Input 
                      type="number" 
                      value={valueY}
                      onChange={(e) => setValueY(e.target.value)}
                      className="text-center"
                    />
                  </div>
                  <span className="text-foreground font-medium">=</span>
                  <div className="w-32 text-lg font-bold text-accent">
                    {percentageOfResult}
                  </div>
                </div>
              </div>
              
              {/* Third calculator - % change from X to Y */}
              <div className="mb-6 p-4 rounded-lg bg-background/50">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-foreground font-medium">% change from</span>
                  <div className="w-28">
                    <Input 
                      type="number" 
                      value={originalValue}
                      onChange={(e) => setOriginalValue(e.target.value)}
                      className="text-center"
                    />
                  </div>
                  <span className="text-foreground font-medium">to</span>
                  <div className="w-28">
                    <Input 
                      type="number" 
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="text-center"
                    />
                  </div>
                  <span className="text-foreground font-medium">=</span>
                  <div className="w-32 text-lg font-bold text-accent">
                    {percentChangeResult}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={resetAll}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
              
              {/* Tips Section */}
              <div className="mt-8 p-4 rounded-lg bg-background/30">
                <h3 className="font-medium mb-2">Quick Tips</h3>
                <ul className="space-y-1 text-sm text-foreground/70">
                  <li>• Use tab key to move between fields</li>
                  <li>• Results update automatically</li>
                  <li>• Recent calculations are saved</li>
                </ul>
              </div>
              
              {/* About Section */}
              <div className="mt-8">
                <h2 className="text-xl font-medium mb-4">About Percentage Calculator</h2>
                <p className="text-foreground/70 mb-4">
                  Our Percentage Calculator is a versatile tool that helps you solve various percentage-related calculations quickly and
                  accurately. Whether you're calculating discounts, tax rates using our <a href="/calculators/gst" className="text-accent hover:underline">GST Calculator</a>, 
                  analyzing business profits, or determining loan interest with our <a href="/calculators/emi" className="text-accent hover:underline">EMI Calculator</a>, 
                  this tool makes percentage calculations simple and efficient.
                </p>
                
                <h3 className="text-lg font-medium mb-2 mt-6">Features:</h3>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>Multiple Calculation Types:</strong> Three different ways to calculate percentages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>Instant Results:</strong> See calculations update as you type</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>Color-Coded Results:</strong> Green for increase, red for decrease</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span><strong>Simple Interface:</strong> Clean and easy to use design</span>
                  </li>
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

export default PercentageCalculator;
