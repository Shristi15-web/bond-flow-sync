import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useBondContext } from "@/context/BondContext";
import { Card } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  Briefcase, Shield, Building2, Landmark, 
  ArrowRight, ArrowLeft, CheckCircle2, AlertCircle,
  FileText, TrendingUp, Calendar, DollarSign, Loader2
} from "lucide-react";
import { ListerType, LISTER_TYPE_INFO } from "@/types/bond";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const listerTypeIcons: Record<ListerType, React.ElementType> = {
  broker: Briefcase,
  custodian: Shield,
  financial_institution: Building2,
  government_partner: Landmark,
};

export default function ListerNewListing() {
  const navigate = useNavigate();
  const { createBondListing } = useBondContext();
  
  const [step, setStep] = useState<'type' | 'details' | 'review' | 'success'>('type');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [listerType, setListerType] = useState<ListerType | null>(null);
  const [bondName, setBondName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [yieldPercent, setYieldPercent] = useState('');
  const [tenure, setTenure] = useState('');
  const [minInvestment, setMinInvestment] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [maturityDate, setMaturityDate] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (!bondName.trim()) newErrors.bondName = 'Bond name is required';
    if (!issuer.trim()) newErrors.issuer = 'Issuer is required';
    if (!yieldPercent || parseFloat(yieldPercent) <= 0) newErrors.yieldPercent = 'Valid yield is required';
    if (!tenure || parseInt(tenure) <= 0) newErrors.tenure = 'Valid tenure is required';
    if (!minInvestment || parseFloat(minInvestment) <= 0) newErrors.minInvestment = 'Valid minimum investment is required';
    if (!totalSupply || parseInt(totalSupply) <= 0) newErrors.totalSupply = 'Valid total supply is required';
    if (!value || parseFloat(value) <= 0) newErrors.value = 'Valid value is required';
    if (!maturityDate) newErrors.maturityDate = 'Maturity date is required';
    if (!description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 'type' && listerType) {
      setStep('details');
    } else if (step === 'details') {
      if (validateDetails()) {
        setStep('review');
      }
    }
  };

  const handleBack = () => {
    if (step === 'details') setStep('type');
    else if (step === 'review') setStep('details');
  };

  const handleSubmit = async () => {
    if (!listerType) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = createBondListing({
      name: bondName,
      issuer,
      listerType,
      yield: parseFloat(yieldPercent),
      tenure: parseInt(tenure),
      minInvestment: parseFloat(minInvestment),
      totalSupply: parseInt(totalSupply),
      value: parseFloat(value),
      description,
      maturityDate,
    });

    setIsSubmitting(false);

    if (result.success) {
      setStep('success');
      toast.success('Listing published successfully!');
    } else {
      toast.error(result.error || 'Failed to create listing');
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <DashboardLayout title="Create New Listing" subtitle="List a new tokenized government bond">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {['type', 'details', 'review'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                step === s || ['details', 'review'].indexOf(step) > ['type', 'details', 'review'].indexOf(s)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground'
              )}>
                {i + 1}
              </div>
              <span className={cn(
                "text-sm font-medium hidden sm:block",
                step === s ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {s === 'type' ? 'Lister Type' : s === 'details' ? 'Bond Details' : 'Review'}
              </span>
              {i < 2 && <ArrowRight className="w-4 h-4 text-muted-foreground ml-2" />}
            </div>
          ))}
        </div>

        {/* Step 1: Select Lister Type */}
        {step === 'type' && (
          <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm animate-fade-in">
            <h3 className="text-xl font-semibold text-foreground mb-2">Select Lister Type</h3>
            <p className="text-muted-foreground mb-6">Choose how you want to list this bond</p>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {(Object.keys(LISTER_TYPE_INFO) as ListerType[]).map((type) => {
                const Icon = listerTypeIcons[type];
                const info = LISTER_TYPE_INFO[type];
                return (
                  <button
                    key={type}
                    onClick={() => setListerType(type)}
                    className={cn(
                      "p-5 rounded-xl border-2 text-left transition-all duration-300 group",
                      listerType === type
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                        listerType === type ? 'bg-primary/20' : 'bg-muted/50 group-hover:bg-primary/10'
                      )}>
                        <Icon className={cn(
                          "w-6 h-6",
                          listerType === type ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                        )} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{info.label}</h4>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                      {listerType === type && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <GradientButton 
                onClick={handleNext} 
                disabled={!listerType}
                className="gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </GradientButton>
            </div>
          </Card>
        )}

        {/* Step 2: Bond Details */}
        {step === 'details' && (
          <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm animate-fade-in">
            <h3 className="text-xl font-semibold text-foreground mb-2">Bond Details</h3>
            <p className="text-muted-foreground mb-6">Enter the details of your bond listing</p>
            
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Bond Name *</label>
                  <input
                    type="text"
                    value={bondName}
                    onChange={(e) => setBondName(e.target.value)}
                    className={cn(inputClass, errors.bondName && 'border-destructive')}
                    placeholder="e.g., US Treasury 10Y"
                  />
                  {errors.bondName && <p className="text-xs text-destructive mt-1">{errors.bondName}</p>}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Issuer *</label>
                  <input
                    type="text"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    className={cn(inputClass, errors.issuer && 'border-destructive')}
                    placeholder="e.g., Federal Reserve"
                  />
                  {errors.issuer && <p className="text-xs text-destructive mt-1">{errors.issuer}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Yield (%) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={yieldPercent}
                    onChange={(e) => setYieldPercent(e.target.value)}
                    className={cn(inputClass, errors.yieldPercent && 'border-destructive')}
                    placeholder="e.g., 4.25"
                  />
                  {errors.yieldPercent && <p className="text-xs text-destructive mt-1">{errors.yieldPercent}</p>}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Tenure (months) *</label>
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className={cn(inputClass, errors.tenure && 'border-destructive')}
                    placeholder="e.g., 120"
                  />
                  {errors.tenure && <p className="text-xs text-destructive mt-1">{errors.tenure}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Min Investment (USDC) *</label>
                  <input
                    type="number"
                    value={minInvestment}
                    onChange={(e) => setMinInvestment(e.target.value)}
                    className={cn(inputClass, errors.minInvestment && 'border-destructive')}
                    placeholder="e.g., 100"
                  />
                  {errors.minInvestment && <p className="text-xs text-destructive mt-1">{errors.minInvestment}</p>}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Total Supply *</label>
                  <input
                    type="number"
                    value={totalSupply}
                    onChange={(e) => setTotalSupply(e.target.value)}
                    className={cn(inputClass, errors.totalSupply && 'border-destructive')}
                    placeholder="e.g., 1000000"
                  />
                  {errors.totalSupply && <p className="text-xs text-destructive mt-1">{errors.totalSupply}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Face Value (USDC) *</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={cn(inputClass, errors.value && 'border-destructive')}
                    placeholder="e.g., 10000"
                  />
                  {errors.value && <p className="text-xs text-destructive mt-1">{errors.value}</p>}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Maturity Date *</label>
                  <input
                    type="date"
                    value={maturityDate}
                    onChange={(e) => setMaturityDate(e.target.value)}
                    className={cn(inputClass, errors.maturityDate && 'border-destructive')}
                  />
                  {errors.maturityDate && <p className="text-xs text-destructive mt-1">{errors.maturityDate}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={cn(inputClass, "min-h-[100px]", errors.description && 'border-destructive')}
                  placeholder="Describe the bond and its terms..."
                />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <GradientButton onClick={handleNext} className="gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </GradientButton>
            </div>
          </Card>
        )}

        {/* Step 3: Review */}
        {step === 'review' && (
          <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm animate-fade-in">
            <h3 className="text-xl font-semibold text-foreground mb-2">Review Listing</h3>
            <p className="text-muted-foreground mb-6">Confirm the details before publishing</p>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/20">
                <div className="flex items-center gap-3 mb-4">
                  {listerType && (
                    <>
                      {(() => {
                        const Icon = listerTypeIcons[listerType];
                        return <Icon className="w-6 h-6 text-primary" />;
                      })()}
                      <span className="font-medium text-foreground">
                        {listerType && LISTER_TYPE_INFO[listerType].label}
                      </span>
                    </>
                  )}
                </div>
                <h4 className="text-xl font-bold text-foreground mb-1">{bondName}</h4>
                <p className="text-muted-foreground">{issuer}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Yield</span>
                  </div>
                  <p className="text-xl font-bold text-success">{yieldPercent}%</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tenure</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{tenure} months</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Face Value</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">${parseFloat(value).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Supply</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{parseInt(totalSupply).toLocaleString()}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/20">
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-foreground">{description}</p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <GradientButton 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Publish Listing
                  </>
                )}
              </GradientButton>
            </div>
          </Card>
        )}

        {/* Success State */}
        {step === 'success' && (
          <Card className="p-8 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Listing Published!</h3>
            <p className="text-muted-foreground mb-6">
              Your bond listing is now live and visible to investors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton onClick={() => navigate('/lister/listings')}>
                View My Listings
              </GradientButton>
              <button
                onClick={() => {
                  setStep('type');
                  setListerType(null);
                  setBondName('');
                  setIssuer('');
                  setYieldPercent('');
                  setTenure('');
                  setMinInvestment('');
                  setTotalSupply('');
                  setValue('');
                  setDescription('');
                  setMaturityDate('');
                }}
                className="px-6 py-3 rounded-xl border border-border/50 text-foreground hover:bg-muted/30 transition-colors"
              >
                Create Another Listing
              </button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
