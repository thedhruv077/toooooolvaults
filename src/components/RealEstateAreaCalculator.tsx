
import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, AreaChart, Ruler, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

type AreaUnit = "sqft" | "sqm" | "acre" | "hectare" | "bigha" | "marla";

const unitConversions: Record<AreaUnit, number> = {
  sqft: 1,
  sqm: 10.764,
  acre: 43560,
  hectare: 107639,
  bigha: 27000, // Standard bigha conversion, varies by region
  marla: 272.25, // Standard marla conversion, varies by region
};

const unitLabels: Record<AreaUnit, string> = {
  sqft: "Square Feet (sq ft)",
  sqm: "Square Meters (sq m)",
  acre: "Acres",
  hectare: "Hectares",
  bigha: "Bigha",
  marla: "Marla",
};

const RealEstateAreaCalculator = () => {
  const [length, setLength] = useState<string>("0");
  const [width, setWidth] = useState<string>("0");
  const [area, setArea] = useState<string>("0");
  const [inputUnit, setInputUnit] = useState<AreaUnit>("sqft");
  const [outputUnit, setOutputUnit] = useState<AreaUnit>("sqm");
  const [isRectangular, setIsRectangular] = useState<boolean>(true);
  const [calculatedArea, setCalculatedArea] = useState<number | null>(null);
  const [convertedResults, setConvertedResults] = useState<Record<AreaUnit, number>>({} as Record<AreaUnit, number>);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Memoized unit conversions
  const conversions = useMemo(() => unitConversions, []);
  const labels = useMemo(() => unitLabels, []);

  const calculateArea = useCallback(() => {
    setIsCalculating(true);
    
    setTimeout(() => {
      let calculatedValue: number;
      const lengthNum = parseFloat(length) || 0;
      const widthNum = parseFloat(width) || 0;
      const areaNum = parseFloat(area) || 0;
  
      if (isRectangular) {
        if (lengthNum <= 0 || widthNum <= 0) {
          toast({
            title: "Invalid dimensions",
            description: "Please enter positive values for length and width",
            variant: "destructive",
          });
          setIsCalculating(false);
          return;
        }
        calculatedValue = lengthNum * widthNum;
      } else {
        if (areaNum <= 0) {
          toast({
            title: "Invalid area",
            description: "Please enter a positive value for area",
            variant: "destructive",
          });
          setIsCalculating(false);
          return;
        }
        calculatedValue = areaNum;
      }
  
      setCalculatedArea(calculatedValue);
  
      // Convert to all units
      const results: Record<AreaUnit, number> = {} as Record<AreaUnit, number>;
      const valueInSqFt = inputUnit === "sqft" ? calculatedValue : calculatedValue * conversions[inputUnit];
  
      for (const unit of Object.keys(conversions) as AreaUnit[]) {
        if (unit === "sqft") {
          results[unit] = valueInSqFt;
        } else {
          results[unit] = valueInSqFt / conversions[unit];
        }
      }
  
      setConvertedResults(results);
  
      toast({
        title: "Area calculated",
        description: `${calculatedValue.toFixed(2)} ${inputUnit} = ${results[outputUnit].toFixed(2)} ${outputUnit}`,
      });
      
      setIsCalculating(false);
    }, 100);
  }, [length, width, area, isRectangular, inputUnit, outputUnit, conversions, toast]);

  const handleInputUnitChange = useCallback((value: string) => {
    setInputUnit(value as AreaUnit);
    // Reset calculated values when unit changes
    setCalculatedArea(null);
    setConvertedResults({} as Record<AreaUnit, number>);
  }, []);

  const handleOutputUnitChange = useCallback((value: string) => {
    setOutputUnit(value as AreaUnit);
  }, []);

  const handleInputChange = useCallback((setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    }, []);

  const toggleCalculationMode = useCallback((isRect: boolean) => {
    setIsRectangular(isRect);
    setCalculatedArea(null);
    setConvertedResults({} as Record<AreaUnit, number>);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Real Estate Area Calculator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate and convert property area measurements
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AreaChart className="w-5 h-5 text-accent" />
                <span>Area Calculator</span>
              </CardTitle>
              <CardDescription>
                Calculate property area and convert between units
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={isRectangular ? "default" : "outline"}
                  onClick={() => toggleCalculationMode(true)}
                  className="flex-1 text-xs md:text-sm"
                >
                  <Ruler className="w-4 h-4 mr-1" />
                  Length × Width
                </Button>
                <Button
                  variant={!isRectangular ? "default" : "outline"}
                  onClick={() => toggleCalculationMode(false)}
                  className="flex-1 text-xs md:text-sm"
                >
                  <AreaChart className="w-4 h-4 mr-1" />
                  Direct Area
                </Button>
              </div>

              {isRectangular ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length</Label>
                    <div className="flex gap-2">
                      <Input
                        id="length"
                        type="number"
                        value={length}
                        onChange={handleInputChange(setLength)}
                        placeholder="Enter length"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Width</Label>
                    <div className="flex gap-2">
                      <Input
                        id="width"
                        type="number"
                        value={width}
                        onChange={handleInputChange(setWidth)}
                        placeholder="Enter width"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="area">Area</Label>
                  <div className="flex gap-2">
                    <Input
                      id="area"
                      type="number"
                      value={area}
                      onChange={handleInputChange(setArea)}
                      placeholder="Enter area"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="input-unit">Input Unit</Label>
                <Select value={inputUnit} onValueChange={handleInputUnitChange}>
                  <SelectTrigger id="input-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(labels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="output-unit">Output Unit</Label>
                <Select value={outputUnit} onValueChange={handleOutputUnitChange}>
                  <SelectTrigger id="output-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(labels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={calculateArea} className="w-full" disabled={isCalculating}>
                {isCalculating ? 'Calculating...' : 'Calculate'} {!isCalculating && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-accent" />
                <span>Results</span>
              </CardTitle>
              <CardDescription>
                View calculated area in different units
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isCalculating ? (
                <>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
                    {[1, 2, 3, 4, 5, 6].map(idx => (
                      <Skeleton key={idx} className="h-16 w-full" />
                    ))}
                  </div>
                </>
              ) : calculatedArea ? (
                <>
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Original Area</p>
                    <p className="text-xl font-bold break-words">
                      {calculatedArea.toFixed(2)} {labels[inputUnit]}
                    </p>
                  </div>

                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
                    {Object.entries(convertedResults).map(([unit, value]) => (
                      <div
                        key={unit}
                        className={`p-3 rounded-lg ${
                          unit === outputUnit
                            ? "bg-accent/20 border border-accent"
                            : "bg-accent/5"
                        }`}
                      >
                        <p className="text-xs text-muted-foreground mb-1">{labels[unit as AreaUnit]}</p>
                        <p className="text-base md:text-lg font-semibold break-words">{value.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[250px] text-center">
                  <Calculator className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Enter your dimensions and click Calculate
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

export default RealEstateAreaCalculator;
