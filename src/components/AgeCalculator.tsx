
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import { differenceInYears, differenceInMonths, differenceInDays, format, parse, isValid } from "date-fns";
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

const AgeCalculator = () => {
  // Age Calculator
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [birthDay, setBirthDay] = useState<number | null>(null);
  const [age, setAge] = useState<DateDiff | null>(null);
  const [useCalendar, setUseCalendar] = useState<boolean>(true);

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

  const calculateAgeFromParts = () => {
    if (!birthYear || !birthMonth || !birthDay) return;
    
    const birthDateObj = new Date(birthYear, birthMonth, birthDay);
    if (!isValid(birthDateObj)) return;
    
    const today = new Date();
    const years = differenceInYears(today, birthDateObj);
    const months = differenceInMonths(today, birthDateObj) % 12;
    const days = differenceInDays(
      today,
      new Date(today.getFullYear(), today.getMonth(), birthDateObj.getDate())
    );
    const totalDays = differenceInDays(today, birthDateObj);

    setAge({
      years,
      months,
      days,
      totalDays
    });
  };

  const calculateAgeFromCalendar = () => {
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

  // Handle birthdate selection from manual dropdown
  useEffect(() => {
    if (birthYear && birthMonth !== null && birthDay) {
      calculateAgeFromParts();
    }
  }, [birthYear, birthMonth, birthDay]);

  // Handle birthdate selection from calendar
  useEffect(() => {
    if (birthDate && useCalendar) {
      calculateAgeFromCalendar();
    }
  }, [birthDate, useCalendar]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Age Calculator - Calculate Your Exact Age | Tool Vault</title>
        <meta name="description" content="Calculate your exact age in years, months, and days with our simple and intuitive age calculator tool." />
      </Helmet>

      <Header />

      <main className="flex-grow px-4 py-8 container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-6">Age Calculator</h1>
        <p className="text-center text-muted-foreground mb-10">
          Calculate your exact age from birth date in years, months, and days
        </p>

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
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="birthDay">Day</Label>
                      <Select value={birthDay?.toString()} onValueChange={(value) => setBirthDay(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day} value={day.toString()}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="birthMonth">Month</Label>
                      <Select value={birthMonth?.toString()} onValueChange={(value) => setBirthMonth(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value.toString()}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="birthYear">Year</Label>
                      <Select value={birthYear?.toString()} onValueChange={(value) => setBirthYear(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] overflow-y-auto">
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
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
              onClick={useCalendar ? calculateAgeFromCalendar : calculateAgeFromParts} 
              className="w-full" 
              disabled={useCalendar ? !birthDate : (!birthYear || birthMonth === null || !birthDay)}
            >
              Calculate Age
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-12 bg-muted/30 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">About Age Calculator</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The Age Calculator tool lets you find your exact age from your date of birth in years, months, days, and total days.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Calendar View:</strong> Select your date of birth using an interactive calendar interface.
              </li>
              <li>
                <strong>Date Parts Selection:</strong> Alternatively, select the day, month, and year individually from dropdown menus.
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

export default AgeCalculator;
