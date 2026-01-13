import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { BondCard } from "@/components/ui/bond-card";
import { TransactionItem } from "@/components/ui/transaction-item";
import { useBondContext } from "@/context/BondContext";
import { TrendingUp, FileText, Users, DollarSign } from "lucide-react";

export default function BrokerDashboard() {
  const { broker, bonds, transactions, listBond } = useBondContext();
  const availableBonds = bonds.filter(b => b.status === 'available');
  const listedBonds = bonds.filter(b => broker.listedBonds.includes(b.id));
  const recentTx = transactions.filter(t => t.toId === broker.id || t.fromId === broker.id).slice(-5).reverse();

  return (
    <DashboardLayout title="Broker Dashboard" subtitle="Manage bond listings and investor demand">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Listed Bonds" value={broker.totalListings} icon={<FileText className="w-5 h-5" />} />
        <StatCard title="Transaction Volume" value={`$${(broker.transactionVolume / 1000000).toFixed(1)}M`} icon={<DollarSign className="w-5 h-5" />} trend={{ value: 12.5, isPositive: true }} />
        <StatCard title="Active Investors" value="1,247" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Pending Demands" value="34" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Bonds from Financial Institutions</h3>
          <div className="space-y-4">
            {availableBonds.map((bond) => (
              <BondCard key={bond.id} name={bond.name} issuer={bond.issuer} yield={bond.yield} tenure={bond.tenure} value={bond.value} minInvestment={bond.minInvestment} availableSupply={bond.availableSupply} status={bond.status} actionLabel="List for Investors" onAction={() => listBond(bond.id)} />
            ))}
            {availableBonds.length === 0 && <p className="text-muted-foreground">All bonds are already listed.</p>}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Currently Listed</h3>
          <div className="space-y-4">
            {listedBonds.slice(0, 3).map((bond) => (
              <BondCard key={bond.id} name={bond.name} issuer={bond.issuer} yield={bond.yield} tenure={bond.tenure} value={bond.value} minInvestment={bond.minInvestment} availableSupply={bond.availableSupply} status={bond.status} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentTx.map((tx) => (
            <TransactionItem key={tx.id} type={tx.type} description={tx.description} amount={tx.amount} value={tx.value} timestamp={tx.timestamp} status={tx.status} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
