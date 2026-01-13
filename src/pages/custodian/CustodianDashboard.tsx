import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { TransactionItem } from "@/components/ui/transaction-item";
import { GlowCard } from "@/components/ui/glow-card";
import { useBondContext } from "@/context/BondContext";
import { Shield, DollarSign, FileCheck, Users } from "lucide-react";

export default function CustodianDashboard() {
  const { custodian, bonds, transactions, investor, confirmSettlement } = useBondContext();
  const custodyBonds = bonds.filter(b => custodian.bondsInCustody.includes(b.id));
  const pendingSettlements = transactions.filter(t => t.type === 'settlement' && t.status === 'pending');
  const recentSettlements = transactions.filter(t => t.type === 'settlement').slice(-5).reverse();

  return (
    <DashboardLayout title="Custodian Dashboard" subtitle="Verify holdings and manage settlements">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Bonds in Custody" value={custodian.bondsInCustody.length} icon={<Shield className="w-5 h-5" />} />
        <StatCard title="Total Custody Value" value={`$${(custodian.totalCustodyValue / 1000000).toFixed(1)}M`} icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="Settlements Processed" value={custodian.settlementsProcessed} icon={<FileCheck className="w-5 h-5" />} trend={{ value: 8.3, isPositive: true }} />
        <StatCard title="Pending Verifications" value={pendingSettlements.length} icon={<Users className="w-5 h-5" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Holdings Under Custody</h3>
          <div className="space-y-4">
            {custodyBonds.map((bond) => (
              <GlowCard key={bond.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-foreground">{bond.name}</h4>
                    <p className="text-sm text-muted-foreground">{bond.issuer}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded bg-success/20 text-success">Verified</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div><p className="text-muted-foreground">Supply</p><p className="font-medium text-foreground">{bond.totalSupply.toLocaleString()}</p></div>
                  <div><p className="text-muted-foreground">Available</p><p className="font-medium text-foreground">{bond.availableSupply.toLocaleString()}</p></div>
                  <div><p className="text-muted-foreground">Value</p><p className="font-medium text-foreground">${bond.value.toLocaleString()}</p></div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Investor Ownership (Read-Only)</h3>
          <GlowCard>
            <div className="space-y-3">
              {investor.purchases.map((p) => {
                const bond = bonds.find(b => b.id === p.bondId);
                return (
                  <div key={p.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground text-sm">{bond?.name}</p>
                      <p className="text-xs text-muted-foreground">{investor.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground text-sm">{p.amount} units</p>
                      <p className="text-xs text-muted-foreground">${p.purchasePrice.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlowCard>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Settlements</h3>
        <div className="space-y-3">
          {recentSettlements.length > 0 ? recentSettlements.map((tx) => (
            <TransactionItem key={tx.id} type={tx.type} description={tx.description} amount={tx.amount} value={tx.value} timestamp={tx.timestamp} status={tx.status} />
          )) : <p className="text-muted-foreground">No recent settlements.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
