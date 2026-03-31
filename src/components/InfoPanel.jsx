import React from "react";
import { Info, X, ShieldCheck, Calculator } from "lucide-react";

export function InfoPanel({ mode, results, isMobileTriggered, isMobileSummary, onClose }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const isCalculated = results && results.gross > 0;

  const content = {
    gross: {
      title: "Understanding Gross Income",
      description: "Gross Income is the total amount of pay you receive before any taxes or mandatory deductions are taken out.",
      points: [
        "Include all allowances (Housing, Transport, etc).",
        "It's the value usually stated in your offer letter.",
        "Tax is calculated based on this figure AFTER reliefs."
      ]
    },
    net: {
      title: "Understanding Net Income",
      description: "Net Income (or 'Take-Home' pay) is the amount you actually receive in your bank account after all taxes, pension, and NHF have been deducted.",
      points: [
        "Useful for budgeting your actual spending.",
        "Gross-up calculations (Net-to-Gross) determine what your salary should be to reach this target.",
        "Takes into account all statutory 2026 deductions."
      ]
    }
  }[mode];

  if (isMobileTriggered) {
    return (
      <div className="modal-overlay">
        <div className="modal-content info-modal">
          <button className="modal-close" onClick={onClose}><X size={24} /></button>
          <div className="info-header">
            <Info className="info-icon-large" size={32} />
            <h2>{content.title}</h2>
          </div>
          <p className="info-description">{content.description}</p>
          <ul className="info-list">
            {content.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <button className="btn-primary" onClick={onClose} style={{ width: '100%', marginTop: '1.5rem' }}>Got It</button>
        </div>
      </div>
    );
  }

  // Summary View content (used by both Desktop and Mobile Summary card)
  const renderSummary = () => (
    <div className="summary-view" style={{ animation: "fadeIn 0.5s ease" }}>
      <div className="info-header" style={{ color: "var(--accent)" }}>
        <ShieldCheck className="info-icon-small" size={20} />
        <h3>Tax & Obligations</h3>
      </div>
      <p className="info-description">Based on your {mode === "gross" ? "Gross" : "Net"} income, here is a summary of your statutory standing:</p>
      
      <div className="obligation-card" style={{ background: "rgba(16, 185, 129, 0.1)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.2)", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>Total Statutory Bill:</span>
          <span style={{ fontWeight: "700", color: "var(--accent)" }}>{formatCurrency(results.totalTax + results.pensionRelief + results.nhfRelief)}</span>
        </div>
        <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>This includes PAYE Tax, Pension contributions, and NHF.</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
         <p style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.25rem", color: "var(--text-muted)" }}>Key Breakdown:</p>
         <div style={{ fontSize: "0.8rem", display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
           <span>Annual PAYE Tax</span>
           <span style={{ color: "var(--danger)" }}>{formatCurrency(results.totalTax)}</span>
         </div>
         <div style={{ fontSize: "0.8rem", display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
           <span>Pension (8%)</span>
           <span>{formatCurrency(results.pensionRelief)}</span>
         </div>
         {results.nhfRelief > 0 && (
           <div style={{ fontSize: "0.8rem", display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
             <span>NHF (2.5%)</span>
             <span>{formatCurrency(results.nhfRelief)}</span>
           </div>
         )}
      </div>

      <div className="info-footer" style={{ marginTop: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--accent)", opacity: 0.9 }}>
          <Calculator size={14} />
          <span>Effective Tax Rate: {((results.totalTax / results.gross) * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );

  if (isMobileSummary) {
    if (!isCalculated) return null;
    return (
      <div className="info-panel mobile-summary-card mobile-only" style={{ marginTop: '2rem' }}>
        {renderSummary()}
      </div>
    );
  }

  return (
    <div className="info-panel desktop-only">
      {!isCalculated ? (
        <>
          <div className="info-header">
            <Info className="info-icon-small" size={20} />
            <h3>{content.title}</h3>
          </div>
          <p className="info-description">{content.description}</p>
          <ul className="info-list">
            {content.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <div className="info-footer">
            <p>Enter an income to see your tax obligations summary.</p>
          </div>
        </>
      ) : renderSummary()}
    </div>
  );
}
