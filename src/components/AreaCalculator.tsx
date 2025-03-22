
import React, { useState, useEffect } from "react";
import { Calculator, MoveHorizontal, MoveVertical, SquareCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "./Header";
import Footer from "./Footer";

type ShapeType = "rectangle" | "circle" | "triangle" | "square";

interface ShapeConfig {
  name: string;
  inputs: {
    label: string;
    placeholder: string;
    icon: React.ReactNode;
    unit: string;
  }[];
  calculate: (values: number[]) => number;
  formula: string;
}

const AreaCalculator = () => {
  const [shapeType, setShapeType] = useState<ShapeType>("rectangle");
  const [inputValues, setInputValues] = useState<string[]>(["0", "0"]);
  const [area, setArea] = useState<string>("0.00");
  const [areaUnit, setAreaUnit] = useState<string>("m²");
  const [lengthUnit, setLengthUnit] = useState<string>("m");
  const [animateResult, setAnimateResult] = useState(false);
  
  const shapes: Record<ShapeType, ShapeConfig> = {
    rectangle: {
      name: "Rectangle",
      inputs: [
        { 
          label: "Length", 
          placeholder: "Enter length", 
          icon: <MoveHorizontal className="w-4 h-4" />,
          unit: lengthUnit
        },
        { 
          label: "Width", 
          placeholder: "Enter width", 
          icon: <MoveVertical className="w-4 h-4" />,
          unit: lengthUnit
        }
      ],
      calculate: (values) => values[0] * values[1],
      formula: "Area = Length × Width"
    },
    square: {
      name: "Square",
      inputs: [
        { 
          label: "Side Length", 
          placeholder: "Enter side length", 
          icon: <MoveHorizontal className="w-4 h-4" />,
          unit: lengthUnit
        }
      ],
      calculate: (values) => values[0] * values[0],
      formula: "Area = Side Length²"
    },
    circle: {
      name: "Circle",
      inputs: [
        { 
          label: "Radius", 
          placeholder: "Enter radius", 
          icon: <SquareCode className="w-4 h-4" />,
          unit: lengthUnit
        }
      ],
      calculate: (values) => Math.PI * values[0] * values[0],
      formula: "Area = π × Radius²"
    },
    triangle: {
      name: "Triangle",
      inputs: [
        { 
          label: "Base", 
          placeholder: "Enter base length", 
          icon: <MoveHorizontal className="w-4 h-4" />,
          unit: lengthUnit
        },
        { 
          label: "Height", 
          placeholder: "Enter height", 
          icon: <MoveVertical className="w-4 h-4" />,
          unit: lengthUnit
        }
      ],
      calculate: (values) => (values[0] * values[1]) / 2,
      formula: "Area = (Base × Height) ÷ 2"
    }
  };
  
  useEffect(() => {
    // Reset input values when shape changes
    const defaultValues = Array(shapes[shapeType].inputs.length).fill("0");
    setInputValues(defaultValues);
    calculateArea(defaultValues);
  }, [shapeType, lengthUnit]);
  
  const calculateArea = (values: string[] = inputValues) => {
    const numericValues = values.map(val => parseFloat(val) || 0);
    const calculatedArea = shapes[shapeType].calculate(numericValues);
    
    setArea(calculatedArea.toFixed(2));
    
    setAnimateResult(true);
    setTimeout(() => setAnimateResult(false), 500);
  };
  
  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
    calculateArea(newValues);
  };
  
  const handleUnitChange = (value: string) => {
    setLengthUnit(value);
    
    // Update area unit based on length unit
    switch (value) {
      case "cm":
        setAreaUnit("cm²");
        break;
      case "m":
        setAreaUnit("m²");
        break;
      case "km":
        setAreaUnit("km²");
        break;
      case "ft":
        setAreaUnit("ft²");
        break;
      case "yd":
        setAreaUnit("yd²");
        break;
      default:
        setAreaUnit("m²");
    }
  };
  
  const reset = () => {
    const defaultValues = Array(shapes[shapeType].inputs.length).fill("0");
    setInputValues(defaultValues);
    calculateArea(defaultValues);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
            <div className="border-b border-border/50 p-6 flex items-center gap-3">
              <Calculator className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-semibold">Area Calculator for Blog Content</h1>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">Area Calculator for Your Blog Posts</h2>
                <p className="text-foreground/70 mb-6">
                  Easily calculate the area of common shapes to include in your blog posts about home improvement, 
                  gardening, DIY projects, or educational content.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Shape
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(shapes) as ShapeType[]).map((shape) => (
                        <button
                          key={shape}
                          onClick={() => setShapeType(shape)}
                          className={`py-2 rounded-md text-center transition-all duration-200 ${
                            shapeType === shape
                              ? "bg-accent text-white"
                              : "bg-accent/10 hover:bg-accent/20"
                          }`}
                        >
                          {shapes[shape].name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Unit of Measurement
                    </label>
                    <Select
                      value={lengthUnit}
                      onValueChange={handleUnitChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm">Millimeters (mm)</SelectItem>
                        <SelectItem value="cm">Centimeters (cm)</SelectItem>
                        <SelectItem value="m">Meters (m)</SelectItem>
                        <SelectItem value="km">Kilometers (km)</SelectItem>
                        <SelectItem value="in">Inches (in)</SelectItem>
                        <SelectItem value="ft">Feet (ft)</SelectItem>
                        <SelectItem value="yd">Yards (yd)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="glass-panel rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-accent" />
                      {shapes[shapeType].name} Measurements
                    </h3>
                    
                    <div className="space-y-4">
                      {shapes[shapeType].inputs.map((input, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            {input.icon}
                            {input.label} ({input.unit})
                          </label>
                          <Input
                            type="number"
                            value={inputValues[index]}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder={input.placeholder}
                            min="0"
                            step="0.01"
                          />
                        </div>
                      ))}
                    </div>
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

              <div
                className={`mt-8 p-6 rounded-lg glass-panel glass-panel-dark ${
                  animateResult ? "animate-scale-in" : ""
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-3 text-sm text-foreground/70 flex items-center gap-2">
                    {shapes[shapeType].formula}
                  </div>
                  
                  <div className="text-4xl font-bold text-glass mb-2">
                    {area} {areaUnit}
                  </div>
                  
                  <div className="text-sm text-foreground/70">
                    Area of {shapes[shapeType].name}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 rounded-lg bg-background/30">
                <h3 className="font-medium mb-2">Using Area Calculations in Your Blog</h3>
                <ul className="space-y-1 text-sm text-foreground/70">
                  <li>• Home improvement posts: Calculate paint or flooring needed</li>
                  <li>• Gardening articles: Determine soil or mulch requirements</li>
                  <li>• Educational content: Illustrate mathematical concepts</li>
                  <li>• DIY projects: Specify material quantities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AreaCalculator;
