import React from 'react';
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
}