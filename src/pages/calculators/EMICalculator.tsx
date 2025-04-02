import React, { useState, useCallback, useMemo } from "react";
import { Calculator, Sliders, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>("200000.00");
  const [interestRate, setInterestRate] = useState<string>("8.50");
  const [loanTerm, setLoanTerm] = useState<string>("20");
  const [animateResult, setAnimateResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const isMobile = useIsMobile();
  
  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const time = parseFloat(loanTerm) * 12; // Total months
    
    if (principal <= 0 || rate <= 0 || time <= 0) {
      return { 
        emi: "0.00", 
        totalInterest: "0.00", 
        totalPayment: "0.00"
      };
    }
    
    const emiValue = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
    const totalPaymentValue = emiValue * time;
    const totalInterestValue = totalPaymentValue - principal;
    
    return {
      emi: emiValue.toFixed(2),
      totalInterest: totalInterestValue.toFixed(2),
      totalPayment: totalPaymentValue.toFixed(2)
    };
  }, [loanAmount, interestRate, loanTerm]);
  
  const calculateEMI = useCallback(() => {
    setIsCalculating(true);
    setAnimateResult(true);
    
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsCalculating(false);
        setTimeout(() => setAnimateResult(false), 300);
      }, 100);
    });
  }, []);
  
  const reset = useCallback(() => {
    setLoanAmount("200000.00");
    setInterestRate("8.50");
    setLoanTerm("20");
  }, []);
  
  const handleInputChange = useCallback((setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>EMI Calculator - Calculate Monthly Loan Repayments | Tool Vault</title>
        <meta name="description" content="Free EMI calculator to calculate monthly loan payments, total interest cost, and total repayment amount for home loans, car loans, and personal loans." />
        <meta name="keywords" content="EMI calculator, loan calculator, monthly payment calculator, mortgage calculator, loan repayment calculator" />
      </Helmet>
      
      <Header />
      
      <div className="flex-grow pt-8 pb-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
            <div className="border-b border-border/50 p-4 flex items-center gap-3">
              <Calculator className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-semibold">EMI Calculator</h1>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Sliders className="w-4 h-4" /> Loan Amount
                  </label>
                  <Input
                    type="text"
                    value={loanAmount}
                    onChange={handleInputChange(setLoanAmount)}
                    className="w-full"
                    placeholder="Enter loan amount"
                    inputMode="decimal"
                    onBlur={calculateEMI}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Sliders className="w-4 h-4" /> Interest Rate (% per annum)
                  </label>
                  <Input
                    type="text"
                    value={interestRate}
                    onChange={handleInputChange(setInterestRate)}
                    className="w-full"
                    placeholder="Enter interest rate"
                    inputMode="decimal"
                    onBlur={calculateEMI}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Loan Term (years)
                  </label>
                  <Input
                    type="text"
                    value={loanTerm}
                    onChange={handleInputChange(setLoanTerm)}
                    className="w-full"
                    placeholder="Enter loan term in years"
                    inputMode="decimal"
                    onBlur={calculateEMI}
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
                <Button 
                  onClick={calculateEMI}
                >
                  Calculate
                </Button>
              </div>

              <div className="mt-4 p-4 rounded-lg glass-panel glass-panel-dark">
                <h2 className="text-lg font-medium mb-4">Loan Summary</h2>
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
                  <div className={`p-3 rounded-lg bg-accent/10 text-center ${animateResult ? "animate-scale-in" : ""}`}>
                    <p className="text-sm font-medium mb-1">Monthly EMI</p>
                    {isCalculating ? (
                      <Skeleton className="h-7 w-full mx-auto" />
                    ) : (
                      <p className="text-xl font-bold text-glass break-words">{emi}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg bg-accent/10 text-center ${animateResult ? "animate-scale-in" : ""}`}>
                    <p className="text-sm font-medium mb-1">Total Interest</p>
                    {isCalculating ? (
                      <Skeleton className="h-7 w-full mx-auto" />
                    ) : (
                      <p className="text-xl font-bold text-glass break-words">{totalInterest}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg bg-accent/10 text-center ${animateResult ? "animate-scale-in" : ""}`}>
                    <p className="text-sm font-medium mb-1">Total Payment</p>
                    {isCalculating ? (
                      <Skeleton className="h-7 w-full mx-auto" />
                    ) : (
                      <p className="text-xl font-bold text-glass break-words">{totalPayment}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EMICalculator;
