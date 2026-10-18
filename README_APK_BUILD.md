# Dhan Raj Games — Mobile App & Backend

A complete Satta Matka and Gaming mobile application built to match the provided application video flow 1:1.

## 📱 Features Implemented

1. **Authentication & Onboarding**:
   - Phone Number login screen with `+91` input, custom logo, and top-right Support button.
   - Profile Setup: Full Name entry with welcome banner.
   - 4-digit mPIN setup with Confirm mPIN and custom on-screen keypad.
   - Returning user login with 4-digit mPIN validation and exact "Invalid mpin." error handling.

2. **Home Dashboard**:
   - Header with sidebar drawer, notification center, and live wallet balance pill.
   - Hindi marquee announcement ticker.
   - Quick action buttons: **Dhan Starline**, **Dhan Jackpot**, **Add Money**, and **Withdraw Money**.
   - 20 Live Market Cards (Kalyan, Milan, Madhur, Dhanraj Morning/Day/Night, Sridevi, Time Bazar, Main Bazar, etc.) with real timings, running/closed status, panel chart info modal `(i)`, and glowing active play buttons.
   - Interactive bidding modal for Single Digit (0-9), Jodi Digit (00-99), Single Pana, Double Pana, Triple Pana, Half Sangam, and Full Sangam with real odds calculation and balance deduction.

3. **History & Ledger**:
   - 6 History categories: Game Bid History, Starline Bid History, Jackpot Bid History, Game Result History, Starline Result History, Jackpot Result History.
   - Result History screen with date selector and market results list.
   - Passbook / My Ledger screen with date navigation pill (`< 2026-10-17 >`) and credit/debit transaction logs.

4. **Wallet & Funds Management**:
   - **Add Fund**: User profile header, amount input, quick buttons (500, 1000, 1500, 2000), and Pay Now with UPI gateway simulation.
   - **Withdraw Fund**: Exact Terms & Conditions popup modal, payment method radio options (Gpay, PhonePe, Paytm, Bank Transfer), min ₹1000 check, and request submission.
   - **Bank Details**: Complete form for Account Holder Name, Account Number, IFSC, Bank Name, Branch, Gpay Number, PhonePe Number, and Paytm Number.
   - **Deposit & Withdrawal History**: Transaction logs with date picker and empty state illustrations.

5. **Support & Contact**:
   - Direct Call (`tel:+917231001800`), direct WhatsApp chat (`wa.me`), and interactive 24x7 in-app live chat support.

---

## 🛠️ Compiling into an Android APK

### Step 1: Ensure Flutter is Installed
```bash
flutter --version
flutter doctor
```

### Step 2: Navigate to the Flutter Project Directory
```bash
cd flutter_app
```

### Step 3: Install Flutter Dependencies
```bash
flutter pub get
```

### Step 4: Build the Release APK
```bash
flutter build apk --release
```
The compiled release APK will be located at:
`build/app/outputs/flutter-apk/app-release.apk`

---

## 🚀 Running the Node.js Backend API

```bash
# Start backend server
npx tsx server/server.ts
```
The API will run at `http://localhost:5000` with endpoints for `/api/auth`, `/api/wallet`, and `/api/bids`.
