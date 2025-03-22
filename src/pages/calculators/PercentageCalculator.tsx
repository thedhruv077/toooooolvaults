
import React, { useState, useEffect } from "react";
import { Calculator, Percent, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const PercentageCalculator = () => {
  const [value1, setValue1] = useState<string>("100.00");
  const [value2, setValue2] = useState<string>("25.00");
  const [result, setResult] = useState<string>("25.00");
  const [resultText, setResultText] = useState<string>("25% of 100 is 25");
  const [calculationType, setCalculationType] = useState<"percentOf" | "percentChange" | "percentageValue">("percentOf");
  const [animateResult, setAnimateResult] = useState(false);
  
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
            <div className="border-b border-border/50 p-6 flex items-center gap-3">
              <Calculator className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-semibold">Percentage Calculator for Blog Content</h1>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">Percentage Calculator for Your Blog Posts</h2>
                <p className="text-foreground/70 mb-4">
                  Quickly calculate percentages for your blog content. Create engaging statistics, 
                  financial examples, or data visualizations with accurate percentage calculations.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                      calculationType === "percentOf"
                        ? "bg-accent/20 border-accent"
                        : "hover:bg-accent/10 border-transparent"
                    } border flex items-center gap-2`}
                    onClick={() => setCalculationType("percentOf")}
                  >
                    <Percent className="w-4 h-4" /> Find % of Value
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                      calculationType === "percentChange"
                        ? "bg-accent/20 border-accent"
                        : "hover:bg-accent/10 border-transparent"
                    } border flex items-center gap-2`}
                    onClick={() => setCalculationType("percentChange")}
                  >
                    <ArrowRight className="w-4 h-4" /> % Change
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                      calculationType === "percentageValue"
                        ? "bg-accent/20 border-accent"
                        : "hover:bg-accent/10 border-transparent"
                    } border flex items-center gap-2`}
                    onClick={() => setCalculationType("percentageValue")}
                  >
                    <Calculator className="w-4 h-4" /> Value as %
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {calculationType === "percentOf" ? "Value" : 
                       calculationType === "percentChange" ? "Original Value" : 
                       "Total Value"}
                    </label>
                    <Input
                      type="text"
                      value={value1}
                      onChange={(e) => setValue1(e.target.value)}
                      className="w-full"
                      placeholder="Enter value"
                      inputMode="decimal"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {calculationType === "percentOf" ? "Percentage (%)" : 
                       calculationType === "percentChange" ? "New Value" : 
                       "Part Value"}
                    </label>
                    <Input
                      type="text"
                      value={value2}
                      onChange={(e) => setValue2(e.target.value)}
                      className="w-full"
                      placeholder="Enter value"
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

              <div
                className={`mt-8 p-6 rounded-lg glass-panel glass-panel-dark ${
                  animateResult ? "animate-scale-in" : ""
                }`}
              >
                <h2 className="text-lg font-medium mb-4">Result</h2>
                <div className="p-4 rounded-lg bg-accent/10 text-center">
                  <p className="text-3xl font-bold text-glass mb-2">
                    {calculationType === "percentChange" || calculationType === "percentageValue" 
                      ? `${result}%` 
                      : result
                    }
                  </p>
                  <p className="text-sm text-foreground/70">
                    {resultText}
                  </p>
                </div>
                <p className="mt-4 text-sm text-foreground/70 text-center">
                  You can copy these results and use them in your blog posts about finance, statistics, or data analysis.
                </p>
              </div>
              
              <div className="mt-8 p-4 rounded-lg bg-background/30">
                <h3 className="font-medium mb-2">Tips for Using Percentages in Blog Content</h3>
                <ul className="space-y-1 text-sm text-foreground/70">
                  <li>• Use percentages to simplify complex data for your readers</li>
                  <li>• Show growth or decline trends with percentage changes</li>
                  <li>• Include visual elements alongside percentage statistics</li>
                  <li>• Always provide context for percentage-based data</li>
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
