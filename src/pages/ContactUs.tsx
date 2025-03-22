
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { name, email, message });
    // Simulating form submission
    setTimeout(() => {
      setSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setSubmitted(false);
      }, 3000);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
            <div className="border-b border-border/50 p-6">
              <h1 className="text-2xl font-bold">Contact Us</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                  <p className="text-foreground/80 leading-relaxed mb-6">
                    Have questions about our tools? Want to suggest a new calculator for your blog? We'd love to hear from you!
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mr-4">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Email</h3>
                      <p className="text-foreground/70">
                        <a href="mailto:jdevi8866@gmail.com" className="hover:text-accent">jdevi8866@gmail.com</a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mr-4">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Phone</h3>
                      <p className="text-foreground/70">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mr-4">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Location</h3>
                      <p className="text-foreground/70">Digital Nomads - Worldwide</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/30 p-5 rounded-xl border border-border/30">
                  <h3 className="text-lg font-medium mb-2">Response Time</h3>
                  <p className="text-foreground/80">
                    We strive to respond to all inquiries within 24-48 hours. For urgent matters, please mention "Urgent" in your subject line.
                  </p>
                </div>
              </div>
              
              <div className="glass-panel rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
                
                {submitted ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-foreground/70 max-w-xs">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="name">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="email">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="message">
                        Your Message
                      </label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactUs;
