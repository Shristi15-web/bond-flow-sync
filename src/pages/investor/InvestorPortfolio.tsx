import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useBondContext } from "@/context/BondContext";
import { Wallet, TrendingUp, PiggyBank, Calendar, Coins, ChevronDown, ChevronUp } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { useState } from "react";

export default function InvestorPortfolio() {
  const { investor, getBondById } = useBondContext();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (purchaseId: string) => {
    setExpandedCard(expandedCard === purchaseId ? null : purchaseId);
  };

  return (
    <DashboardLayout title="My Portfolio" subtitle="Track your bond investments and holdings">
      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatCard 
            title="Stablecoin Balance" 
            value={`$${investor.balance.toLocaleString()}`} 
            icon={<Wallet className="w-5 h-5" />} 
          />
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatCard 
            title="Total Invested" 
            value={`$${investor.totalInvested.toLocaleString()}`} 
            icon={<PiggyBank className="w-5 h-5" />} 
          />
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatCard 
            title="Expected Returns" 
            value={`$${investor.totalReturns.toLocaleString()}`} 
            icon={<TrendingUp className="w-5 h-5" />} 
            trend={{ value: 4.2, isPositive: true }} 
          />
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatCard 
            title="Active Holdings" 
            value={investor.purchases.length} 
            icon={<Calendar className="w-5 h-5" />} 
          />
        </div>
      </div>

      {/* Holdings List */}
      <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Coins className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Bond Holdings</h3>
        </div>

        {investor.purchases.length > 0 ? (
          <div className="space-y-4">
            {investor.purchases.map((purchase) => {
              const bond = getBondById(purchase.bondId);
              const isExpanded = expandedCard === purchase.id;
              
              return bond ? (
                <div 
                  key={purchase.id} 
                  className={`rounded-xl bg-muted/20 border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isExpanded 
                      ? 'border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.15)]' 
                      : 'border-border/30 hover:border-primary/30 hover:bg-muted/30'
                  }`}
                  onClick={() => toggleCard(purchase.id)}
                >
                  {/* Compact Card (Always Visible) */}
                  <div className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center">
                          <Coins className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-lg">{bond.name}</p>
                          <p className="text-sm text-muted-foreground">{bond.issuer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Invested</p>
                          <p className="font-semibold text-foreground">${purchase.purchasePrice.toLocaleString()}</p>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-sm text-muted-foreground">Returns</p>
                          <p className="font-semibold text-success">+${purchase.expectedReturn.toFixed(2)}</p>
                        </div>
                        <div className={`p-2 rounded-full bg-muted/50 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded 
                        ? 'grid-rows-[1fr] opacity-100' 
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pt-0 border-t border-border/30">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-5">
                          <div className="p-3 rounded-lg bg-background/50">
                            <p className="text-xs text-muted-foreground mb-1">Bond Name</p>
                            <p className="text-foreground font-medium">{bond.name}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-background/50">
                            <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                            <p className="text-foreground font-medium">{purchase.amount} units</p>
                          </div>
                          <div className="p-3 rounded-lg bg-background/50">
                            <p className="text-xs text-muted-foreground mb-1">Invested Amount</p>
                            <p className="text-foreground font-medium">${purchase.purchasePrice.toLocaleString()}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-success/10">
                            <p className="text-xs text-muted-foreground mb-1">Returns Earned</p>
                            <p className="text-success font-medium">+${purchase.expectedReturn.toFixed(2)}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-background/50">
                            <p className="text-xs text-muted-foreground mb-1">Maturity Date</p>
                            <p className="text-foreground font-medium">{purchase.maturityDate}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-primary/10">
                            <p className="text-xs text-muted-foreground mb-1">Status</p>
                            <p className="text-primary font-medium">Active</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                          <div className="flex flex-wrap justify-between items-center gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Purchase Date</p>
                              <p className="text-foreground font-medium">{purchase.purchaseDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Annual Yield</p>
                              <p className="text-primary font-bold text-lg">{bond.yield}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Tenure</p>
                              <p className="text-foreground font-medium">{bond.tenure} months</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Total Value at Maturity</p>
                              <p className="text-success font-bold text-lg">
                                ${(purchase.purchasePrice + purchase.expectedReturn).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <PiggyBank className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No investments yet</p>
            <p className="text-sm mt-2">Browse available bonds to start investing</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}