import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { useBondContext } from "@/context/BondContext";
import { Card } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  FileText, TrendingUp, DollarSign, Clock, Plus, 
  ArrowUpRight, BarChart3, Users
} from "lucide-react";
import { LISTER_TYPE_INFO } from "@/types/bond";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ListerDashboard() {
  const navigate = useNavigate();
  const { lister, getListerBonds, transactions } = useBondContext();
  const listerBonds = getListerBonds();

  // Get lister-related transactions
  const listerTransactions = transactions.filter(t => t.fromId === lister.id || t.toId === lister.id);

  // Chart data - bonds by status
  const listedCount = listerBonds.filter(b => b.status === 'listed').length;
  const pendingCount = listerBonds.filter(b => b.status === 'pending').length;
  const soldCount = listerBonds.filter(b => b.status === 'sold').length;

  const chartData = [
    { name: 'Listed', value: listedCount, fill: 'hsl(var(--primary))' },
    { name: 'Pending', value: pendingCount, fill: 'hsl(var(--warning))' },
    { name: 'Sold', value: soldCount, fill: 'hsl(var(--success))' },
  ];

  // Investor inflow chart (dummy data)
  const inflowData = [
    { month: 'Jan', inflow: 45000 },
    { month: 'Feb', inflow: 52000 },
    { month: 'Mar', inflow: 48000 },
    { month: 'Apr', inflow: 61000 },
    { month: 'May', inflow: 55000 },
    { month: 'Jun', inflow: 72000 },
  ];

  return (
    <DashboardLayout title="Lister Dashboard" subtitle="Manage your bond listings and track performance">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatCard 
            title="Total Bonds Listed" 
            value={lister.totalListings} 
            icon={<FileText className="w-5 h-5" />}
          />
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatCard 
            title="Active Listings" 
            value={listedCount} 
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: 12, isPositive: true }}
          />
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatCard 
            title="Total Volume Tokenized" 
            value={`$${(lister.totalVolumeTokenized / 1000000).toFixed(1)}M`} 
            icon={<DollarSign className="w-5 h-5" />}
          />
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-warning/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <StatCard 
            title="Pending Approvals" 
            value={pendingCount} 
            icon={<Clock className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Quick Action */}
      <div className="mb-8">
        <GradientButton 
          size="lg" 
          onClick={() => navigate('/lister/new-listing')}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Listing
        </GradientButton>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Bonds by Status */}
        <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Bonds by Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px'
                }} 
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Investor Inflow */}
        <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Investor Inflow</h3>
            </div>
            <div className="flex items-center gap-1 text-success text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              +18.2%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={inflowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px'
                }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Inflow']}
              />
              <Bar dataKey="inflow" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Listings */}
      <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Listings</h3>
          <button 
            onClick={() => navigate('/lister/listings')}
            className="text-sm text-primary hover:underline"
          >
            View All
          </button>
        </div>
        
        {listerBonds.length > 0 ? (
          <div className="space-y-4">
            {listerBonds.slice(0, 5).map((bond) => (
              <div 
                key={bond.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{bond.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {bond.listerType ? LISTER_TYPE_INFO[bond.listerType].label : 'N/A'} • {bond.yield}% yield
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">${bond.value.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    bond.status === 'listed' ? 'bg-success/20 text-success' :
                    bond.status === 'pending' ? 'bg-warning/20 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {bond.status.charAt(0).toUpperCase() + bond.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No listings yet. Create your first bond listing!</p>
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <button 
            onClick={() => navigate('/lister/activity')}
            className="text-sm text-primary hover:underline"
          >
            View All
          </button>
        </div>
        
        {listerTransactions.length > 0 ? (
          <div className="space-y-3">
            {listerTransactions.slice(0, 5).map((tx) => (
              <div 
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.type === 'listing' ? 'bg-primary/20' :
                    tx.type === 'purchase' ? 'bg-success/20' :
                    'bg-muted/30'
                  }`}>
                    {tx.type === 'listing' ? <FileText className="w-4 h-4 text-primary" /> :
                     tx.type === 'purchase' ? <DollarSign className="w-4 h-4 text-success" /> :
                     <Clock className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  tx.status === 'completed' ? 'bg-success/20 text-success' :
                  tx.status === 'pending' ? 'bg-warning/20 text-warning' :
                  'bg-destructive/20 text-destructive'
                }`}>
                  {tx.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">No recent activity</p>
        )}
      </Card>
    </DashboardLayout>
  );
}
