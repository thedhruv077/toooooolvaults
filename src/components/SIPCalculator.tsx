
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, BarChart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from "./Header";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [years, setYears] = useState<number>(10);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [result, setResult] = useState<{
    totalInvestment: number;
    totalInterest: number;
    totalValue: number;
    yearlyData: any[];
  }>({
    totalInvestment: 0,
    totalInterest: 0,
    totalValue: 0,
    yearlyData: [],
  });
  const [isCalculated, setIsCalculated] = useState(false);
  const isMobile = useIsMobile();

  const calculateSIP = () => {
    const monthlyRate = interestRate / 12 / 100;
    const months = years * 12;
    const totalInvestment = monthlyInvestment * months;
    
    // FV = P × ((1 + r)^n - 1) / r × (1 + r)
    const totalValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    
    const totalInterest = totalValue - totalInvestment;
    
    // Create yearly data for the chart
    const yearlyData = [];
    for (let y = 1; y <= years; y++) {
      const yearlyMonths = y * 12;
      const yearlyInvestment = monthlyInvestment * yearlyMonths;
      const yearlyValue = monthlyInvestment * 
        ((Math.pow(1 + monthlyRate, yearlyMonths) - 1) / monthlyRate) * 
        (1 + monthlyRate);
      
      yearlyData.push({
        year: y,
        investment: Math.round(yearlyInvestment),
        value: Math.round(yearlyValue),
        interest: Math.round(yearlyValue - yearlyInvestment)
      });
    }
    
    setResult({
      totalInvestment,
      totalInterest,
      totalValue,
      yearlyData,
    });
    
    setIsCalculated(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">SIP Calculator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate the future value of your Systematic Investment Plan (SIP).
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-accent" />
                <span>SIP Calculator</span>
              </CardTitle>
              <CardDescription>
                Enter your investment details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthly-investment">Monthly Investment (₹)</Label>
                <Input
                  id="monthly-investment"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  placeholder="Enter amount"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-period">Time Period (Years)</Label>
                <Input
                  id="time-period"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  placeholder="Enter years"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interest-rate">Expected Return Rate (%)</Label>
                <Input
                  id="interest-rate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  placeholder="Enter rate"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={calculateSIP} className="w-full">
                Calculate <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-accent" />
                <span>Results</span>
              </CardTitle>
              <CardDescription>
                Visualization of your SIP investment growth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isCalculated ? (
                <>
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'}`}>
                    <div className="bg-accent/10 p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Invested Amount</p>
                      <p className="text-lg font-bold break-words">₹{result.totalInvestment.toLocaleString()}</p>
                    </div>
                    <div className="bg-accent/10 p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Est. Returns</p>
                      <p className="text-lg font-bold break-words">₹{Math.round(result.totalInterest).toLocaleString()}</p>
                    </div>
                    <div className="bg-accent/20 p-4 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-lg font-bold break-words">₹{Math.round(result.totalValue).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="h-[250px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={result.yearlyData}
                        margin={{
                          top: 5,
                          right: isMobile ? 10 : 30,
                          left: isMobile ? 0 : 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                        <YAxis width={isMobile ? 30 : 40} tickFormatter={(value) => isMobile ? `${value/1000}k` : value} />
                        <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, undefined]} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="investment"
                          name="Investment"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="value" name="Total Value" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="interest" name="Interest" stroke="#ffc658" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[250px] text-center">
                  <Calculator className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Enter your investment details and click Calculate
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SIPCalculator;
