import React, { useState, useEffect } from "react";
import { Calculator, Sliders, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet-async";
import GoogleAd from "../../components/GoogleAd";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>("200000.00");
  const [interestRate, setInterestRate] = useState<string>("8.50");
  const [loanTerm, setLoanTerm] = useState<string>("20");
  const [emi, setEmi] = useState<string>("1712.88");
  const [totalInterest, setTotalInterest] = useState<string>("211091.20");
  const [totalPayment, setTotalPayment] = useState<string>("411091.20");
  const [animateResult, setAnimateResult] = useState(false);
  
  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTerm]);
  
  const calculateEMI = () => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const time = parseFloat(loanTerm) * 12; // Total months
    
    if (principal <= 0 || rate <= 0 || time <= 0) {
      setEmi("0.00");
      setTotalInterest("0.00");
      setTotalPayment("0.00");
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
    setLoanAmount("200000.00");
    setInterestRate("8.50");
    setLoanTerm("20");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>EMI Calculator - Calculate Monthly Loan Repayments | Tool Vault</title>
        <meta name="description" content="Free EMI calculator to calculate monthly loan payments, total interest cost, and total repayment amount for home loans, car loans, and personal loans." />
        <meta name="keywords" content="EMI calculator, loan calculator, monthly payment calculator, mortgage calculator, loan repayment calculator" />
      </Helmet>
      
      <Header />
      
      <div className="flex-grow pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <GoogleAd slot="emi-top-ad-slot" format="horizontal" className="mb-4" />
          
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
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full"
                    placeholder="Enter loan amount"
                    inputMode="decimal"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Sliders className="w-4 h-4" /> Interest Rate (% per annum)
                  </label>
                  <Input
                    type="text"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full"
                    placeholder="Enter interest rate"
                    inputMode="decimal"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Loan Term (years)
                  </label>
                  <Input
                    type="text"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="w-full"
                    placeholder="Enter loan term in years"
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

              <GoogleAd slot="emi-mid-ad-slot" format="rectangle" className="my-4" />

              {emi && (
                <div
                  className={`mt-4 p-4 rounded-lg glass-panel glass-panel-dark ${
                    animateResult ? "animate-scale-in" : ""
                  }`}
                >
                  <h2 className="text-lg font-medium mb-4">Loan Summary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-accent/10 text-center">
                      <p className="text-sm font-medium mb-1">Monthly EMI</p>
                      <p className="text-2xl font-bold text-glass">{emi}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/10 text-center">
                      <p className="text-sm font-medium mb-1">Total Interest</p>
                      <p className="text-2xl font-bold text-glass">{totalInterest}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/10 text-center">
                      <p className="text-sm font-medium mb-1">Total Payment</p>
                      <p className="text-2xl font-bold text-glass">{totalPayment}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <GoogleAd slot="emi-bottom-ad-slot" format="horizontal" className="mt-4" />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EMICalculator;
