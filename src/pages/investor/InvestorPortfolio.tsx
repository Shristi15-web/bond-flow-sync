import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useBondContext } from "@/context/BondContext";
import { Wallet, TrendingUp, PiggyBank, Calendar, Coins } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";

export default function InvestorPortfolio() {
  const { investor, getBondById } = useBondContext();

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
              return bond ? (
                <div 
                  key={purchase.id} 
                  className="p-5 rounded-xl bg-muted/20 border border-border/30 hover:border-primary/30 hover:bg-muted/30 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">{bond.name}</p>
                      <p className="text-sm text-muted-foreground">{bond.issuer}</p>
                    </div>
                    <span className="text-sm font-medium text-success bg-success/10 px-3 py-1 rounded-full">
                      +${purchase.expectedReturn.toFixed(2)} expected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Invested</p>
                      <p className="text-foreground font-medium">${purchase.purchasePrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Units</p>
                      <p className="text-foreground font-medium">{purchase.amount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Purchase Date</p>
                      <p className="text-foreground font-medium">{purchase.purchaseDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Maturity</p>
                      <p className="text-foreground font-medium">{purchase.maturityDate}</p>
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
