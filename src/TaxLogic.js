export function calculateTax(grossIncome, annualRent = 0, deductPension = true, deductNHF = true) {
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
    "₦0 - ₦800k (0%)",
    "₦800k - ₦3m (15%)",
    "₦3m - ₦12m (18%)",
    "₦12m - ₦25m (21%)",
    "₦25m - ₦50m (23%)",
    "Above ₦50m (25%)"
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
}

export function grossUpFromNet(targetNetAnnual, annualRent = 0, deductPension = true, deductNHF = true) {
  let target = Number(targetNetAnnual) || 0;
  if (target <= 0) return calculateTax(0, annualRent, deductPension, deductNHF);

  let low = target;
  let high = target * 5;
  let tolerance = 0.01;
  let bestGross = target;

  for (let i = 0; i < 100; i++) {
    let mid = (low + high) / 2;
    let result = calculateTax(mid, annualRent, deductPension, deductNHF);
    
    if (Math.abs(result.netAnnual - target) < tolerance) {
      bestGross = mid;
      break;
    }
    
    if (result.netAnnual < target) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return calculateTax(bestGross, annualRent, deductPension, deductNHF);
}
