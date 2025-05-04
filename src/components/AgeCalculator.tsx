
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import { differenceInYears, differenceInMonths, differenceInDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DateDiff = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
};

const AgeCalculator = () => {
  // Age Calculator
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [birthDay, setBirthDay] = useState<number | null>(null);
  const [age, setAge] = useState<DateDiff | null>(null);

  // Generate options for days, months, and years
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 121 }, (_, i) => currentYear - i);

  const calculateAge = () => {
    if (!birthYear || birthMonth === null || !birthDay) return;
    
    const birthDateObj = new Date(birthYear, birthMonth, birthDay);
    
    const today = new Date();
    const years = differenceInYears(today, birthDateObj);
    const months = differenceInMonths(today, birthDateObj) % 12;
    
    // Calculate days correctly accounting for different month lengths
    // Get a date that represents the same day in the current month/year
    const currentYearMonth = new Date(today.getFullYear(), today.getMonth(), birthDateObj.getDate());
    // If the date doesn't exist in current month (e.g., trying to get Feb 30), 
    // the date automatically adjusts to the last day of the month
    const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const birthDayInThisMonth = birthDateObj.getDate() > daysInCurrentMonth ? daysInCurrentMonth : birthDateObj.getDate();
    
    // Calculate days difference
    const days = differenceInDays(
      today,
      new Date(today.getFullYear(), today.getMonth(), birthDayInThisMonth)
    );
    
    const totalDays = differenceInDays(today, birthDateObj);

    setAge({
      years,
      months,
      days,
      totalDays
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      <Helmet>
        <title>Age Calculator - Calculate Your Exact Age in Years, Months, Days | Tool Vault</title>
        <meta name="description" content="Calculate your exact age in years, months, and days with our free online age calculator. Know your precise age down to the day." />
        <meta name="keywords" content="age calculator, calculate age, how old am I, age in years months days, birthday calculator, exact age calculator, age difference" />
        <meta property="og:title" content="Age Calculator - Calculate Your Exact Age | Tool Vault" />
        <meta property="og:description" content="Calculate your exact age in years, months, and days with our simple and intuitive age calculator tool." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://toolvault.com/calculators/age" />
      </Helmet>

      <Header />

      <main className="flex-grow px-4 py-8 container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Age Calculator</h1>
        <p className="text-center text-gray-300 mb-10">
          Calculate your exact age from birth date in years, months, and days
        </p>

        <Card className="glass-panel glass-panel-dark border border-slate-700/80 backdrop-blur-sm bg-slate-800/50">
          <CardHeader className="bg-slate-700/50 border-b border-slate-600/50">
            <CardTitle className="text-white">Age Calculator</CardTitle>
            <CardDescription className="text-gray-300">
              Find out your exact age in years, months, and days
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="birthDay" className="text-white">Day</Label>
                  <Select value={birthDay?.toString()} onValueChange={(value) => setBirthDay(parseInt(value))}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      {days.map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="birthMonth" className="text-white">Month</Label>
                  <Select value={birthMonth?.toString()} onValueChange={(value) => setBirthMonth(parseInt(value))}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="birthYear" className="text-white">Year</Label>
                  <Select value={birthYear?.toString()} onValueChange={(value) => setBirthYear(parseInt(value))}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto bg-slate-800 border-slate-600 text-white">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {age && (
                <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700/50">
                  <h3 className="text-lg font-medium mb-3 text-white">Your Age is:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">In Years, Months & Days</p>
                      <p className="text-2xl font-bold text-white">
                        {age.years} years, {age.months} months, {age.days} days
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">Total Days</p>
                      <p className="text-2xl font-bold text-white">{age.totalDays.toLocaleString()} days</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-slate-800/30 border-t border-slate-600/50 p-6">
            <Button 
              onClick={calculateAge} 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white" 
              disabled={!birthYear || birthMonth === null || !birthDay}
              size="lg"
            >
              Calculate Age
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-12 bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
          <h2 className="text-xl font-semibold mb-4 text-white">About Age Calculator</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              The Age Calculator tool lets you find your exact age from your date of birth in years, months, days, and total days.
            </p>
            <p>
              Simply select the day, month, and year of your birth from the dropdown menus and click "Calculate Age" to see your exact age.
            </p>
            <p>
              All calculations are performed instantly in your browser with no data sent to any server, ensuring your privacy is maintained.
            </p>
          </div>
        </div>

        <div className="mt-8 bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
          <h2 className="text-xl font-semibold mb-4 text-white">How Age Calculation Works</h2>
          <div className="space-y-4 text-gray-300">
            <p>Our age calculator uses precise algorithms to determine your exact age:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><span className="font-medium text-white">Years:</span> Complete years since your birth date</li>
              <li><span className="font-medium text-white">Months:</span> Additional months beyond complete years</li>
              <li><span className="font-medium text-white">Days:</span> Additional days beyond complete months</li>
              <li><span className="font-medium text-white">Total Days:</span> The total number of days you've been alive</li>
            </ul>
            <p>
              The calculator automatically accounts for leap years, different month lengths, and daylight saving time changes to give you the most accurate result possible.
            </p>
          </div>
        </div>

        <div className="mt-8 bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
          <h2 className="text-xl font-semibold mb-4 text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">How accurate is this age calculator?</h3>
              <p className="text-gray-300">
                Our age calculator is highly accurate, using proven date calculation algorithms that account for leap years, varying month lengths, and other calendar nuances.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Why might my age calculation differ from other calculators?</h3>
              <p className="text-gray-300">
                Some calculators use different methods for calculating months and days. Our calculator follows standard conventions where each completed month is counted, and days are calculated based on the current month.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Is my data private when using this calculator?</h3>
              <p className="text-gray-300">
                Yes, absolutely. All calculations are performed locally in your browser. We don't store, collect, or transmit your birth date or any other personal information.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AgeCalculator;
