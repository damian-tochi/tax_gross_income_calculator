import React, { useState, useMemo, useEffect } from "react";
import { InputForm } from "./components/InputForm";
import { ResultCard } from "./components/ResultCard";
import { TaxAdvisoryDialog } from "./components/TaxAdvisoryDialog";
import { calculateTax, grossUpFromNet } from "./TaxLogic";
import "./index.css";

function App() {
  const [calculationMode, setCalculationMode] = useState("gross");
  const [isAdvisoryOpen, setIsAdvisoryOpen] = useState(false);
  const [hasShownAdvisory, setHasShownAdvisory] = useState(false);
  
  const [formData, setFormData] = useState({
    timeframe: "annual",
    incomeValue: "",
    annualRent: "",
    deductPension: true,
    deductNHF: false
  });

  const results = useMemo(() => {
    let baseIncome = Number(formData.incomeValue) || 0;
    let annualizedIncome = formData.timeframe === "monthly" ? baseIncome * 12 : baseIncome;

    if (calculationMode === "gross") {
      return calculateTax(
        annualizedIncome,
        formData.annualRent,
        formData.deductPension,
        formData.deductNHF
      );
    } else {
      return grossUpFromNet(
        annualizedIncome,
        formData.annualRent,
        formData.deductPension,
        formData.deductNHF
      );
    }
  }, [formData, calculationMode]);

  useEffect(() => {
    if (results.totalTax > 50000 && !hasShownAdvisory) {
      setHasShownAdvisory(true);
      setIsAdvisoryOpen(true);
    } else if (results.totalTax <= 50000) {
      setHasShownAdvisory(false);
    }
  }, [results.totalTax, hasShownAdvisory]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Naija Tax Calculator</h1>
        <p>2025/2026 Personal Income Tax Act</p>
      </header>
      
      <InputForm 
        data={formData} 
        onChange={setFormData} 
        mode={calculationMode} 
        onModeChange={setCalculationMode} 
      />
      <ResultCard results={results} mode={calculationMode} />
      
      {isAdvisoryOpen && results && (
        <TaxAdvisoryDialog 
          results={results} 
          onClose={() => setIsAdvisoryOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
