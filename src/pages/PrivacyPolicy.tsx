import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GoogleAd from "../components/GoogleAd";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <GoogleAd slot="privacy-top-ad-slot" format="horizontal" className="mb-6" />
          
          <div className="glass-panel glass-panel-dark rounded-2xl overflow-hidden">
            <div className="border-b border-border/50 p-6">
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
            </div>
            
            <div className="p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Introduction</h2>
                <p className="text-foreground/80 leading-relaxed">
                  At Blogger Tools, we respect your privacy and are committed to protecting your personal data. 
                  This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
                </p>
              </section>
              
              <GoogleAd slot="privacy-mid-ad-slot" format="rectangle" className="my-6" />
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
                <p className="text-foreground/80 leading-relaxed mb-3">
                  We collect minimal information to improve your experience:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Usage data (pages visited, time spent on site)</li>
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
                <p className="text-foreground/80 leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Improve our website functionality and user experience</li>
                  <li>Analyze usage patterns and optimize performance</li>
                  <li>Protect against fraudulent or unauthorized access</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Cookies</h2>
                <p className="text-foreground/80 leading-relaxed">
                  We use cookies to enhance your browsing experience. You can adjust your browser settings to refuse cookies, 
                  but this may limit your ability to use some features of our site.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
                <p className="text-foreground/80 leading-relaxed">
                  Our website may use third-party services such as Google Analytics to help us understand how our site is used. 
                  These services may collect information about your visits but do not identify you personally.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
                <p className="text-foreground/80 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at jdevi8866@gmail.com.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
                <p className="text-foreground/80 leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                  Privacy Policy on this page.
                </p>
              </section>
              
              <p className="text-sm text-foreground/60 pt-4 border-t border-border/30">
                Last updated: March 22, 2025
              </p>
            </div>
          </div>
          
          <GoogleAd slot="privacy-bottom-ad-slot" format="horizontal" className="mt-6" />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
