import React, { useState } from 'react';

export function TaxAdvisoryDialog({ results, onClose }) {
  const [step, setStep] = useState(1);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        {step === 1 && (
          <div className="wizard-step">
            <h2>High Tax Advisory</h2>
            <p>Your calculated tax is quite high: <strong>{formatCurrency(results.totalTax)}</strong>.</p>
            <p>Are you currently employed?</p>
            <div className="wizard-actions">
              <button className="btn-primary" onClick={() => setStep(2)}>Yes</button>
              <button className="btn-secondary" onClick={() => setStep(3)}>No</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="wizard-step">
            <h2>Employment Tax Covered</h2>
            <p>Don't worry if a PAYE tax is made by your employer, it's automatically handled.</p>
            <div className="wizard-actions">
              <button className="btn-primary" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="wizard-step">
            <h2>Business Ownership</h2>
            <p>Since you are not employed, do you own a business?</p>
            <div className="wizard-actions">
              <button className="btn-primary" onClick={() => setStep(4)}>Yes</button>
              <button className="btn-secondary" onClick={() => setStep(3)}>No</button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="wizard-step wizard-scrollable">
            <h2>Business Filing</h2>
            <p>You should register a business name and file as a business. Based on your income, here are the tax brackets you fall under:</p>
            <div className="tax-bands">
              {results.taxBreakdown.filter(b => b.amount > 0).map((b, i) => (
                <div key={i} className="band-item">
                  <span>{b.band}</span>
                  <span className="band-amount">{formatCurrency(b.tax)}</span>
                </div>
              ))}
            </div>
            <div className="wizard-actions">
              <button className="btn-primary" onClick={onClose}>Got it</button>
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="wizard-step">
            <h2>Tax Exemption</h2>
            <p>If you are neither employed nor running a business, you shouldn't input an income because you are tax exempt.</p>
            <div className="wizard-actions">
              <button className="btn-primary" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}