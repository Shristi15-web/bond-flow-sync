import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useBondContext } from "@/context/BondContext";
import { Wallet, ArrowRightLeft, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";

type WalletStep = 'main' | 'amount' | 'payment' | 'processing' | 'success';

const CONVERSION_RATE = 83; // 1 USDT = ₹83

export default function InvestorWallet() {
  const { investor, addStablecoins } = useBondContext();
  const [step, setStep] = useState<WalletStep>('main');
  const [inputMode, setInputMode] = useState<'INR' | 'USDT'>('INR');
  const [inrAmount, setInrAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

  const handleInrChange = (value: string) => {
    setInrAmount(value);
    const numValue = parseFloat(value) || 0;
    setUsdtAmount((numValue / CONVERSION_RATE).toFixed(2));
  };

  const handleUsdtChange = (value: string) => {
    setUsdtAmount(value);
    const numValue = parseFloat(value) || 0;
    setInrAmount((numValue * CONVERSION_RATE).toFixed(2));
  };

  const handleConfirmPayment = () => {
    setStep('processing');
    setTimeout(() => {
      const finalUsdt = parseFloat(usdtAmount) || 0;
      addStablecoins(finalUsdt);
      setStep('success');
    }, 4000);
  };

  const handleReset = () => {
    setStep('main');
    setInrAmount('');
    setUsdtAmount('');
  };

  return (
    <DashboardLayout title="Wallet" subtitle="Manage your stablecoin balance">
      {/* Main Wallet View */}
      {step === 'main' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Balance Card */}
          <div className="relative rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stablecoin Balance</p>
                  <h2 className="text-3xl font-bold text-foreground">${investor.balance.toLocaleString()}</h2>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/20 border border-border/30">
                <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Conversion Rate: <span className="text-foreground font-medium">1 USDT = ₹{CONVERSION_RATE}</span>
                </p>
              </div>

              <GradientButton 
                className="w-full mt-6 hover:scale-[1.02] transition-transform duration-300"
                onClick={() => setStep('amount')}
              >
                Buy Stablecoins
              </GradientButton>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-border/50 bg-card/60 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
                <p className="text-sm text-muted-foreground">INR Equivalent</p>
                <p className="text-xl font-bold text-foreground">₹{(investor.balance * CONVERSION_RATE).toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
                <p className="text-sm text-muted-foreground">Currency</p>
                <p className="text-xl font-bold text-foreground">USDT</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Amount Selection */}
      {step === 'amount' && (
        <div className="max-w-xl mx-auto">
          <button 
            onClick={() => setStep('main')}
            className="text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            ← Back to Wallet
          </button>

          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-8">
            <h3 className="text-xl font-bold text-foreground mb-2">Buy Stablecoins</h3>
            <p className="text-sm text-muted-foreground mb-6">Enter the amount you want to purchase</p>

            {/* Currency Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setInputMode('INR')}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  inputMode === 'INR' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                Enter in INR
              </button>
              <button
                onClick={() => setInputMode('USDT')}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  inputMode === 'USDT' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                Enter in USDT
              </button>
            </div>

            {/* Amount Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Amount in INR (₹)</label>
                <input
                  type="number"
                  value={inrAmount}
                  onChange={(e) => handleInrChange(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-input border border-border text-foreground text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  placeholder="0.00"
                  disabled={inputMode === 'USDT'}
                />
              </div>

              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                  <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Amount in USDT ($)</label>
                <input
                  type="number"
                  value={usdtAmount}
                  onChange={(e) => handleUsdtChange(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-input border border-border text-foreground text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  placeholder="0.00"
                  disabled={inputMode === 'INR'}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-4">
              Rate: 1 USDT = ₹{CONVERSION_RATE}
            </p>

            <GradientButton 
              className="w-full mt-6 hover:scale-[1.02] transition-transform duration-300"
              onClick={() => setStep('payment')}
              disabled={!usdtAmount || parseFloat(usdtAmount) <= 0}
            >
              Continue to Payment
            </GradientButton>
          </div>
        </div>
      )}

      {/* Payment Method */}
      {step === 'payment' && (
        <div className="max-w-xl mx-auto">
          <button 
            onClick={() => setStep('amount')}
            className="text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            ← Back
          </button>

          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-8">
            <h3 className="text-xl font-bold text-foreground mb-2">Payment Details</h3>
            <p className="text-sm text-muted-foreground mb-6">Review your purchase and select payment method</p>

            {/* Order Summary */}
            <div className="p-5 rounded-xl bg-muted/20 border border-border/30 mb-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount (INR)</span>
                  <span className="text-foreground font-medium">₹{parseFloat(inrAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You'll Receive</span>
                  <span className="text-foreground font-bold">{parseFloat(usdtAmount).toLocaleString()} USDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span className="text-muted-foreground">1 USDT = ₹{CONVERSION_RATE}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-muted-foreground">Select Payment Method</h4>
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'upi' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border/50 bg-muted/10 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">₹</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">UPI Payment</p>
                    <p className="text-sm text-muted-foreground">Pay via Google Pay, PhonePe, etc.</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'card' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border/50 bg-muted/10 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Card Payment</p>
                    <p className="text-sm text-muted-foreground">Debit or Credit Card</p>
                  </div>
                </div>
              </div>
            </div>

            <GradientButton 
              className="w-full hover:scale-[1.02] transition-transform duration-300"
              onClick={handleConfirmPayment}
            >
              Confirm Payment
            </GradientButton>
          </div>
        </div>
      )}

      {/* Processing */}
      {step === 'processing' && (
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-10 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Processing Payment</h3>
            <p className="text-muted-foreground">Please wait while we confirm your transaction...</p>
            
            <div className="mt-6 h-2 bg-border/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse rounded-full w-2/3" />
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {step === 'success' && (
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-10 text-center animate-scale-in">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center border border-green-500/30">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground mb-4">
              {parseFloat(usdtAmount).toLocaleString()} USDT has been added to your wallet
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              New Balance: <span className="text-foreground font-bold">${investor.balance.toLocaleString()}</span>
            </p>
            
            <GradientButton 
              className="w-full hover:scale-[1.02] transition-transform duration-300"
              onClick={handleReset}
            >
              Back to Wallet
            </GradientButton>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
