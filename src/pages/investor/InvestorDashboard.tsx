import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { BondCard } from "@/components/ui/bond-card";
import { TransactionItem } from "@/components/ui/transaction-item";
import { useBondContext } from "@/context/BondContext";
import { Wallet, TrendingUp, PiggyBank, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { yieldHistoryData } from "@/data/dummyData";

export default function InvestorDashboard() {
  const { investor, bonds, transactions, purchaseBond, getBondById } = useBondContext();
  const listedBonds = bonds.filter(b => b.status === 'listed');
  const recentTx = transactions.filter(t => t.fromId === investor.id).slice(-5).reverse();

  return (
    <DashboardLayout title="Investor Dashboard" subtitle="Manage your bond investments">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Stablecoin Balance" value={`$${investor.balance.toLocaleString()}`} icon={<Wallet className="w-5 h-5" />} trend={{ value: 2.4, isPositive: true }} />
        <StatCard title="Total Invested" value={`$${investor.totalInvested.toLocaleString()}`} icon={<PiggyBank className="w-5 h-5" />} />
        <StatCard title="Returns Earned" value={`$${investor.totalReturns.toLocaleString()}`} icon={<TrendingUp className="w-5 h-5" />} trend={{ value: 4.2, isPositive: true }} />
        <StatCard title="Active Bonds" value={investor.purchases.length} icon={<Calendar className="w-5 h-5" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Yield Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card/60 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Yield Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={yieldHistoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Line type="monotone" dataKey="returns" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* My Portfolio */}
        <div className="rounded-xl border border-border bg-card/60 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">My Portfolio</h3>
          <div className="space-y-3">
            {investor.purchases.map((p) => {
              const bond = getBondById(p.bondId);
              return bond ? (
                <div key={p.id} className="p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="font-medium text-foreground text-sm">{bond.name}</p>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>${p.purchasePrice.toLocaleString()}</span>
                    <span className="text-success">+${p.expectedReturn.toFixed(0)}</span>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* Available Bonds */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Available Bonds</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listedBonds.slice(0, 3).map((bond) => (
            <BondCard
              key={bond.id}
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
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {recentTx.map((tx) => (
            <TransactionItem key={tx.id} type={tx.type} description={tx.description} amount={tx.amount} value={tx.value} timestamp={tx.timestamp} status={tx.status} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
