
import React, { useState, useEffect } from "react";
import { Lock, Copy, RefreshCw, CheckCircle2, Shield, Sliders } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Header from "./Header";
import Footer from "./Footer";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  
  useEffect(() => {
    generatePassword();
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols]);
  
  useEffect(() => {
    calculatePasswordStrength();
  }, [password]);
  
  const generatePassword = () => {
    let charset = "";
    
    if (useLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (useUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useNumbers) charset += "0123456789";
    if (useSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    // Ensure at least one character set is selected
    if (charset === "") {
      setUseLowercase(true);
      charset = "abcdefghijklmnopqrstuvwxyz";
    }
    
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    
    setPassword(generatedPassword);
  };
  
  const calculatePasswordStrength = () => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    // Start with a base score
    let strength = 0;
    
    // Add points for length
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    
    // Add points for character variety
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    // Normalize to a 0-100 scale
    setPasswordStrength(Math.min((strength / 7) * 100, 100));
  };
  
  const getStrengthLabel = () => {
    if (passwordStrength < 33) return "Weak";
    if (passwordStrength < 66) return "Moderate";
    return "Strong";
  };
  
  const getStrengthColor = () => {
    if (passwordStrength < 33) return "bg-red-500";
    if (passwordStrength < 66) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
            <div className="border-b border-border/50 p-6 flex items-center gap-3">
              <Lock className="w-5 h-5 text-accent" />
              <h1 className="text-xl font-semibold">Password Generator for Blog Content</h1>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-foreground/70 mb-6">
                  Create strong, secure passwords for your blog accounts or to share with your readers. 
                  Copy the generated passwords directly to use in your tutorials or security guides.
                </p>
                
                <div className="relative mb-8">
                  <Input
                    type="text"
                    value={password}
                    readOnly
                    className="pr-24 text-lg py-6 font-mono bg-background/30"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="absolute right-1 top-1 bottom-1 flex items-center gap-1 px-4"
                    variant="secondary"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Sliders className="w-4 h-4" />
                      Password Length: {length}
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="6"
                      max="32"
                      value={length}
                      onChange={(e) => setLength(parseInt(e.target.value))}
                      className="flex-grow h-2 rounded-lg appearance-none bg-accent/30 cursor-pointer"
                    />
                    <span className="text-sm font-medium w-8 text-right">{length}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Character Types</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="uppercase" className="font-normal">Uppercase (A-Z)</Label>
                      </div>
                      <Switch
                        id="uppercase"
                        checked={useUppercase}
                        onCheckedChange={setUseUppercase}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="lowercase" className="font-normal">Lowercase (a-z)</Label>
                      </div>
                      <Switch
                        id="lowercase"
                        checked={useLowercase}
                        onCheckedChange={setUseLowercase}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="numbers" className="font-normal">Numbers (0-9)</Label>
                      </div>
                      <Switch
                        id="numbers"
                        checked={useNumbers}
                        onCheckedChange={setUseNumbers}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="symbols" className="font-normal">Symbols (!@#$%...)</Label>
                      </div>
                      <Switch
                        id="symbols"
                        checked={useSymbols}
                        onCheckedChange={setUseSymbols}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Password Strength
                  </h3>
                  <div className="mb-2 h-2 w-full bg-background/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-foreground/70">
                    {getStrengthLabel()} - {Math.round(passwordStrength)}%
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={generatePassword}
                    className="px-6 gap-2"
                    size="lg"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate New Password
                  </Button>
                </div>
              </div>
              
              <div className="mt-8 p-4 rounded-lg bg-background/30">
                <h3 className="font-medium mb-2">Password Security Tips for Your Blog</h3>
                <ul className="space-y-1 text-sm text-foreground/70">
                  <li>• Use a different password for each website or service</li>
                  <li>• Longer passwords (16+ characters) provide better security</li>
                  <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
                  <li>• Consider using a password manager for your blog accounts</li>
                  <li>• Change passwords regularly (every 3-6 months)</li>
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

export default PasswordGenerator;
