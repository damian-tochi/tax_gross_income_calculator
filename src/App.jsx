import React, { useState, useMemo, useEffect } from "react";
import { InputForm } from "./components/InputForm";
import { ResultCard } from "./components/ResultCard";
import { TaxAdvisoryDialog } from "./components/TaxAdvisoryDialog";
import { InfoPanel } from "./components/InfoPanel";
import { Info } from "lucide-react";
import { calculateTax, grossUpFromNet } from "./TaxLogic";
import "./index.css";

function App() {
  const [calculationMode, setCalculationMode] = useState("gross");
  const [isAdvisoryOpen, setIsAdvisoryOpen] = useState(false);
  const [hasShownAdvisory, setHasShownAdvisory] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
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
        <h1>Tax Deduction Estimator</h1>
        <p>2025/2026 Personal Income Tax Act</p>
        <button className="info-trigger-mobile mobile-only" onClick={() => setShowInfoModal(true)}>
          <Info size={18} /> What is {calculationMode === 'gross' ? 'Gross' : 'Net'}?
        </button>
      </header>
      
      <InputForm 
        data={formData} 
        onChange={setFormData} 
        mode={calculationMode} 
        onModeChange={setCalculationMode} 
      />
      
      <div className="main-result-stack">
        <ResultCard results={results} mode={calculationMode} />
        
        {/* Mobile-only summary card that appears after calculation */}
        <InfoPanel 
          mode={calculationMode} 
          results={results} 
          isMobileSummary={true} 
        />
      </div>
      
      {/* Desktop-only sidebar panel */}
      <InfoPanel mode={calculationMode} results={results} />

      {showInfoModal && (
        <InfoPanel 
          mode={calculationMode} 
          results={results}
          isMobileTriggered={true} 
          onClose={() => setShowInfoModal(false)} 
        />
      )}
      
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
