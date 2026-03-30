import os

os.makedirs('src/components', exist_ok=True)

tax_logic_js = """export function calculateTax(grossIncome, annualRent = 0, deductPension = true, deductNHF = true) {
  let gross = Number(grossIncome) || 0;
  let rent = Number(annualRent) || 0;

  let pensionRelief = deductPension ? gross * 0.08 : 0;
  let nhfRelief = deductNHF ? gross * 0.025 : 0;
  let rentRelief = Math.min(500000, rent * 0.20);
  let totalExemptions = pensionRelief + nhfRelief + rentRelief;

  let taxableIncome = Math.max(0, gross - totalExemptions);

  const bands = [
    { limit: 800000, rate: 0.00 },
    { limit: 2200000, rate: 0.15 },
    { limit: 9000000, rate: 0.18 },
    { limit: 13000000, rate: 0.21 },
    { limit: 25000000, rate: 0.23 },
    { limit: Infinity, rate: 0.25 }
  ];

  let remaining = taxableIncome;
  let totalTax = 0;
  let taxBreakdown = [];
  let bandNames = [
    '₦0 - ₦800k (0%)',
    '₦800k - ₦3m (15%)',
    '₦3m - ₦12m (18%)',
    '₦12m - ₦25m (21%)',
    '₦25m - ₦50m (23%)',
    'Above ₦50m (25%)'
  ];

  for (let i = 0; i < bands.length; i++) {
    if (remaining <= 0) break;
    
    let limit = i === 5 ? Infinity : bands[i].limit;
    let amountInBand = Math.min(remaining, limit);
    let taxForBand = amountInBand * bands[i].rate;
    
    taxBreakdown.push({
      band: bandNames[i],
      amount: amountInBand,
      tax: taxForBand,
      rate: bands[i].rate * 100
    });
    
    totalTax += taxForBand;
    remaining -= amountInBand;
  }

  let netAnnual = gross - totalTax - pensionRelief - nhfRelief;
  let netMonthly = netAnnual / 12;
  
  return {
    gross,
    pensionRelief,
    nhfRelief,
    rentRelief,
    totalExemptions,
    taxableIncome,
    totalTax,
    netAnnual,
    netMonthly,
    taxBreakdown
  };
}"""
with open('src/TaxLogic.js', 'w', encoding='utf-8') as f:
    f.write(tax_logic_js)

index_css = """:root {
  --bg-color: #0f172a;
  --panel-bg: rgba(30, 41, 59, 0.7);
  --panel-border: rgba(255, 255, 255, 0.1);
  --accent: #10b981;
  --accent-hover: #059669;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --danger: #ef4444;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-image: radial-gradient(circle at top right, #1e293b, #0f172a);
}

.app-container {
  width: 100%;
  max-width: 900px;
  background: var(--panel-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--panel-border);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 3rem;
}

@media (max-width: 768px) {
  .app-container {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    gap: 2rem;
  }
}

.header {
  grid-column: 1 / -1;
  text-align: center;
  margin-bottom: 1rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #34d399, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.header p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-muted);
}

.form-input {
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--panel-border);
  border-radius: 12px;
  padding: 1rem 1rem 1rem 2.8rem;
  color: var(--text-main);
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.toggle-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 12px;
  border: 1px solid var(--panel-border);
  margin-bottom: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.toggle-group:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.toggle-checkbox {
  appearance: none;
  width: 48px;
  height: 26px;
  background: #334155;
  border-radius: 26px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: background 0.3s;
}
.toggle-checkbox::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}
.toggle-checkbox:checked {
  background: var(--accent);
}
.toggle-checkbox:checked::after {
  left: calc(100% - 2px);
  transform: translateX(-100%);
}

.form-section {
  display: flex;
  flex-direction: column;
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-card {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
  border: 1px solid var(--panel-border);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.result-card.highlight {
  border-color: var(--accent);
  box-shadow: 0 10px 30px -10px rgba(16, 185, 129, 0.3);
}

.result-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--accent);
  opacity: 0;
  transition: opacity 0.3s;
}

.result-card.highlight::before {
  opacity: 1;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.result-value {
  font-weight: 700;
  font-size: 1.1rem;
}

.result-value.large {
  font-size: 1.8rem;
  color: var(--accent);
}

.tax-bands {
  margin-top: 1rem;
}

.tax-bands-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-muted);
}

.band-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.band-item .band-amount {
  color: var(--text-main);
  font-family: monospace;
}"""
with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(index_css)

