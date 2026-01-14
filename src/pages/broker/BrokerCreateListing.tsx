import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBondContext } from "@/context/BondContext";
import { Plus, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 'select' | 'configure' | 'validate' | 'processing' | 'success';

export default function BrokerCreateListing() {
  const { bonds, listBond } = useBondContext();
  const availableBonds = bonds.filter(b => b.status === 'available');

  const [step, setStep] = useState<Step>('select');
  const [selectedBondId, setSelectedBondId] = useState('');
  const [listingConfig, setListingConfig] = useState({
    minInvestmentUnit: 1,
    availableQuantity: 0,
    listingStartDate: '',
    listingEndDate: '',
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const selectedBond = bonds.find(b => b.id === selectedBondId);

  const handleSelectBond = (bondId: string) => {
    const bond = bonds.find(b => b.id === bondId);
    if (bond) {
      setSelectedBondId(bondId);
      setListingConfig(prev => ({
        ...prev,
        availableQuantity: bond.availableSupply,
        minInvestmentUnit: bond.minInvestment,
      }));
    }
  };

  const handleValidate = () => {
    const errors: string[] = [];

    if (!selectedBondId) {
      errors.push('Please select a bond to list');
    }
    if (listingConfig.availableQuantity <= 0) {
      errors.push('Available quantity must be greater than 0');
    }
    if (selectedBond && listingConfig.availableQuantity > selectedBond.availableSupply) {
      errors.push('Quantity exceeds available supply');
    }
    if (listingConfig.minInvestmentUnit <= 0) {
      errors.push('Minimum investment unit must be greater than 0');
    }
    if (!listingConfig.listingStartDate) {
      errors.push('Please set a listing start date');
    }
    if (!listingConfig.listingEndDate) {
      errors.push('Please set a listing end date');
    }
    if (listingConfig.listingStartDate && listingConfig.listingEndDate) {
      if (new Date(listingConfig.listingEndDate) <= new Date(listingConfig.listingStartDate)) {
        errors.push('End date must be after start date');
      }
    }

    setValidationErrors(errors);
    
    if (errors.length === 0) {
      setStep('validate');
    }
  };

  const handlePublish = () => {
    setStep('processing');
    
    // Simulate processing
    setTimeout(() => {
      listBond(selectedBondId);
      setStep('success');
    }, 3000);
  };

  const resetForm = () => {
    setStep('select');
    setSelectedBondId('');
    setListingConfig({
      minInvestmentUnit: 1,
      availableQuantity: 0,
      listingStartDate: '',
      listingEndDate: '',
    });
    setValidationErrors([]);
  };

  return (
    <DashboardLayout title="Create Listing" subtitle="Publish bonds for investor purchase">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {['Select Bond', 'Configure', 'Validate', 'Publish'].map((label, idx) => {
            const stepIndex = ['select', 'configure', 'validate', 'success'].indexOf(step);
            const isActive = idx <= stepIndex || (step === 'processing' && idx === 3);
            const isCurrent = 
              (step === 'select' && idx === 0) ||
              (step === 'configure' && idx === 1) ||
              (step === 'validate' && idx === 2) ||
              ((step === 'processing' || step === 'success') && idx === 3);

            return (
              <div key={label} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted/30 text-muted-foreground",
                  isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}>
                  {idx + 1}
                </div>
                <span className={cn(
                  "ml-2 text-sm hidden sm:block",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {label}
                </span>
                {idx < 3 && (
                  <ArrowRight className="w-4 h-4 mx-4 text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Select Bond */}
        {step === 'select' && (
          <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Select Bond to List</h2>
                <p className="text-sm text-muted-foreground">Choose from available bonds issued by FIs</p>
              </div>
            </div>

            {availableBonds.length > 0 ? (
              <div className="space-y-3">
                {availableBonds.map((bond, index) => (
                  <div
                    key={bond.id}
                    onClick={() => handleSelectBond(bond.id)}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all duration-200 animate-fade-in",
                      selectedBondId === bond.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border/30 bg-muted/10 hover:border-primary/50"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{bond.name}</p>
                        <p className="text-sm text-muted-foreground">{bond.issuer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-success font-semibold">{bond.yield}%</p>
                        <p className="text-xs text-muted-foreground">{bond.tenure} months</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/30 flex justify-between text-sm">
                      <span className="text-muted-foreground">Available: {bond.availableSupply.toLocaleString()}</span>
                      <span className="text-muted-foreground">Value: ${bond.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No bonds available for listing</p>
                <p className="text-sm mt-1">Wait for new bond issuances from Financial Institutions</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button 
                onClick={() => setStep('configure')} 
                disabled={!selectedBondId}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Configure */}
        {step === 'configure' && selectedBond && (
          <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Configure Listing</h2>
                <p className="text-sm text-muted-foreground">Set listing parameters for {selectedBond.name}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minUnit">Minimum Investment Unit</Label>
                  <Input
                    id="minUnit"
                    type="number"
                    min={1}
                    value={listingConfig.minInvestmentUnit}
                    onChange={(e) => setListingConfig(prev => ({ ...prev, minInvestmentUnit: parseInt(e.target.value) || 0 }))}
                    className="bg-muted/20 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Available Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={selectedBond.availableSupply}
                    value={listingConfig.availableQuantity}
                    onChange={(e) => setListingConfig(prev => ({ ...prev, availableQuantity: parseInt(e.target.value) || 0 }))}
                    className="bg-muted/20 border-border/50"
                  />
                  <p className="text-xs text-muted-foreground">Max: {selectedBond.availableSupply.toLocaleString()}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Listing Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={listingConfig.listingStartDate}
                    onChange={(e) => setListingConfig(prev => ({ ...prev, listingStartDate: e.target.value }))}
                    className="bg-muted/20 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Listing End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={listingConfig.listingEndDate}
                    onChange={(e) => setListingConfig(prev => ({ ...prev, listingEndDate: e.target.value }))}
                    className="bg-muted/20 border-border/50"
                  />
                </div>
              </div>

              {validationErrors.length > 0 && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                  {validationErrors.map((error, i) => (
                    <p key={i} className="text-sm text-destructive flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button onClick={handleValidate} className="gap-2">
                Validate & Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Validate */}
        {step === 'validate' && selectedBond && (
          <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Validation Passed</h2>
                <p className="text-sm text-muted-foreground">Review and confirm listing details</p>
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-muted/10 border border-border/30">
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Bond Name</span>
                <span className="text-foreground font-medium">{selectedBond.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Issuer</span>
                <span className="text-foreground">{selectedBond.issuer}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Yield</span>
                <span className="text-success font-semibold">{selectedBond.yield}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Min Investment</span>
                <span className="text-foreground">{listingConfig.minInvestmentUnit} units</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Available Quantity</span>
                <span className="text-foreground">{listingConfig.availableQuantity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Listing Window</span>
                <span className="text-foreground">{listingConfig.listingStartDate} to {listingConfig.listingEndDate}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep('configure')}>
                Back
              </Button>
              <Button onClick={handlePublish} className="gap-2 bg-success hover:bg-success/90">
                <TrendingUp className="w-4 h-4" />
                Publish Listing
              </Button>
            </div>
          </Card>
        )}

        {/* Processing */}
        {step === 'processing' && (
          <Card className="p-8 bg-gradient-to-br from-card/80 to-card/40 border-border/50 text-center animate-fade-in">
            <Loader2 className="w-16 h-16 mx-auto mb-6 text-primary animate-spin" />
            <h2 className="text-xl font-bold text-foreground mb-2">Publishing Listing...</h2>
            <p className="text-muted-foreground">Please wait while we process your listing</p>
          </Card>
        )}

        {/* Success */}
        {step === 'success' && selectedBond && (
          <Card className="p-8 bg-gradient-to-br from-card/80 to-card/40 border-border/50 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Listing Published!</h2>
            <p className="text-muted-foreground mb-6">
              {selectedBond.name} is now available for investor purchase.
            </p>
            
            <div className="p-4 rounded-xl bg-success/10 border border-success/30 mb-6 inline-block">
              <p className="text-sm text-success">
                This bond is now visible in the Investor Dashboard under "Available Bonds"
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={resetForm}>
                Create Another Listing
              </Button>
              <Button onClick={() => window.location.href = '/broker/listings'}>
                View Listings
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
