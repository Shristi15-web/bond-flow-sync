import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BondCard } from "@/components/ui/bond-card";
import { useBondContext } from "@/context/BondContext";
import { TrendingUp, Search, Filter } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function InvestorBonds() {
  const { bonds, purchaseBond, investor } = useBondContext();
  const [searchQuery, setSearchQuery] = useState('');
  const listedBonds = bonds.filter(b => b.status === 'listed');

  const filteredBonds = listedBonds.filter(bond => 
    bond.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bond.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePurchase = (bondId: string) => {
    const bond = bonds.find(b => b.id === bondId);
    if (!bond) return;
    
    const purchaseAmount = 10;
    const purchaseValue = (purchaseAmount / bond.totalSupply) * bond.value * purchaseAmount;
    
    if (investor.balance < purchaseValue) {
      toast({
        title: "Insufficient Balance",
        description: "Please add more stablecoins to your wallet to complete this purchase.",
        variant: "destructive",
      });
      return;
    }
    
    purchaseBond(bondId, purchaseAmount);
    toast({
      title: "Purchase Successful",
      description: `You've successfully purchased ${purchaseAmount} units of ${bond.name}`,
    });
  };

  return (
    <DashboardLayout title="Available Bonds" subtitle="Government-backed securities ready for investment">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bonds by name or issuer..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-card/60 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card/60 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>{filteredBonds.length} bonds available</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="text-sm text-muted-foreground">
          Your Balance: <span className="text-foreground font-medium">${investor.balance.toLocaleString()}</span>
        </div>
      </div>

      {/* Bond Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBonds.map((bond, index) => (
          <div 
            key={bond.id} 
            className="animate-fade-in" 
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <BondCard
              name={bond.name}
              issuer={bond.issuer}
              yield={bond.yield}
              tenure={bond.tenure}
              value={bond.value}
              minInvestment={bond.minInvestment}
              availableSupply={bond.availableSupply}
              status={bond.status}
              actionLabel="Buy Now"
              onAction={() => handlePurchase(bond.id)}
            />
          </div>
        ))}
      </div>

      {filteredBonds.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-border/50 bg-card/30">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No bonds found matching your search.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
