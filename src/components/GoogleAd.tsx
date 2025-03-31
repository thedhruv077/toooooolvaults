
import React, { useEffect, useRef } from "react";

type AdSize = "auto" | "horizontal" | "vertical" | "rectangle";

interface GoogleAdProps {
  slot: string; // Your ad slot ID
  format?: AdSize;
  className?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
}

const sizeMap = {
  auto: { width: "100%", height: "auto" },
  horizontal: { width: "728px", height: "90px" },
  vertical: { width: "160px", height: "600px" },
  rectangle: { width: "300px", height: "250px" },
};

const GoogleAd: React.FC<GoogleAdProps> = ({
  slot,
  format = "auto",
  className = "",
  responsive = true,
  style = {},
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !adRef.current) return;

    // Add the AdSense script if it doesn't exist
    if (!(window as any).adsbygoogle) {
      const script = document.createElement("script");
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.adClient = "ca-pub-XXXXXXXXXXXXXXXX"; // Replace with your actual ad client ID
      document.head.appendChild(script);
    }

    try {
      // Push the ad to adsbygoogle for rendering
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      console.log("Ad pushed to queue for rendering:", slot);
    } catch (error) {
      console.error("Error initializing ad:", error);
    }
  }, [slot]);

  const adContainerStyle = responsive
    ? { display: "block", width: "100%" }
    : { ...sizeMap[format], ...style };

  return (
    <div ref={adRef} className={`google-ad-container my-4 ${className}`} style={{ overflow: "hidden" }}>
      <ins
        className="adsbygoogle"
        style={adContainerStyle}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your actual ad client ID
        data-ad-slot={slot}
        data-ad-format={format === "auto" ? "auto" : ""}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
    </div>
  );
};

export default GoogleAd;
