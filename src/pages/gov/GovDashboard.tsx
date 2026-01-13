import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { GlowCard } from "@/components/ui/glow-card";
import { useBondContext } from "@/context/BondContext";
import { Landmark, DollarSign, Users, Shield, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function GovDashboard() {
  const { complianceMetrics, bonds, transactions } = useBondContext();

  const bondDistribution = bonds.map(b => ({ name: b.name.split(' ')[0], value: b.totalSupply - b.availableSupply }));
  const COLORS = ['hsl(175, 80%, 50%)', 'hsl(260, 60%, 55%)', 'hsl(200, 80%, 60%)', 'hsl(145, 70%, 45%)', 'hsl(40, 90%, 55%)'];

  const txByType = [
    { type: 'Purchases', count: transactions.filter(t => t.type === 'purchase').length },
    { type: 'Listings', count: transactions.filter(t => t.type === 'listing').length },
    { type: 'Issuances', count: transactions.filter(t => t.type === 'issuance').length },
    { type: 'Settlements', count: transactions.filter(t => t.type === 'settlement').length },
  ];

  return (
    <DashboardLayout title="Government Oversight" subtitle="Transparency and compliance monitoring (Read-Only)">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Bonds Issued" value={complianceMetrics.totalBondsIssued} icon={<Landmark className="w-5 h-5" />} />
        <StatCard title="Total Value Issued" value={`$${(complianceMetrics.totalValueIssued / 1000000).toFixed(1)}M`} icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="Total Investments" value={`$${complianceMetrics.totalInvestments.toLocaleString()}`} icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Active Investors" value={complianceMetrics.activeInvestors.toLocaleString()} icon={<Users className="w-5 h-5" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <GlowCard>
          <h3 className="text-lg font-semibold text-foreground mb-4">Bond Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={bondDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {bondDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </GlowCard>
        <GlowCard>
          <h3 className="text-lg font-semibold text-foreground mb-4">Transaction Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={txByType}>
              <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlowCard>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <GlowCard>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-success" />
            <h4 className="font-semibold text-foreground">Compliance Score</h4>
          </div>
          <p className="text-4xl font-bold text-success">{complianceMetrics.complianceScore}%</p>
          <p className="text-sm text-muted-foreground mt-1">Excellent standing</p>
        </GlowCard>
        <GlowCard>
          <h4 className="font-semibold text-foreground mb-2">Settlements Today</h4>
          <p className="text-4xl font-bold text-foreground">{complianceMetrics.settlementsToday}</p>
          <p className="text-sm text-muted-foreground mt-1">All verified</p>
        </GlowCard>
        <GlowCard>
          <h4 className="font-semibold text-foreground mb-2">Audits Passed</h4>
          <p className="text-4xl font-bold text-foreground">{complianceMetrics.auditsPassed}</p>
          <p className="text-sm text-muted-foreground mt-1">100% success rate</p>
        </GlowCard>
      </div>
    </DashboardLayout>
  );
}
