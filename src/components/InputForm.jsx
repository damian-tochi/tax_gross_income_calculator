import React from "react";
import { Wallet, Home } from "lucide-react";

export function InputForm({ data, onChange, mode, onModeChange }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...data,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const setTimeframe = (val) => {
    onChange({ ...data, timeframe: val });
  };

  return (
    <div className="form-section">
      <div className="mode-toggle-container">
        <button 
          className={`mode-btn ${mode === "gross" ? "active" : ""}`}
          onClick={() => onModeChange("gross")}
        >
          From Gross Pay
        </button>
        <button 
          className={`mode-btn ${mode === "net" ? "active" : ""}`}
          onClick={() => onModeChange("net")}
        >
          From Net Pay
        </button>
      </div>

      <div className="form-group" style={{display: "flex", gap: "1rem", marginBottom: "1.5rem"}}>
        <button 
          style={{
            flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--panel-border)",
            background: data.timeframe === "annual" ? "var(--accent)" : "rgba(15, 23, 42, 0.6)",
            color: data.timeframe === "annual" ? "#fff" : "var(--text-muted)",
            cursor: "pointer", fontWeight: 600, transition: "0.2s"
          }}
          onClick={() => setTimeframe("annual")}
        >
          Annual
        </button>
        <button 
          style={{
            flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--panel-border)",
            background: data.timeframe === "monthly" ? "var(--accent)" : "rgba(15, 23, 42, 0.6)",
            color: data.timeframe === "monthly" ? "#fff" : "var(--text-muted)",
            cursor: "pointer", fontWeight: 600, transition: "0.2s"
          }}
          onClick={() => setTimeframe("monthly")}
        >
          Monthly
        </button>
      </div>

      <div className="form-group">
        <label>
          {mode === "gross" ? `Gross ${data.timeframe === "annual" ? "Annual" : "Monthly"} Income (₦)` : `Target Net ${data.timeframe === "annual" ? "Annual" : "Monthly"} Income (₦)`}
        </label>
        <div className="input-wrapper">
          <Wallet className="input-icon" size={20} />
          <input
            type="number"
            name="incomeValue"
            className="form-input"
            value={data.incomeValue}
            onChange={handleChange}
            placeholder={data.timeframe === "annual" ? (mode === "gross" ? "e.g. 5000000" : "e.g. 3000000") : (mode === "gross" ? "e.g. 400000" : "e.g. 250000")}
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
          <div style={{fontWeight: 600, color: "#f8fafc"}}>Deduct Pension</div>
          <div style={{fontSize: "0.8rem", color: "#94a3b8"}}>Standard 8% deduction</div>
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
          <div style={{fontWeight: 600, color: "#f8fafc"}}>Deduct NHF</div>
          <div style={{fontSize: "0.8rem", color: "#94a3b8"}}>Standard 2.5% deduction</div>
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
