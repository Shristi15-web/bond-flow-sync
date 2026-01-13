import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { GlowCard } from "@/components/ui/glow-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { BondCard } from "@/components/ui/bond-card";
import { useBondContext } from "@/context/BondContext";
import { Building2, DollarSign, TrendingUp, Plus } from "lucide-react";

export default function FIDashboard() {
  const { financialInstitution, bonds, createBond, custodian } = useBondContext();
  const issuedBonds = bonds.filter(b => financialInstitution.issuedBonds.includes(b.id));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', issuer: '', yield: 4, tenure: 60, value: 5000, minInvestment: 50, totalSupply: 100000, description: '' });

  const handleCreate = () => {
    createBond({
      ...form,
      availableSupply: form.totalSupply,
      maturityDate: new Date(Date.now() + form.tenure * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      custodianId: custodian.id,
    });
    setShowForm(false);
    setForm({ name: '', issuer: '', yield: 4, tenure: 60, value: 5000, minInvestment: 50, totalSupply: 100000, description: '' });
  };

  return (
    <DashboardLayout
      title="Financial Institution"
      subtitle="Issue and manage government bonds"
      actions={<GradientButton onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Issue New Bond</GradientButton>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Bonds Issued" value={financialInstitution.issuedBonds.length} icon={<Building2 className="w-5 h-5" />} />
        <StatCard title="Total Value Issued" value={`$${(financialInstitution.totalIssuedValue / 1000000).toFixed(1)}M`} icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="Active Supply" value={financialInstitution.activeSupply.toLocaleString()} icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="Avg. Yield" value="3.95%" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      {showForm && (
        <GlowCard className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Create New Bond</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Bond Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-3 rounded-lg bg-input border border-border text-foreground" />
            <input placeholder="Issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className="px-4 py-3 rounded-lg bg-input border border-border text-foreground" />
            <input type="number" placeholder="Yield (%)" value={form.yield} onChange={(e) => setForm({ ...form, yield: +e.target.value })} className="px-4 py-3 rounded-lg bg-input border border-border text-foreground" />
            <input type="number" placeholder="Tenure (months)" value={form.tenure} onChange={(e) => setForm({ ...form, tenure: +e.target.value })} className="px-4 py-3 rounded-lg bg-input border border-border text-foreground" />
            <input type="number" placeholder="Value per Unit ($)" value={form.value} onChange={(e) => setForm({ ...form, value: +e.target.value })} className="px-4 py-3 rounded-lg bg-input border border-border text-foreground" />
            <input type="number" placeholder="Total Supply" value={form.totalSupply} onChange={(e) => setForm({ ...form, totalSupply: +e.target.value })} className="px-4 py-3 rounded-lg bg-input border border-border text-foreground" />
          </div>
          <div className="flex gap-4 mt-4">
            <GradientButton onClick={handleCreate}>Create Bond</GradientButton>
            <GradientButton variant="outline" onClick={() => setShowForm(false)}>Cancel</GradientButton>
          </div>
        </GlowCard>
      )}

      <h3 className="text-lg font-semibold text-foreground mb-4">Issued Bonds</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issuedBonds.map((bond) => (
          <BondCard key={bond.id} name={bond.name} issuer={bond.issuer} yield={bond.yield} tenure={bond.tenure} value={bond.value} minInvestment={bond.minInvestment} availableSupply={bond.availableSupply} status={bond.status} />
        ))}
      </div>
    </DashboardLayout>
  );
}
