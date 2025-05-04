
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import { differenceInYears, differenceInMonths, differenceInDays, format, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

type DateDiff = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
};

const DateDifferenceCalculator = () => {
  // Date Difference Calculator
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dateDifference, setDateDifference] = useState<DateDiff | null>(null);
  const [useCalendar, setUseCalendar] = useState<boolean>(true);
  
  // For start date manual selection
  const [startDay, setStartDay] = useState<number | null>(null);
  const [startMonth, setStartMonth] = useState<number | null>(null);
  const [startYear, setStartYear] = useState<number | null>(null);

  // For end date manual selection
  const [endDay, setEndDay] = useState<number | null>(null);
  const [endMonth, setEndMonth] = useState<number | null>(null);
  const [endYear, setEndYear] = useState<number | null>(null);

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
    if (useCalendar) {
      if (!startDate || !endDate) return;
    } else {
      if (!startYear || startMonth === null || !startDay || !endYear || endMonth === null || !endDay) return;
      
      const startDateObj = new Date(startYear, startMonth, startDay);
      const endDateObj = new Date(endYear, endMonth, endDay);
      
      if (!isValid(startDateObj) || !isValid(endDateObj)) return;
      
      setStartDate(startDateObj);
      setEndDate(endDateObj);
    }

    // Ensure we have valid dates to calculate with
    if (!startDate || !endDate) return;

    // Ensure endDate is after or equal to startDate
    const start = startDate < endDate ? startDate : endDate;
    const end = startDate < endDate ? endDate : startDate;

    const years = differenceInYears(end, start);
    const months = differenceInMonths(end, start) % 12;
    const days = differenceInDays(
      end,
      new Date(end.getFullYear(), end.getMonth(), start.getDate())
    );
    const totalDays = differenceInDays(end, start);

    setDateDifference({
      years,
      months,
      days,
      totalDays
    });
  };

  // Handle date parts selection
  useEffect(() => {
    if (!useCalendar && startYear && startMonth !== null && startDay) {
      const newStartDate = new Date(startYear, startMonth, startDay);
      if (isValid(newStartDate)) {
        setStartDate(newStartDate);
      }
    }
  }, [useCalendar, startYear, startMonth, startDay]);

  useEffect(() => {
    if (!useCalendar && endYear && endMonth !== null && endDay) {
      const newEndDate = new Date(endYear, endMonth, endDay);
      if (isValid(newEndDate)) {
        setEndDate(newEndDate);
      }
    }
  }, [useCalendar, endYear, endMonth, endDay]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Date Difference Calculator - Find Time Between Dates | Tool Vault</title>
        <meta name="description" content="Calculate the exact time between any two dates with our easy-to-use date difference calculator." />
      </Helmet>

      <Header />

      <main className="flex-grow px-4 py-8 container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-6">Date Difference Calculator</h1>
        <p className="text-center text-muted-foreground mb-10">
          Calculate the time between any two dates
        </p>

        <Card className="glass-panel glass-panel-dark">
          <CardHeader>
            <CardTitle>Date Difference Calculator</CardTitle>
            <CardDescription>
              Calculate the time between any two dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Button 
                  variant={useCalendar ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setUseCalendar(true)}
                  className="text-xs"
                >
                  Calendar View
                </Button>
                <Button 
                  variant={!useCalendar ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setUseCalendar(false)}
                  className="text-xs"
                >
                  Select Date Parts
                </Button>
              </div>

              {useCalendar ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <div className="flex items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Select start date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <div className="flex items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Select end date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Start Date</h3>
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
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">End Date</h3>
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
              )}

              {dateDifference && (
                <div className="bg-accent/10 p-4 rounded-lg mt-6">
                  <h3 className="text-lg font-medium mb-3">Date Difference:</h3>
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
              disabled={
                useCalendar 
                  ? (!startDate || !endDate)
                  : (!startYear || startMonth === null || !startDay || !endYear || endMonth === null || !endDay)
              }
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
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Calendar View:</strong> Select both dates using an intuitive calendar interface.
              </li>
              <li>
                <strong>Date Parts Selection:</strong> Alternatively, select the day, month, and year for both dates individually.
              </li>
              <li>
                The calculator shows results in years, months, days, and total days, making it perfect for project planning, event scheduling, or tracking time periods.
              </li>
            </ul>
            <p>
              All calculations are performed instantly in your browser with no data sent to any server, ensuring your privacy is maintained.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DateDifferenceCalculator;