input_form = """import React from 'react';
import { Wallet, Home } from 'lucide-react';

export function InputForm({ data, onChange }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...data,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="form-section">
      <div className="form-group">
        <label>Gross Annual Income (₦)</label>
        <div className="input-wrapper">
          <Wallet className="input-icon" size={20} />
          <input
            type="number"
            name="grossIncome"
            className="form-input"
            value={data.grossIncome}
            onChange={handleChange}
            placeholder="e.g. 5000000"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Annual Rent Paid (₦) - Optional</label>
        <div className="input-wrapper">
          <Home className="input-icon" size={20} />
          <input
            type="number"
            name="annualRent"
            className="form-input"
            value={data.annualRent}
            onChange={handleChange}
            placeholder="e.g. 1200000"
          />
        </div>
      </div>

      <label className="toggle-group">
        <div>
          <div style={{fontWeight: 600, color: '#f8fafc'}}>Deduct Pension</div>
          <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>Standard 8% deduction</div>
        </div>
        <input
          type="checkbox"
          name="deductPension"
          className="toggle-checkbox"
          checked={data.deductPension}
          onChange={handleChange}
        />
      </label>

      <label className="toggle-group">
        <div>
          <div style={{fontWeight: 600, color: '#f8fafc'}}>Deduct NHF</div>
          <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>Standard 2.5% deduction</div>
        </div>
        <input
          type="checkbox"
          name="deductNHF"
          className="toggle-checkbox"
          checked={data.deductNHF}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}"""
with open('src/components/InputForm.jsx', 'w', encoding='utf-8') as f:
    f.write(input_form)

result_card = """import React from 'react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amount);
};

export function ResultCard({ results }) {
  if (!results || results.gross === 0) {
    return (
      <div className="results-section" style={{justifyContent: 'center', alignItems: 'center', opacity: 0.5}}>
        <p>Enter your income to see your tax breakdown.</p>
      </div>
    );
  }

  return (
    <div className="results-section">
      <div className="result-card">
        <div className="result-item">
          <span className="result-label">Gross Income</span>
          <span className="result-value">{formatCurrency(results.gross)}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Total Exemptions</span>
          <span className="result-value" style={{color: '#94a3b8'}}>-{formatCurrency(results.totalExemptions)}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Taxable Income</span>
          <span className="result-value">{formatCurrency(results.taxableIncome)}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Annual Tax Payable</span>
          <span className="result-value" style={{color: '#ef4444'}}>-{formatCurrency(results.totalTax)}</span>
        </div>
      </div>

      <div className="result-card highlight">
        <div className="result-item">
          <span className="result-label">Net Annual Income</span>
          <span className="result-value">{formatCurrency(results.netAnnual)}</span>
        </div>
        <div className="result-item" style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="result-label" style={{color: '#fff'}}>Net Monthly Income</span>
          <span className="result-value large">{formatCurrency(results.netMonthly)}</span>
        </div>
      </div>

      {results.totalTax > 0 && (
        <div className="result-card" style={{padding: '1.2rem'}}>
          <h3 className="tax-bands-title">Tax Bands Breakdown</h3>
          {results.taxBreakdown.map((band, i) => (
            <div key={i} className="band-item">
              <span>{band.band}</span>
              <span className="band-amount">{formatCurrency(band.tax)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}"""
with open('src/components/ResultCard.jsx', 'w', encoding='utf-8') as f:
    f.write(result_card)

app_jsx = """import React, { useState, useMemo } from 'react';
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

export default App;"""
with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(app_jsx)
