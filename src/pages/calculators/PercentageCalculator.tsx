
import React, { useState, useEffect } from "react";
import { Calculator } from "lucide-react";

const PercentageCalculator = () => {
  const [calculationType, setCalculationType] = useState<
    "percentage" | "value" | "total"
  >("percentage");
  const [value1, setValue1] = useState<string>("");
  const [value2, setValue2] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [animateResult, setAnimateResult] = useState(false);

  const calculateResult = () => {
    let calculatedResult = "";
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);

    if (isNaN(num1) || isNaN(num2)) {
      setResult("Please enter valid numbers");
      return;
    }

    if (calculationType === "percentage") {
      // Calculate what percentage of num2 is num1
      calculatedResult = ((num1 / num2) * 100).toFixed(2) + "%";
    } else if (calculationType === "value") {
      // Calculate value given percentage and total
      calculatedResult = ((num1 / 100) * num2).toFixed(2);
    } else if (calculationType === "total") {
      // Calculate total given value and percentage
      calculatedResult = ((num1 * 100) / num2).toFixed(2);
    }

    setResult(calculatedResult);
    setAnimateResult(true);
  };

  useEffect(() => {
    if (animateResult) {
      const timer = setTimeout(() => {
        setAnimateResult(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animateResult]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
          <div className="border-b border-border/50 p-6 flex items-center gap-3">
            <Calculator className="w-5 h-5 text-accent" />
            <h1 className="text-xl font-semibold">Percentage Calculator</h1>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Calculation Type
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                    calculationType === "percentage"
                      ? "bg-accent/20 border-accent"
                      : "hover:bg-accent/10 border-transparent"
                  } border`}
                  onClick={() => setCalculationType("percentage")}
                >
                  Find Percentage
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                    calculationType === "value"
                      ? "bg-accent/20 border-accent"
                      : "hover:bg-accent/10 border-transparent"
                  } border`}
                  onClick={() => setCalculationType("value")}
                >
                  Find Value
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                    calculationType === "total"
                      ? "bg-accent/20 border-accent"
                      : "hover:bg-accent/10 border-transparent"
                  } border`}
                  onClick={() => setCalculationType("total")}
                >
                  Find Total
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {calculationType === "percentage"
                    ? "Value"
                    : calculationType === "value"
                    ? "Percentage (%)"
                    : "Value"}
                </label>
                <input
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  placeholder="Enter a number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {calculationType === "percentage"
                    ? "Total"
                    : calculationType === "value"
                    ? "Total"
                    : "Percentage (%)"}
                </label>
                <input
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  placeholder="Enter a number"
                />
              </div>
            </div>

            <button
              onClick={calculateResult}
              className="mt-6 w-full py-3 rounded-lg bg-accent text-white font-medium transition-all duration-300 hover:bg-accent/90 hover:shadow-lg active:scale-95"
            >
              Calculate
            </button>

            {result && (
              <div
                className={`mt-8 p-6 rounded-lg glass-panel glass-panel-dark text-center ${
                  animateResult ? "animate-scale-in" : ""
                }`}
              >
                <h2 className="text-lg font-medium mb-2">Result</h2>
                <p className="text-3xl font-bold text-glass">{result}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PercentageCalculator;
