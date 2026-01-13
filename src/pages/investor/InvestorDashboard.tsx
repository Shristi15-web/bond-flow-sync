import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { BondCard } from "@/components/ui/bond-card";
import { TransactionItem } from "@/components/ui/transaction-item";
import { useBondContext } from "@/context/BondContext";
import { Wallet, TrendingUp, PiggyBank, Calendar, Coins, ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { yieldHistoryData } from "@/data/dummyData";

export default function InvestorDashboard() {
  const { investor, bonds, transactions, purchaseBond, getBondById } = useBondContext();
  const listedBonds = bonds.filter(b => b.status === 'listed');
  const recentTx = transactions.filter(t => t.fromId === investor.id).slice(-5).reverse();

  return (
    <DashboardLayout title="Investor Portfolio" subtitle="Track your bond investments and returns">
      {/* Portfolio Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatCard 
            title="Stablecoin Balance" 
            value={`$${investor.balance.toLocaleString()}`} 
            icon={<Wallet className="w-5 h-5" />} 
            trend={{ value: 2.4, isPositive: true }} 
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
            title="Returns Earned" 
            value={`$${investor.totalReturns.toLocaleString()}`} 
            icon={<TrendingUp className="w-5 h-5" />} 
            trend={{ value: 4.2, isPositive: true }} 
          />
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatCard 
            title="Active Bonds" 
            value={investor.purchases.length} 
            icon={<Calendar className="w-5 h-5" />} 
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Yield Performance Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6 hover:shadow-[0_0_40px_hsl(var(--primary)/0.1)] transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Yield Performance</h3>
              <p className="text-sm text-muted-foreground">Monthly returns overview</p>
            </div>
            <div className="flex items-center gap-2 text-success text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              +12.4% this month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={yieldHistoryData}>
              <defs>
                <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="returns" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorReturns)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* My Portfolio */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-6 hover:shadow-[0_0_40px_hsl(var(--secondary)/0.1)] transition-all duration-500">
          <div className="flex items-center gap-2 mb-6">
            <Coins className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">My Portfolio</h3>
          </div>
          <div className="space-y-3">
            {investor.purchases.length > 0 ? investor.purchases.map((p) => {
              const bond = getBondById(p.bondId);
              return bond ? (
                <div 
                  key={p.id} 
                  className="p-4 rounded-xl bg-muted/20 border border-border/30 hover:border-primary/30 hover:bg-muted/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{bond.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{bond.issuer}</p>
                    </div>
                    <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                      +${p.expectedReturn.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border/30">
                    <span>Invested: ${p.purchasePrice.toLocaleString()}</span>
                    <span>{p.amount} units</span>
                  </div>
                </div>
              ) : null;
            }) : (
              <div className="text-center py-8 text-muted-foreground">
                <PiggyBank className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No investments yet</p>
                <p className="text-sm mt-1">Browse bonds below to start investing</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Bonds */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Available Bonds</h3>
            <p className="text-sm text-muted-foreground">Government-backed securities ready for investment</p>
          </div>
          <span className="text-sm text-muted-foreground">{listedBonds.length} bonds available</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listedBonds.slice(0, 6).map((bond, index) => (
            <div 
              key={bond.id} 
              className="animate-fade-in" 
              style={{ animationDelay: `${index * 100}ms` }}
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
                onAction={() => purchaseBond(bond.id, 10)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Recent Transactions</h3>
          <span className="text-sm text-muted-foreground">{recentTx.length} transactions</span>
        </div>
        <div className="space-y-3">
          {recentTx.length > 0 ? recentTx.map((tx) => (
            <TransactionItem 
              key={tx.id} 
              type={tx.type} 
              description={tx.description} 
              amount={tx.amount} 
              value={tx.value} 
              timestamp={tx.timestamp} 
              status={tx.status} 
            />
          )) : (
            <div className="text-center py-8 text-muted-foreground rounded-xl bg-muted/10 border border-border/30">
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}