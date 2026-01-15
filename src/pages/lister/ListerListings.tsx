import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useBondContext } from "@/context/BondContext";
import { Card } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { 
  FileText, Plus, Search, Filter, Eye, 
  TrendingUp, Calendar, DollarSign
} from "lucide-react";
import { LISTER_TYPE_INFO } from "@/types/bond";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function ListerListings() {
  const navigate = useNavigate();
  const { getListerBonds, getBondById } = useBondContext();
  const listerBonds = getListerBonds();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBondId, setSelectedBondId] = useState<string | null>(null);

  const selectedBond = selectedBondId ? getBondById(selectedBondId) : null;

  const filteredBonds = listerBonds.filter(bond => 
    bond.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bond.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="My Listings" subtitle="View and manage all your bond listings">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <GradientButton onClick={() => navigate('/lister/new-listing')} className="gap-2">
          <Plus className="w-4 h-4" />
          New Listing
        </GradientButton>
      </div>

      {/* Listings Table */}
      {filteredBonds.length > 0 ? (
        <Card className="overflow-hidden bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Bond Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Lister Type</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Yield</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Tenure</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Total Supply</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Available</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Created</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBonds.map((bond) => (
                  <tr 
                    key={bond.id} 
                    className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{bond.name}</p>
                          <p className="text-xs text-muted-foreground">{bond.issuer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-foreground">
                        {bond.listerType ? LISTER_TYPE_INFO[bond.listerType].label : 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-success">{bond.yield}%</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-foreground">{bond.tenure} months</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-foreground">{bond.totalSupply.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-foreground">{bond.availableSupply.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        bond.status === 'listed' ? 'bg-success/20 text-success' :
                        bond.status === 'pending' ? 'bg-warning/20 text-warning' :
                        bond.status === 'sold' ? 'bg-primary/20 text-primary' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {bond.status.charAt(0).toUpperCase() + bond.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">
                        {new Date(bond.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedBondId(bond.id)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-12 bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Listings Found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? 'No listings match your search criteria.' : 'Create your first bond listing to get started.'}
          </p>
          <GradientButton onClick={() => navigate('/lister/new-listing')} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Listing
          </GradientButton>
        </Card>
      )}

      {/* Bond Detail Dialog */}
      <Dialog open={!!selectedBond} onOpenChange={() => setSelectedBondId(null)}>
        <DialogContent className="sm:max-w-lg bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {selectedBond?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBond && (
            <div className="space-y-6">
              <p className="text-muted-foreground">{selectedBond.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Yield</p>
                  </div>
                  <p className="text-xl font-bold text-success">{selectedBond.yield}%</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Tenure</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{selectedBond.tenure} months</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Value</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">${selectedBond.value.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/20">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Lister Type</p>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedBond.listerType ? LISTER_TYPE_INFO[selectedBond.listerType].label : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/20">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Supply Sold</span>
                  <span className="text-sm font-medium text-foreground">
                    {((selectedBond.totalSupply - selectedBond.availableSupply) / selectedBond.totalSupply * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ 
                      width: `${((selectedBond.totalSupply - selectedBond.availableSupply) / selectedBond.totalSupply * 100)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Available: {selectedBond.availableSupply.toLocaleString()}</span>
                  <span>Total: {selectedBond.totalSupply.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
