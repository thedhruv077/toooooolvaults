
import React, { useState, useEffect } from "react";
import { Calculator, Percent, ArrowRight, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const PercentageCalculator = () => {
  const [value1, setValue1] = useState<string>("100.00");
  const [value2, setValue2] = useState<string>("25.00");
  const [result, setResult] = useState<string>("25.00");
  const [resultText, setResultText] = useState<string>("25% of 100 is 25");
  const [calculationType, setCalculationType] = useState<"percentOf" | "percentChange" | "percentageValue">("percentOf");
  const [animateResult, setAnimateResult] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    calculatePercentage();
  }, [value1, value2, calculationType]);
  
  const calculatePercentage = () => {
    const num1 = parseFloat(value1) || 0;
    const num2 = parseFloat(value2) || 0;
    
    let calculatedResult: number = 0;
    let text: string = "";
    
    switch (calculationType) {
      case "percentOf":
        calculatedResult = (num1 * num2) / 100;
        text = `${num2}% of ${num1} is ${calculatedResult.toFixed(2)}`;
        break;
      case "percentChange":
        calculatedResult = ((num2 - num1) / num1) * 100;
        text = `Percentage change from ${num1} to ${num2} is ${calculatedResult.toFixed(2)}%`;
        break;
      case "percentageValue":
        calculatedResult = (num2 * 100) / num1;
        text = `${num2} is ${calculatedResult.toFixed(2)}% of ${num1}`;
        break;
    }
    
    setResult(calculatedResult.toFixed(2));
    setResultText(text);
    
    setAnimateResult(true);
    setTimeout(() => setAnimateResult(false), 500);
  };
  
  const reset = () => {
    setValue1("100.00");
    setValue2("25.00");
    
    // Update result based on the current calculation type
    setTimeout(calculatePercentage, 0);
  };
  
  const copyResult = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Result copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden shadow-lg">
            <div className="border-b border-border/50 p-6 flex items-center gap-3 bg-accent/5">
              <Calculator className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-semibold">Percentage Calculator</h1>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4 text-glass">Percentage Calculator</h2>
                <p className="text-foreground/70 mb-6">
                  Quickly calculate percentages for your content. Create engaging statistics, 
                  financial examples, or data visualizations with accurate percentage calculations.
                </p>

                <div className="flex flex-wrap gap-2 mb-8 bg-background/50 p-4 rounded-lg">
                  <button
                    className={`px-4 py-2 rounded-md text-sm transition-all duration-300 ${
                      calculationType === "percentOf"
                        ? "bg-accent/20 border-accent shadow-md transform -translate-y-1"
                        : "hover:bg-accent/10 border-transparent hover:transform hover:-translate-y-1"
                    } border flex items-center gap-2`}
                    onClick={() => setCalculationType("percentOf")}
                  >
                    <Percent className="w-4 h-4" /> Find % of Value
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm transition-all duration-300 ${
                      calculationType === "percentChange"
                        ? "bg-accent/20 border-accent shadow-md transform -translate-y-1"
                        : "hover:bg-accent/10 border-transparent hover:transform hover:-translate-y-1"
                    } border flex items-center gap-2`}
                    onClick={() => setCalculationType("percentChange")}
                  >
                    <ArrowRight className="w-4 h-4" /> % Change
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm transition-all duration-300 ${
                      calculationType === "percentageValue"
                        ? "bg-accent/20 border-accent shadow-md transform -translate-y-1"
                        : "hover:bg-accent/10 border-transparent hover:transform hover:-translate-y-1"
                    } border flex items-center gap-2`}
                    onClick={() => setCalculationType("percentageValue")}
                  >
                    <Calculator className="w-4 h-4" /> Value as %
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-background/30 p-5 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium mb-2 text-accent">
                      {calculationType === "percentOf" ? "Value" : 
                       calculationType === "percentChange" ? "Original Value" : 
                       "Total Value"}
                    </label>
                    <Input
                      type="text"
                      value={value1}
                      onChange={(e) => setValue1(e.target.value)}
                      className="w-full bg-background/50 border-accent/20 focus:border-accent"
                      placeholder="Enter value"
                      inputMode="decimal"
                    />
                  </div>
                  
                  <div className="bg-background/30 p-5 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium mb-2 text-accent">
                      {calculationType === "percentOf" ? "Percentage (%)" : 
                       calculationType === "percentChange" ? "New Value" : 
                       "Part Value"}
                    </label>
                    <Input
                      type="text"
                      value={value2}
                      onChange={(e) => setValue2(e.target.value)}
                      className="w-full bg-background/50 border-accent/20 focus:border-accent"
                      placeholder="Enter value"
                      inputMode="decimal"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={reset}
                    className="mr-2 border-accent/30 hover:bg-accent/10"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <div
                className={`mt-8 p-6 rounded-lg glass-panel glass-panel-dark border border-accent/10 ${
                  animateResult ? "animate-scale-in" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-glass">Result</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 hover:bg-accent/10"
                    onClick={copyResult}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
                <div className="p-6 rounded-lg bg-accent/10 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-50"></div>
                  <p className="text-3xl font-bold text-glass mb-2 relative z-10">
                    {calculationType === "percentChange" || calculationType === "percentageValue" 
                      ? `${result}%` 
                      : result
                    }
                  </p>
                  <p className="text-sm text-foreground/70 relative z-10">
                    {resultText}
                  </p>
                </div>
                <p className="mt-4 text-sm text-foreground/70 text-center">
                  You can copy these results and use them in your calculations and reports.
                </p>
              </div>
              
              <div className="mt-8 p-5 rounded-lg bg-background/30 border border-accent/5">
                <h3 className="font-medium mb-3 text-accent">Tips for Using Percentages</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    <span>Use percentages to simplify complex data</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    <span>Show growth or decline trends with percentage changes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    <span>Include visual elements alongside percentage statistics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                    <span>Always provide context for percentage-based data</span>
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
