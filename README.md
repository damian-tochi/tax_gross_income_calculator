# Tax Deduction Estimator

A modern, responsive web application for estimating Nigerian Personal Income Tax (PAYE) based on the 2025/2026 tax regulations. The tool supports both gross-to-net and net-to-gross calculations, accounting for statutory reliefs such as pension, NHF, and rent.

**Live Application:** [https://tax-gross-income-calculator.vercel.app/](https://tax-gross-income-calculator.vercel.app/)

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Project Structure](#project-structure)
6. [Installation & Setup](#installation--setup)
7. [Available Scripts](#available-scripts)
8. [Tax Logic Reference](#tax-logic-reference)
9. [Component Breakdown](#component-breakdown)
10. [Responsive Design](#responsive-design)
11. [Deployment](#deployment)
12. [Contributing](#contributing)

---

## Overview

The Tax Deduction Estimator helps Nigerian employees and individuals understand their tax obligations under the 2025/2026 Personal Income Tax Act. It computes:

- **PAYE Tax** across six progressive bands
- **Pension Relief** (8% of gross income)
- **NHF Relief** (2.5% of gross income)
- **Rent Relief** (20% of annual rent, capped at ₦500,000)
- **Net Income** after all deductions
- **Gross-Up** calculations for target net income

The application features a dark-themed, glassmorphism-inspired UI built with React and styled using modern CSS techniques including CSS Grid, backdrop-filter, and custom properties.

---

## Features

### Calculation Modes
- **From Gross Pay:** Enter gross income to see tax breakdown and net pay
- **From Net Pay:** Enter desired net income to compute the required gross income

### Statutory Deductions & Reliefs
- **Pension (8%):** Standard employee pension contribution
- **NHF (2.5%):** National Housing Fund contribution
- **Rent Relief (20%):** Calculated on annual rent paid, capped at ₦500,000

### Tax Bands (2025/2026)
| Band | Income Range | Rate |
|------|--------------|------|
| 1 | ₦0 – ₦800,000 | 0% |
| 2 | ₦800,001 – ₦3,000,000 | 15% |
| 3 | ₦3,000,001 – ₦12,000,000 | 18% |
| 4 | ₦12,000,001 – ₦25,000,000 | 21% |
| 5 | ₦25,000,001 – ₦50,000,000 | 23% |
| 6 | Above ₦50,000,000 | 25% |

### Interactive Features
- **Tax Advisory Wizard:** Triggers automatically when calculated tax exceeds ₦50,000, guiding users through employment and business ownership scenarios
- **Effective Tax Rate:** Displayed in the info panel
- **Timeframe Toggle:** Switch between annual and monthly income input
- **Mobile-Responsive:** Adaptive layout with mobile-specific summary cards and modal dialogs

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.4 | UI framework |
| **Vite** | 8.0.1 | Build tool and dev server |
| **lucide-react** | 1.7.0 | Icon library |
| **ESLint** | 9.39.4 | Code linting |

### Build Configuration
- **Vite Config:** Standard `@vitejs/plugin-react` setup
- **ESLint:** React Hooks and React Refresh plugins enabled
- **No TypeScript:** Pure JavaScript with ES modules

---

## Architecture

### Application Flow

```
User Input (Form)
      ↓
State Management (App.jsx)
      ↓
Tax Calculation Engine (TaxLogic.js)
      ↓
Results Rendering (ResultCard, InfoPanel)
```

### State Management
All application state is managed locally within `App.jsx` using React hooks:

- `calculationMode`: `"gross"` | `"net"`
- `formData`: `{ timeframe, incomeValue, annualRent, deductPension, deductNHF }`
- `isAdvisoryOpen`, `hasShownAdvisory`: Tax advisory dialog state
- `showInfoModal`: Information modal state

Results are computed via `useMemo` to ensure efficient re-rendering.

---

## Project Structure

```
tax_gross_income_calculator/
├── .env.local                    # Local environment variables
├── .gitignore
├── .vercel/                      # Vercel deployment configuration
├── eslint.config.js              # ESLint flat config
├── index.html                    # Vite entry HTML
├── package.json                  # Project dependencies and scripts
├── setup.py                      # Python setup (legacy)
├── vite.config.js                # Vite configuration
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                  # React entry point
    ├── index.css                 # Global styles and CSS variables
    ├── App.css                   # Legacy Vite template styles (unused)
    ├── App.jsx                   # Root component and state orchestrator
    ├── TaxLogic.js               # Pure tax calculation functions
    ├── components/
    │   ├── InputForm.jsx         # Income and deductions form
    │   ├── ResultCard.jsx        # Tax results display
    │   ├── InfoPanel.jsx         # Educational content and tax summary
    │   └── TaxAdvisoryDialog.jsx # Multi-step advisory wizard
    └── assets/
        ├── hero.png
        ├── react.svg
        └── vite.svg
```

---

## Installation & Setup

### Prerequisites
- **Node.js:** v18+ recommended
- **npm** or **yarn**

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tax_gross_income_calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

6. **Run ESLint**
   ```bash
   npm run lint
   ```

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev Server** | `npm run dev` | Starts Vite dev server with HMR on `localhost:5173` |
| **Build** | `npm run build` | Creates optimized production build in `dist/` |
| **Preview** | `npm run preview` | Serves the production build locally |
| **Lint** | `npm run lint` | Runs ESLint on all source files |

---

## Tax Logic Reference

### `calculateTax(grossIncome, annualRent, deductPension, deductNHF)`

Computes tax from a given gross annual income.

**Inputs:**
- `grossIncome` (number): Annual gross income in NGN
- `annualRent` (number): Annual rent paid in NGN
- `deductPension` (boolean): Whether to apply 8% pension relief
- `deductNHF` (boolean): Whether to apply 2.5% NHF relief

**Returns:**
```javascript
{
  gross,               // Input gross income
  pensionRelief,       // 8% of gross if enabled
  nhfRelief,           // 2.5% of gross if enabled
  rentRelief,          // min(500000, 0.20 * annualRent)
  totalExemptions,     // Sum of all reliefs
  taxableIncome,       // gross - totalExemptions (floored at 0)
  totalTax,            // Sum of all band taxes
  netAnnual,           // gross - totalTax - pensionRelief - nhfRelief
  netMonthly,          // netAnnual / 12
  taxBreakdown         // Array of { band, amount, tax, rate }
}
```

### `grossUpFromNet(targetNetAnnual, annualRent, deductPension, deductNHF)`

Computes the gross income required to achieve a specific net annual income.

**Method:** Binary search between `target` and `target * 5` for 100 iterations or until tolerance of 0.01 NGN is met.

---

## Component Breakdown

### `App.jsx`
- Root component containing all application state
- Coordinates calculation mode (`gross` / `net`)
- Triggers tax advisory dialog when `totalTax > 50000`
- Renders `InputForm`, `ResultCard`, `InfoPanel`, and `TaxAdvisoryDialog`

### `InputForm`
- Renders mode toggle (Gross / Net)
- Timeframe selector (Annual / Monthly)
- Income input with currency icon
- Annual rent input
- Toggle switches for Pension and NHF deductions
- Emits changes via `onChange` prop

### `ResultCard`
- Displays gross/net income prominently
- Shows total exemptions, taxable income, and annual tax payable
- Renders tax bands breakdown when `totalTax > 0`
- Highlights the primary result card based on calculation mode

### `InfoPanel`
- Educational content explaining Gross vs Net income
- Summary view showing statutory obligations (PAYE, Pension, NHF)
- Displays effective tax rate
- Supports three render modes:
  - **Desktop sidebar:** Persistent information panel
  - **Mobile summary card:** Appears after calculation
  - **Mobile modal:** Triggered by info button in header

### `TaxAdvisoryDialog`
- Multi-step wizard modal
- Step 1: Asks if user is employed
- Step 2: Explains PAYE is handled by employer
- Step 3: Asks if user owns a business
- Step 4: Suggests business registration with tax bands
- Step 5: Tax exemption notice (for unemployed/non-business owners)

---

## Responsive Design

### Breakpoints
| Breakpoint | Behavior |
|------------|----------|
| **> 1024px** | 3-column grid: Form | Results | Info Panel |
| **≤ 1024px** | 2-column grid: Form | Results (Info becomes modal) |
| **≤ 768px** | Single column stack with mobile-specific elements |

### Mobile Adaptations
- Desktop-only `InfoPanel` is hidden
- Mobile summary card appears below results
- Mode toggle buttons stack vertically
- Modal dialogs are full-width with scroll support
- Buttons in wizard expand to full width

---

## Deployment

This project is deployed on **Vercel** at:
**[https://tax-gross-income-calculator.vercel.app/](https://tax-gross-income-calculator.vercel.app/)**

### Vercel Configuration
- The project uses Vercel's auto-detection for Vite projects
- Build command: `npm run build`
- Output directory: `dist`
- No additional environment variables required

### Manual Deploy
```bash
npm install -g vercel
vercel
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Private - All rights reserved.
