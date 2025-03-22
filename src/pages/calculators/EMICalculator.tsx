
import React, { useState, useEffect } from "react";
import { Calculator, Sliders, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>("100000");
  const [interestRate, setInterestRate] = useState<string>("8.5");
  const [loanTerm, setLoanTerm] = useState<string>("20");
  const [emi, setEmi] = useState<string>("");
  const [totalInterest, setTotalInterest] = useState<string>("");
  const [totalPayment, setTotalPayment] = useState<string>("");
  const [animateResult, setAnimateResult] = useState(false);
  
  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTerm]);
  
  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const time = parseFloat(loanTerm) * 12; // Total months
    
    if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate <= 0 || time <= 0) {
      setEmi("Please enter valid values");
      return;
    }
    
    // EMI formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    const emiValue = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
    const totalPaymentValue = emiValue * time;
    const totalInterestValue = totalPaymentValue - principal;
    
    setEmi(emiValue.toFixed(2));
    setTotalInterest(totalInterestValue.toFixed(2));
    setTotalPayment(totalPaymentValue.toFixed(2));
    
    setAnimateResult(true);
    setTimeout(() => setAnimateResult(false), 500);
  };
  
  const reset = () => {
    setLoanAmount("100000");
    setInterestRate("8.5");
    setLoanTerm("20");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
            <div className="border-b border-border/50 p-6 flex items-center gap-3">
              <Calculator className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-semibold">EMI Calculator for Blog Content</h1>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">EMI Calculator for Your Blog Posts</h2>
                <p className="text-foreground/70 mb-4">
                  Calculate monthly EMI (Equated Monthly Installment) for loans. This tool helps your blog readers understand loan repayments, interest costs, and total payments.
                </p>

                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Sliders className="w-4 h-4" /> Loan Amount
                    </label>
                    <Input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="w-full"
                      placeholder="Enter loan amount"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Sliders className="w-4 h-4" /> Interest Rate (% per annum)
                    </label>
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full"
                      placeholder="Enter interest rate"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Loan Term (years)
                    </label>
                    <Input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className="w-full"
                      placeholder="Enter loan term in years"
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

              {emi && (
                <div
                  className={`mt-8 p-6 rounded-lg glass-panel glass-panel-dark ${
                    animateResult ? "animate-scale-in" : ""
                  }`}
                >
                  <h2 className="text-lg font-medium mb-4">Loan Summary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-accent/10 text-center">
                      <p className="text-sm font-medium mb-1">Monthly EMI</p>
                      <p className="text-2xl font-bold text-glass">{emi}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 text-center">
                      <p className="text-sm font-medium mb-1">Total Interest</p>
                      <p className="text-2xl font-bold text-glass">{totalInterest}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 text-center">
                      <p className="text-sm font-medium mb-1">Total Payment</p>
                      <p className="text-2xl font-bold text-glass">{totalPayment}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-foreground/70 text-center">
                    You can copy these results and use them in your blog posts about loans and finances.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EMICalculator;
