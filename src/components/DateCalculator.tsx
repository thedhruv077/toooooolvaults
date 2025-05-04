
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import { differenceInYears, differenceInMonths, differenceInDays, format, parse, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

type DateDiff = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
};

const DateCalculator = () => {
  // Age Calculator
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [age, setAge] = useState<DateDiff | null>(null);

  // Date Difference Calculator
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dateDifference, setDateDifference] = useState<DateDiff | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const today = new Date();
    const years = differenceInYears(today, birthDate);
    const months = differenceInMonths(today, birthDate) % 12;
    const days = differenceInDays(
      today,
      new Date(today.getFullYear(), today.getMonth(), birthDate.getDate())
    );
    const totalDays = differenceInDays(today, birthDate);

    setAge({
      years,
      months,
      days,
      totalDays
    });
  };

  const calculateDateDifference = () => {
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

  useEffect(() => {
    if (birthDate) {
      calculateAge();
    }
  }, [birthDate]);

  useEffect(() => {
    if (startDate && endDate) {
      calculateDateDifference();
    }
  }, [startDate, endDate]);

  // Format the date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "PPP");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Date Calculator - Age & Date Difference | Tool Vault</title>
        <meta name="description" content="Calculate age from birth date and find the difference between two dates with our simple and intuitive date calculator." />
      </Helmet>

      <Header />

      <main className="flex-grow px-4 py-8 container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-6">Date Calculator</h1>
        <p className="text-center text-muted-foreground mb-10">
          Calculate age from birth date or find the difference between any two dates
        </p>

        <Tabs defaultValue="age" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="age">Age Calculator</TabsTrigger>
            <TabsTrigger value="difference">Date Difference</TabsTrigger>
          </TabsList>
          
          <TabsContent value="age">
            <Card className="glass-panel glass-panel-dark">
              <CardHeader>
                <CardTitle>Age Calculator</CardTitle>
                <CardDescription>
                  Find out your exact age in years, months, and days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Birth Date</Label>
                    <div className="flex items-center space-x-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !birthDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {birthDate ? format(birthDate, "PPP") : <span>Select date of birth</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={birthDate}
                            onSelect={setBirthDate}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {age && (
                    <div className="bg-accent/10 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3">Your Age is:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">In Years, Months & Days</p>
                          <p className="text-2xl font-bold">
                            {age.years} years, {age.months} months, {age.days} days
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Total Days</p>
                          <p className="text-2xl font-bold">{age.totalDays.toLocaleString()} days</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={calculateAge} 
                  className="w-full" 
                  disabled={!birthDate}
                >
                  Calculate Age
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="difference">
            <Card className="glass-panel glass-panel-dark">
              <CardHeader>
                <CardTitle>Date Difference Calculator</CardTitle>
                <CardDescription>
                  Calculate the time between any two dates
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={calculateDateDifference} 
                  className="w-full" 
                  disabled={!startDate || !endDate}
                >
                  Calculate Difference
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-muted/30 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">About Date Calculator</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              This tool provides two useful date calculations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Age Calculator:</strong> Find your exact age from your date of birth in years, months, days, and total days.
              </li>
              <li>
                <strong>Date Difference:</strong> Calculate the time between any two dates, helpful for project planning, event scheduling, or tracking time periods.
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

export default DateCalculator;
