import React, { useState, useMemo } from "react";
import { InputForm } from "./components/InputForm";
import { ResultCard } from "./components/ResultCard";
import { calculateTax, grossUpFromNet } from "./TaxLogic";
import "./index.css";

function App() {
  const [calculationMode, setCalculationMode] = useState("gross");
  
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
    </div>
  );
}

export default App;
