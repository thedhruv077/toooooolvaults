
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const DateCalculator = () => {
  const navigate = useNavigate();

  // Redirect to the new Age Calculator page
  useEffect(() => {
    navigate("/calculators/age");
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Helmet>
        <title>Redirecting... | Tool Vault</title>
      </Helmet>
      <p>Redirecting to Age Calculator...</p>
    </div>
  );
};

export default DateCalculator;
