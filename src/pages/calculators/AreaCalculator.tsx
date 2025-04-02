
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AreaCalculator = () => {
  const [shape, setShape] = useState<'rectangle' | 'circle' | 'triangle'>('rectangle');
  const [dimensions, setDimensions] = useState({
    length: 0,
    width: 0,
    radius: 0,
    base: 0,
    height: 0
  });
  const [area, setArea] = useState<number | null>(null);

  const calculateArea = () => {
    let calculatedArea: number | null = null;

    switch (shape) {
      case 'rectangle':
        calculatedArea = dimensions.length * dimensions.width;
        break;
      case 'circle':
        calculatedArea = Math.PI * dimensions.radius * dimensions.radius;
        break;
      case 'triangle':
        calculatedArea = 0.5 * dimensions.base * dimensions.height;
        break;
    }

    setArea(calculatedArea ? Number(calculatedArea.toFixed(2)) : null);
  };

  const handleDimensionChange = (key: keyof typeof dimensions, value: string) => {
    setDimensions(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-12 max-w-xl">
        <div className="glass-panel glass-panel-dark rounded-2xl p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center mb-6">Area Calculator</h1>
          
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg bg-secondary/20 p-1">
              {(['rectangle', 'circle', 'triangle'] as const).map(shapeType => (
                <button
                  key={shapeType}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    shape === shapeType 
                      ? 'bg-accent text-white' 
                      : 'text-foreground/70 hover:bg-secondary/30'
                  }`}
                  onClick={() => setShape(shapeType)}
                >
                  {shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {shape === 'rectangle' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Length</label>
                <input
                  type="number"
                  value={dimensions.length}
                  onChange={(e) => handleDimensionChange('length', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter length"
                />
              </div>
              <div>
                <label className="block mb-2">Width</label>
                <input
                  type="number"
                  value={dimensions.width}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter width"
                />
              </div>
            </div>
          )}

          {shape === 'circle' && (
            <div>
              <label className="block mb-2">Radius</label>
              <input
                type="number"
                value={dimensions.radius}
                onChange={(e) => handleDimensionChange('radius', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter radius"
              />
            </div>
          )}

          {shape === 'triangle' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Base</label>
                <input
                  type="number"
                  value={dimensions.base}
                  onChange={(e) => handleDimensionChange('base', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter base"
                />
              </div>
              <div>
                <label className="block mb-2">Height</label>
                <input
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter height"
                />
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={calculateArea}
              className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Calculate Area
            </button>
          </div>

          {area !== null && (
            <div className="text-center mt-6 bg-secondary/10 p-4 rounded-lg">
              <p className="text-xl font-bold">
                Area: <span className="text-accent">{area} sq units</span>
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AreaCalculator;
