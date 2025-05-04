
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import { differenceInDays, differenceInMonths, differenceInYears } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DateDiff = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
};

const DateDifferenceCalculator = () => {
  // Start date
  const [startDay, setStartDay] = useState<number | null>(null);
  const [startMonth, setStartMonth] = useState<number | null>(null);
  const [startYear, setStartYear] = useState<number | null>(null);
  
  // End date
  const [endDay, setEndDay] = useState<number | null>(null);
  const [endMonth, setEndMonth] = useState<number | null>(null);
  const [endYear, setEndYear] = useState<number | null>(null);
  
  const [dateDifference, setDateDifference] = useState<DateDiff | null>(null);

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
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);

  const calculateDateDifference = () => {
    if (!startDay || startMonth === null || !startYear || !endDay || endMonth === null || !endYear) {
      return;
    }

    const startDate = new Date(startYear, startMonth, startDay);
    const endDate = new Date(endYear, endMonth, endDay);

    if (endDate < startDate) {
      // Swap dates if end date is before start date
      const temp = startDate;
      startDate.setTime(endDate.getTime());
      endDate.setTime(temp.getTime());
    }

    const years = differenceInYears(endDate, startDate);
    const months = differenceInMonths(endDate, startDate) % 12;
    const totalDays = differenceInDays(endDate, startDate);
    
    // Calculate remaining days after accounting for years and months
    const tempDate = new Date(startDate);
    tempDate.setFullYear(tempDate.getFullYear() + years);
    tempDate.setMonth(tempDate.getMonth() + months);
    const days = differenceInDays(endDate, tempDate);

    setDateDifference({
      years,
      months,
      days,
      totalDays
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Date Difference Calculator - Find Time Between Dates | Tool Vault</title>
        <meta name="description" content="Calculate the exact time between two dates with our easy-to-use date difference calculator." />
      </Helmet>

      <Header />

      <main className="flex-grow px-4 py-8 container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-6">Date Difference Calculator</h1>
        <p className="text-center text-muted-foreground mb-10">
          Calculate the difference between any two dates in years, months, and days
        </p>

        <Card className="glass-panel glass-panel-dark">
          <CardHeader>
            <CardTitle>Date Difference Calculator</CardTitle>
            <CardDescription>
              Find the exact time between any two dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Start Date</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="startDay">Day</Label>
                    <Select value={startDay?.toString()} onValueChange={(value) => setStartDay(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={`start-day-${day}`} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="startMonth">Month</Label>
                    <Select value={startMonth?.toString()} onValueChange={(value) => setStartMonth(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={`start-month-${month.value}`} value={month.value.toString()}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="startYear">Year</Label>
                    <Select value={startYear?.toString()} onValueChange={(value) => setStartYear(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {years.map((year) => (
                          <SelectItem key={`start-year-${year}`} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">End Date</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="endDay">Day</Label>
                    <Select value={endDay?.toString()} onValueChange={(value) => setEndDay(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={`end-day-${day}`} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="endMonth">Month</Label>
                    <Select value={endMonth?.toString()} onValueChange={(value) => setEndMonth(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={`end-month-${month.value}`} value={month.value.toString()}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="endYear">Year</Label>
                    <Select value={endYear?.toString()} onValueChange={(value) => setEndYear(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {years.map((year) => (
                          <SelectItem key={`end-year-${year}`} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {dateDifference && (
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Difference Between Dates:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">In Years, Months & Days</p>
                      <p className="text-2xl font-bold">
                        {dateDifference.years} years, {dateDifference.months} months, {dateDifference.days} days
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Days</p>
                      <p className="text-2xl font-bold">{dateDifference.totalDays.toLocaleString()} days</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={calculateDateDifference} 
              className="w-full" 
              disabled={!startDay || startMonth === null || !startYear || !endDay || endMonth === null || !endYear}
            >
              Calculate Difference
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-12 bg-muted/30 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">About Date Difference Calculator</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Our Date Difference Calculator helps you find the exact time between any two dates.
            </p>
            <p>
              Simply select both dates using the dropdown selectors and click "Calculate Difference" to see the result in years, months, days, and total days.
            </p>
            <p>
              This tool is useful for calculating age, contract durations, project timelines, or any scenario where you need to know the time between two specific dates.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DateDifferenceCalculator;
