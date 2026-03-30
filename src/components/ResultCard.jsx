import React from "react";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
};

export function ResultCard({ results, mode }) {
  if (!results || results.gross === 0) {
    return (
      <div className="results-section" style={{justifyContent: "center", alignItems: "center", opacity: 0.5}}>
        <p>Enter your {mode === "gross" ? "income" : "target net"} to see your tax breakdown.</p>
      </div>
    );
  }

  return (
    <div className="results-section">
      <div className={`result-card ${mode === "net" ? "highlight" : ""}`}>
        <div className="result-item">
          <span className="result-label" style={{color: mode === "net" ? "#fff" : ""}}>
            {mode === "net" ? "Required Gross Income" : "Gross Income"}
          </span>
          <span className={`result-value ${mode === "net" ? "large" : ""}`}>
            {formatCurrency(results.gross)}
          </span>
        </div>
        
        {mode === "net" && (
          <div className="result-item" style={{ marginTop: "0.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="result-label" style={{color: "#fff"}}>Required Monthly Gross</span>
            <span className="result-value large">{formatCurrency(results.gross / 12)}</span>
          </div>
        )}
      </div>

      <div className="result-card">
        <div className="result-item">
          <span className="result-label">Total Exemptions</span>
          <span className="result-value" style={{color: "#94a3b8"}}>-{formatCurrency(results.totalExemptions)}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Taxable Income</span>
          <span className="result-value">{formatCurrency(results.taxableIncome)}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Annual Tax Payable</span>
          <span className="result-value" style={{color: "#ef4444"}}>-{formatCurrency(results.totalTax)}</span>
        </div>
      </div>

      <div className={`result-card ${mode === "gross" ? "highlight" : ""}`}>
        <div className="result-item">
          <span className="result-label" style={{color: mode === "gross" ? "#fff" : ""}}>Net Annual Income</span>
          <span className={`result-value ${mode === "gross" ? "large" : ""}`}>{formatCurrency(results.netAnnual)}</span>
        </div>
        {mode === "gross" && (
          <div className="result-item" style={{ marginTop: "0.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="result-label" style={{color: "#fff"}}>Net Monthly Income</span>
            <span className="result-value large">{formatCurrency(results.netMonthly)}</span>
          </div>
        )}
      </div>

      {results.totalTax > 0 && (
        <div className="result-card" style={{padding: "1.2rem"}}>
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
}
