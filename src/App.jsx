import React, { useState, useMemo } from 'react';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { calculateTax } from './TaxLogic';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    grossIncome: '',
    annualRent: '',
    deductPension: true,
    deductNHF: false
  });

  const results = useMemo(() => {
    return calculateTax(
      formData.grossIncome,
      formData.annualRent,
      formData.deductPension,
      formData.deductNHF
    );
  }, [formData]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Naija Tax Calculator</h1>
        <p>2025/2026 Personal Income Tax Act</p>
      </header>
      
      <InputForm data={formData} onChange={setFormData} />
      <ResultCard results={results} />
    </div>
  );
}

export default App;