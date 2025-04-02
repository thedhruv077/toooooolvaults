import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Users, Award, BarChart3, Target } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-16 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
            <div className="border-b border-border/50 p-6">
              <h1 className="text-2xl font-bold">About Us</h1>
            </div>
            
            <div className="p-6 space-y-8">
              <section className="max-w-3xl mx-auto">
                <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                  Welcome to Blogger Tools, your premium suite of utilities designed specifically for content creators, bloggers, and online entrepreneurs.
                </p>
                
                <div className="bg-accent/5 p-6 rounded-xl border border-accent/20 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
                  <p className="text-foreground/80 leading-relaxed">
                    We believe that great blogging should be accessible to everyone. Our mission is to provide free, high-quality tools that help bloggers create more engaging content, save time on routine calculations, and enhance their online presence.
                  </p>
                </div>
                
                <h2 className="text-xl font-semibold mb-4">What Makes Us Different</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Blogger-Focused</h3>
                      <p className="text-foreground/70">
                        Every tool we create is designed with bloggers in mind, focusing on real needs and practical applications.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Premium Quality</h3>
                      <p className="text-foreground/70">
                        We offer professional-grade calculators and utilities that rival paid tools, completely free.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Data-Driven</h3>
                      <p className="text-foreground/70">
                        Our tools help you make informed decisions based on accurate calculations and reliable results.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Purpose-Built</h3>
                      <p className="text-foreground/70">
                        Each utility is optimized for specific blogging use cases, helping you create more valuable content.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-4">Our Story</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Blogger Tools was born from a simple observation: bloggers need specialized calculators and utilities to create great content, but existing solutions were either too complex, too expensive, or not tailored to content creators.
                </p>
                <p className="text-foreground/80 leading-relaxed mb-8">
                  We started with a few simple calculators designed specifically for blog content and steadily expanded our collection based on user feedback and requests. Today, we're proud to offer a comprehensive suite of tools that help thousands of bloggers worldwide.
                </p>
                
                <div className="bg-background/30 p-6 rounded-xl border border-border/30">
                  <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Have questions or suggestions for new tools? We'd love to hear from you! Reach out to us at <a href="mailto:jdevi8866@gmail.com" className="text-accent hover:underline">jdevi8866@gmail.com</a>.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
