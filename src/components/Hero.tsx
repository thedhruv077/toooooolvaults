
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-32 md:py-40 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full glass-panel glass-panel-dark animate-fade-in mb-8">
          Free Premium Tools for Everyone
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-glass animate-fade-in [animation-delay:200ms] text-balance leading-tight">
          Free Online Calculators & Utilities
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 mb-10 animate-fade-in [animation-delay:400ms] max-w-2xl mx-auto text-balance">
          Discover our collection of free premium utilities designed to simplify 
          calculations, generate useful resources, and improve productivity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:600ms]">
          <Link
            to="/calculators/percentage"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-medium transition-all duration-300 hover:bg-accent/90 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <span>Try a Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/utilities/qr-code"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border glass-panel glass-panel-dark font-medium transition-all duration-300 hover:bg-accent/10 hover:shadow-lg active:scale-95"
          >
            <span>Explore Utilities</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
