
import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, BarChart3, PiggyBank, Calculator } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

const RealEstateCalculator = () => {
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [isCalculatingEMI, setIsCalculatingEMI] = useState<boolean>(false);
  const [emiResult, setEmiResult] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);

  // ROI Calculator State
  const [propertyValue, setPropertyValue] = useState<number>(8000000);
  const [annualRental, setAnnualRental] = useState<number>(240000);
  const [annualExpenses, setAnnualExpenses] = useState<number>(50000);
  const [propertyAppreciation, setPropertyAppreciation] = useState<number>(5);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(10);
  const [isCalculatingROI, setIsCalculatingROI] = useState<boolean>(false);
  const [roiResult, setRoiResult] = useState<{
    rentalYield: number;
    totalRoi: number;
    appreciationValue: number;
    futureValue: number;
  } | null>(null);
  
  const isMobile = useIsMobile();

  // Calculate EMI with useCallback for better performance
  const calculateEMI = useCallback(() => {
    setIsCalculatingEMI(true);
    
    // Use setTimeout to prevent UI freeze
    setTimeout(() => {
      const principal = loanAmount;
      const monthlyRate = interestRate / 1200;
      const months = loanTerm * 12;
  
      // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
      const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      const totalAmount = emi * months;
      const totalInterestPayment = totalAmount - principal;
  
      setEmiResult(emi);
      setTotalInterest(totalInterestPayment);
      setTotalPayment(totalAmount);
      setIsCalculatingEMI(false);
    }, 100);
  }, [loanAmount, interestRate, loanTerm]);

  // Calculate ROI with useCallback for better performance
  const calculateROI = useCallback(() => {
    setIsCalculatingROI(true);
    
    // Use setTimeout to prevent UI freeze
    setTimeout(() => {
      // Rental Yield = (Annual Rental Income - Annual Expenses) / Property Value * 100
      const netRentalIncome = annualRental - annualExpenses;
      const rentalYield = (netRentalIncome / propertyValue) * 100;
  
      // Future Value of property after appreciation
      const futureValue = propertyValue * Math.pow(1 + propertyAppreciation / 100, investmentPeriod);
      const appreciationValue = futureValue - propertyValue;
  
      // Total ROI = (Future Value + Total Rental Income - Property Value - Total Expenses) / Property Value * 100
      const totalRentalIncome = netRentalIncome * investmentPeriod;
      const totalROI = ((futureValue + totalRentalIncome - propertyValue) / propertyValue) * 100;
  
      setRoiResult({
        rentalYield,
        totalRoi: totalROI,
        appreciationValue,
        futureValue,
      });
      setIsCalculatingROI(false);
    }, 100);
  }, [propertyValue, annualRental, annualExpenses, propertyAppreciation, investmentPeriod]);

  // Input change handlers with useCallback
  const handleNumberInputChange = useCallback((setter: React.Dispatch<React.SetStateAction<number>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      if (!isNaN(value)) {
        setter(value);
      }
    }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Real Estate Calculator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate mortgage payments and investment returns
          </p>
        </div>

        <Tabs defaultValue="emi" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="emi" className="flex items-center gap-2">
              <Home className="w-4 h-4" /> Mortgage EMI
            </TabsTrigger>
            <TabsTrigger value="roi" className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4" /> Investment ROI
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="emi">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-accent" />
                  <span>Mortgage EMI Calculator</span>
                </CardTitle>
                <CardDescription>
                  Calculate your monthly mortgage payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
                    <Input
                      id="loan-amount"
                      type="number"
                      value={loanAmount}
                      onChange={handleNumberInputChange(setLoanAmount)}
                      placeholder="Enter loan amount"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <Input
                      id="interest-rate"
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={handleNumberInputChange(setInterestRate)}
                      placeholder="Enter interest rate"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loan-term">Loan Term (Years)</Label>
                    <Input
                      id="loan-term"
                      type="number"
                      value={loanTerm}
                      onChange={handleNumberInputChange(setLoanTerm)}
                      placeholder="Enter loan term in years"
                    />
                  </div>
                </div>
                
                <Button onClick={calculateEMI} className="w-full mt-4" disabled={isCalculatingEMI}>
                  {isCalculatingEMI ? 'Calculating...' : 'Calculate EMI'}
                </Button>
                
                {isCalculatingEMI ? (
                  <div className={`mt-6 grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
                    {[1, 2, 3].map(idx => (
                      <Skeleton key={idx} className="h-16 w-full" />
                    ))}
                  </div>
                ) : emiResult ? (
                  <div className={`mt-6 grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
                    <div className="bg-accent/10 p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Monthly EMI</p>
                      <p className="text-base sm:text-lg font-bold break-words">
                        ₹{Math.round(emiResult).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-accent/10 p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Total Interest</p>
                      <p className="text-base sm:text-lg font-bold break-words">
                        ₹{Math.round(totalInterest!).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Total Payment</p>
                      <p className="text-base sm:text-lg font-bold break-words">
                        ₹{Math.round(totalPayment!).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roi">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  <span>Real Estate ROI Calculator</span>
                </CardTitle>
                <CardDescription>
                  Analyze your real estate investment returns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="property-value">Property Value (₹)</Label>
                    <Input
                      id="property-value"
                      type="number"
                      value={propertyValue}
                      onChange={handleNumberInputChange(setPropertyValue)}
                      placeholder="Enter property value"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="annual-rental">Annual Rental Income (₹)</Label>
                    <Input
                      id="annual-rental"
                      type="number"
                      value={annualRental}
                      onChange={handleNumberInputChange(setAnnualRental)}
                      placeholder="Enter annual rental income"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="annual-expenses">Annual Expenses (₹)</Label>
                    <Input
                      id="annual-expenses"
                      type="number"
                      value={annualExpenses}
                      onChange={handleNumberInputChange(setAnnualExpenses)}
                      placeholder="Enter annual expenses"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="property-appreciation">Annual Appreciation Rate (%)</Label>
                    <Input
                      id="property-appreciation"
                      type="number"
                      step="0.1"
                      value={propertyAppreciation}
                      onChange={handleNumberInputChange(setPropertyAppreciation)}
                      placeholder="Enter annual appreciation rate"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="investment-period">Investment Period (Years)</Label>
                    <Input
                      id="investment-period"
                      type="number"
                      value={investmentPeriod}
                      onChange={handleNumberInputChange(setInvestmentPeriod)}
                      placeholder="Enter investment period in years"
                    />
                  </div>
                </div>
                
                <Button onClick={calculateROI} className="w-full mt-4" disabled={isCalculatingROI}>
                  {isCalculatingROI ? 'Calculating...' : 'Calculate ROI'}
                </Button>
                
                {isCalculatingROI ? (
                  <div className="mt-6">
                    <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-4'}`}>
                      {[1, 2, 3, 4].map(idx => (
                        <Skeleton key={idx} className="h-16 w-full" />
                      ))}
                    </div>
                  </div>
                ) : roiResult ? (
                  <div className="mt-6 space-y-4">
                    <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-4'}`}>
                      <div className="bg-accent/10 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Rental Yield</p>
                        <p className="text-sm sm:text-base font-bold break-words">
                          {roiResult.rentalYield.toFixed(2)}%
                        </p>
                      </div>
                      <div className="bg-accent/10 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Total ROI</p>
                        <p className="text-sm sm:text-base font-bold break-words">
                          {roiResult.totalRoi.toFixed(2)}%
                        </p>
                      </div>
                      <div className="bg-accent/10 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Appreciation</p>
                        <p className="text-sm sm:text-base font-bold break-words">
                          ₹{Math.round(roiResult.appreciationValue).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-accent/20 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Future Value</p>
                        <p className="text-sm sm:text-base font-bold break-words">
                          ₹{Math.round(roiResult.futureValue).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default RealEstateCalculator;
